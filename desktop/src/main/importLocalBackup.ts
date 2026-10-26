import { readFileSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import type Database from 'better-sqlite3'

import { getDatabase } from './database'

type RecordData = Record<string, unknown>

type TableName =
  | 'arcanists'
  | 'arcanist_skills'
  | 'arcanist_portray'
  | 'status_effects'
  | 'arcanist_status_effects'

const TABLES: TableName[] = [
  'arcanists',
  'arcanist_skills',
  'arcanist_portray',
  'status_effects',
  'arcanist_status_effects'
]

function object(value: unknown, label: string): RecordData {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }

  return value as RecordData
}

function text(row: RecordData, key: string): string {
  const value = row[key]

  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value !== 'string') {
    throw new Error(`${key} must be a string.`)
  }

  return value
}

function strings(row: RecordData, key: string): string[] {
  const value = row[key]

  if (value === undefined || value === null) {
    return []
  }

  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`${key} must be an array of strings.`)
  }

  return value as string[]
}

function records(row: RecordData, key: string): RecordData[] {
  const value = row[key]

  if (value === undefined || value === null) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`)
  }

  return value.map((item, index) => object(item, `${key}[${index}]`))
}

function requiredId(row: RecordData): string {
  const id = text(row, 'id')

  if (!id.trim()) {
    throw new Error('Record has an empty ID.')
  }

  return id
}

function parseStorageList(value: unknown, key: string): RecordData[] {
  if (value === null) {
    return []
  }

  if (typeof value !== 'string') {
    throw new Error(`${key} must contain JSON text or null.`)
  }

  const parsed: unknown = JSON.parse(value)

  if (!Array.isArray(parsed)) {
    throw new Error(`${key} is not an array.`)
  }

  return parsed.map((item, index) => object(item, `${key}[${index}]`))
}

function uniqueIds(items: RecordData[], label: string): Set<string> {
  const ids = new Set<string>()

  for (const item of items) {
    const id = requiredId(item)

    if (ids.has(id)) {
      throw new Error(`Duplicate ${label} ID: ${id}`)
    }

    if (!text(item, 'name').trim()) {
      throw new Error(`${label} ${id} has no name.`)
    }

    ids.add(id)
  }

  return ids
}

interface BackupData {
  arcanists: RecordData[]
  statusEffects: RecordData[]
  relationships: Array<[string, string]>
  exportedAt: string
}

function loadBackup(filePath: string): BackupData {
  if (!isAbsolute(filePath)) {
    throw new Error('Backup path must be absolute.')
  }

  const contents = readFileSync(filePath, 'utf8')
  const root = object(JSON.parse(contents) as unknown, 'Backup')

  if (root.format !== 'the-suitcase-lab-localstorage-backup' || root.version !== 1) {
    throw new Error('Unsupported backup format or version.')
  }

  const storage = object(root.storage, 'Backup storage')
  const counts = object(root.counts, 'Backup counts')

  const arcanists = parseStorageList(storage.reverse1999_arcanists, 'reverse1999_arcanists')

  const statusEffects = parseStorageList(
    storage.reverse1999_status_effects,
    'reverse1999_status_effects'
  )

  if (counts.arcanists !== arcanists.length || counts.statusEffects !== statusEffects.length) {
    throw new Error('Backup counts do not match the stored records.')
  }

  const arcanistIds = uniqueIds(arcanists, 'Arcanist')
  const statusIds = uniqueIds(statusEffects, 'Status Effect')

  const relationships = new Map<string, [string, string]>()

  function addRelationship(arcanistId: string, statusId: string): void {
    if (!arcanistIds.has(arcanistId) || !statusIds.has(statusId)) {
      throw new Error(`Invalid relationship: ${arcanistId} -> ${statusId}`)
    }

    const pair: [string, string] = [arcanistId, statusId]
    relationships.set(JSON.stringify(pair), pair)
  }

  for (const arcanist of arcanists) {
    const id = requiredId(arcanist)

    for (const statusId of strings(arcanist, 'relatedStatusEffects')) {
      addRelationship(id, statusId)
    }
  }

  for (const statusEffect of statusEffects) {
    const id = requiredId(statusEffect)

    for (const arcanistId of strings(statusEffect, 'relatedArcanists')) {
      addRelationship(arcanistId, id)
    }
  }

  return {
    arcanists,
    statusEffects,
    relationships: [...relationships.values()],
    exportedAt: text(root, 'exportedAt')
  }
}

function portrayLevel(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  const level = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN

  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Invalid Portray level.')
  }

  return level
}

function databaseCounts(db: Database.Database): Record<TableName, number> {
  const result = {} as Record<TableName, number>

  for (const table of TABLES) {
    const row = db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get() as { total: number }

    result[table] = row.total
  }

  return result
}

function importIntoDatabase(db: Database.Database, backup: BackupData): void {
  const insertArcanist = db.prepare(`
    INSERT INTO arcanists (
      id, name, image, afflatus, damage_type,
      roles_json, mechanics, tags_json, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertSkill = db.prepare(`
    INSERT INTO arcanist_skills (
      arcanist_id, sort_order, name, skill_type, description
    )
    VALUES (?, ?, ?, ?, ?)
  `)

  const insertPortray = db.prepare(`
    INSERT INTO arcanist_portray (
      arcanist_id, sort_order, level, description
    )
    VALUES (?, ?, ?, ?)
  `)

  const insertStatusEffect = db.prepare(`
    INSERT INTO status_effects (
      id, name, category, description, effect,
      duration, stackable, related_mechanics_json,
      tags_json, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertRelationship = db.prepare(`
    INSERT INTO arcanist_status_effects (
      arcanist_id, status_effect_id
    )
    VALUES (?, ?)
  `)

  const migrate = db.transaction((): void => {
    const currentCounts = databaseCounts(db)

    if (Object.values(currentCounts).some((count) => count > 0)) {
      throw new Error('SQLite already contains data. Import blocked to prevent overwriting.')
    }

    let skillsCount = 0
    let portrayCount = 0

    for (const arcanist of backup.arcanists) {
      const id = requiredId(arcanist)

      insertArcanist.run(
        id,
        text(arcanist, 'name'),
        text(arcanist, 'image'),
        text(arcanist, 'afflatus'),
        text(arcanist, 'damageType'),
        JSON.stringify(strings(arcanist, 'roles')),
        text(arcanist, 'mechanics'),
        JSON.stringify(strings(arcanist, 'tags')),
        text(arcanist, 'notes')
      )

      records(arcanist, 'skills').forEach((skill, index) => {
        insertSkill.run(
          id,
          index,
          text(skill, 'name'),
          text(skill, 'type'),
          text(skill, 'description')
        )

        skillsCount++
      })

      records(arcanist, 'portray').forEach((entry, index) => {
        insertPortray.run(id, index, portrayLevel(entry.level), text(entry, 'description'))

        portrayCount++
      })
    }

    for (const statusEffect of backup.statusEffects) {
      const stackable = statusEffect.stackable

      if (stackable !== undefined && stackable !== null && typeof stackable !== 'boolean') {
        throw new Error('Status Effect stackable must be boolean.')
      }

      insertStatusEffect.run(
        requiredId(statusEffect),
        text(statusEffect, 'name'),
        text(statusEffect, 'category'),
        text(statusEffect, 'description'),
        text(statusEffect, 'effect'),
        text(statusEffect, 'duration'),
        stackable === true ? 1 : 0,
        JSON.stringify(strings(statusEffect, 'relatedMechanics')),
        JSON.stringify(strings(statusEffect, 'tags')),
        text(statusEffect, 'notes')
      )
    }

    for (const [arcanistId, statusId] of backup.relationships) {
      insertRelationship.run(arcanistId, statusId)
    }

    const actual = databaseCounts(db)

    const expected: Record<TableName, number> = {
      arcanists: backup.arcanists.length,
      arcanist_skills: skillsCount,
      arcanist_portray: portrayCount,
      status_effects: backup.statusEffects.length,
      arcanist_status_effects: backup.relationships.length
    }

    for (const table of TABLES) {
      if (actual[table] !== expected[table]) {
        throw new Error(`Migration count mismatch: ${table}`)
      }
    }

    const foreignKeyErrors = db.pragma('foreign_key_check') as unknown[]

    if (foreignKeyErrors.length > 0) {
      throw new Error('SQLite foreign key verification failed.')
    }
  })

  migrate()
}

export function importLocalBackupFromEnvironment(): void {
  const filePath = process.env['SUITCASE_BACKUP_FILE']

  if (!filePath) {
    return
  }

  const backup = loadBackup(filePath)

  const skillCount = backup.arcanists.reduce(
    (count, arcanist) => count + records(arcanist, 'skills').length,
    0
  )

  const portrayCount = backup.arcanists.reduce(
    (count, arcanist) => count + records(arcanist, 'portray').length,
    0
  )

  console.log('[SQLite Import] Backup:', filePath)
  console.log('[SQLite Import] Exported at:', backup.exportedAt)

  console.log('[SQLite Import] Preview:', {
    arcanists: backup.arcanists.length,
    skills: skillCount,
    portray: portrayCount,
    statusEffects: backup.statusEffects.length,
    relationships: backup.relationships.length
  })

  if (process.env['SUITCASE_IMPORT_CONFIRM'] !== 'YES') {
    console.log('[SQLite Import] PREVIEW ONLY. No data was written.')
    return
  }

  const db = getDatabase()

  importIntoDatabase(db, backup)

  console.log('[SQLite Import] IMPORT SUCCESSFUL.')
  console.log('[SQLite Import] Database counts:', databaseCounts(db))
}
