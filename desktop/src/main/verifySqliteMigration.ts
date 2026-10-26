import { readFileSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import type Database from 'better-sqlite3'

import { getDatabase } from './database'

type SourceRecord = Record<string, unknown>
type Scalar = string | number | null

interface ComparableRow {
  key: string
  [column: string]: Scalar
}

function asObject(value: unknown, label: string): SourceRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }

  return value as SourceRecord
}

function readText(record: SourceRecord, field: string): string {
  const value = record[field]

  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`)
  }

  return value
}

function readStrings(record: SourceRecord, field: string): string[] {
  const value = record[field]

  if (value === undefined || value === null) {
    return []
  }

  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`${field} must contain strings.`)
  }

  return value as string[]
}

function readObjects(record: SourceRecord, field: string): SourceRecord[] {
  const value = record[field]

  if (value === undefined || value === null) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array.`)
  }

  return value.map((item, index) => asObject(item, `${field}[${index}]`))
}

function readStorageArray(value: unknown, label: string): SourceRecord[] {
  if (value === null) {
    return []
  }

  if (typeof value !== 'string') {
    throw new Error(`${label} must contain JSON text.`)
  }

  const parsed: unknown = JSON.parse(value)

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} is not an array.`)
  }

  return parsed.map((item, index) => asObject(item, `${label}[${index}]`))
}

function readPortrayLevel(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  const level = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN

  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Invalid Portray level.')
  }

  return level
}

function rowKey(...values: Scalar[]): string {
  return JSON.stringify(values)
}

function queryRows(db: Database.Database, sql: string, keyColumns: string[]): ComparableRow[] {
  const results = db.prepare(sql).all() as Array<Record<string, Scalar>>

  return results.map((result) => ({
    ...result,
    key: rowKey(...keyColumns.map((column) => result[column]))
  }))
}

function compareRows(
  label: string,
  expected: ComparableRow[],
  actual: ComparableRow[],
  issues: string[]
): void {
  const expectedMap = new Map<string, ComparableRow>()
  const actualMap = new Map<string, ComparableRow>()

  for (const row of expected) {
    if (expectedMap.has(row.key)) {
      issues.push(`${label}: duplicate backup key ${row.key}`)
    }

    expectedMap.set(row.key, row)
  }

  for (const row of actual) {
    if (actualMap.has(row.key)) {
      issues.push(`${label}: duplicate SQLite key ${row.key}`)
    }

    actualMap.set(row.key, row)
  }

  if (expected.length !== actual.length) {
    issues.push(`${label}: expected ${expected.length} rows, found ${actual.length}`)
  }

  for (const [key, expectedRow] of expectedMap) {
    const actualRow = actualMap.get(key)

    if (!actualRow) {
      issues.push(`${label}: missing SQLite row ${key}`)
      continue
    }

    for (const column of Object.keys(expectedRow)) {
      if (column === 'key') {
        continue
      }

      if (expectedRow[column] !== actualRow[column]) {
        issues.push(`${label} ${key}: value differs in ${column}`)
      }
    }
  }

  for (const key of actualMap.keys()) {
    if (!expectedMap.has(key)) {
      issues.push(`${label}: unexpected SQLite row ${key}`)
    }
  }
}

// ==========================================
// READ AND COMPARE THE ORIGINAL BACKUP
// ==========================================

export function verifySqliteMigrationFromEnvironment(): void {
  const backupPath = process.env['SUITCASE_VERIFY_BACKUP_FILE']

  // Do nothing unless verification was explicitly requested.
  if (!backupPath) {
    return
  }

  if (!isAbsolute(backupPath)) {
    throw new Error('Verification backup path must be absolute.')
  }

  const contents = readFileSync(backupPath, 'utf8')
  const backup = asObject(JSON.parse(contents) as unknown, 'Backup')

  if (backup.format !== 'the-suitcase-lab-localstorage-backup' || backup.version !== 1) {
    throw new Error('Unsupported backup format.')
  }

  const storage = asObject(backup.storage, 'Storage')
  const counts = asObject(backup.counts, 'Counts')

  const arcanists = readStorageArray(storage.reverse1999_arcanists, 'Arcanists')

  const statusEffects = readStorageArray(storage.reverse1999_status_effects, 'Status Effects')

  if (counts.arcanists !== arcanists.length || counts.statusEffects !== statusEffects.length) {
    throw new Error('Backup count mismatch.')
  }

  const arcanistIds = new Set<string>()
  const statusIds = new Set<string>()

  const expectedArcanists: ComparableRow[] = []
  const expectedSkills: ComparableRow[] = []
  const expectedPortray: ComparableRow[] = []
  const expectedStatuses: ComparableRow[] = []

  const relationshipMap = new Map<string, ComparableRow>()

  // ==========================================
  // EXPECTED ARCANIST DATA
  // ==========================================

  for (const arcanist of arcanists) {
    const id = readText(arcanist, 'id')
    const name = readText(arcanist, 'name')

    if (!id.trim() || !name.trim() || arcanistIds.has(id)) {
      throw new Error(`Invalid or duplicate Arcanist: ${id}`)
    }

    arcanistIds.add(id)

    expectedArcanists.push({
      key: rowKey(id),
      id,
      name,
      image: readText(arcanist, 'image'),
      afflatus: readText(arcanist, 'afflatus'),
      damage_type: readText(arcanist, 'damageType'),
      roles_json: JSON.stringify(readStrings(arcanist, 'roles')),
      mechanics: readText(arcanist, 'mechanics'),
      tags_json: JSON.stringify(readStrings(arcanist, 'tags')),
      notes: readText(arcanist, 'notes')
    })

    readObjects(arcanist, 'skills').forEach((skill, index) => {
      expectedSkills.push({
        key: rowKey(id, index),
        arcanist_id: id,
        sort_order: index,
        name: readText(skill, 'name'),
        skill_type: readText(skill, 'type'),
        description: readText(skill, 'description')
      })
    })

    readObjects(arcanist, 'portray').forEach((entry, index) => {
      expectedPortray.push({
        key: rowKey(id, index),
        arcanist_id: id,
        sort_order: index,
        level: readPortrayLevel(entry.level),
        description: readText(entry, 'description')
      })
    })
  }

  // ==========================================
  // EXPECTED STATUS EFFECT DATA
  // ==========================================

  for (const statusEffect of statusEffects) {
    const id = readText(statusEffect, 'id')
    const name = readText(statusEffect, 'name')

    if (!id.trim() || !name.trim() || statusIds.has(id)) {
      throw new Error(`Invalid or duplicate Status Effect: ${id}`)
    }

    statusIds.add(id)

    const stackable = statusEffect.stackable

    if (stackable !== undefined && stackable !== null && typeof stackable !== 'boolean') {
      throw new Error(`Invalid stackable value: ${id}`)
    }

    expectedStatuses.push({
      key: rowKey(id),
      id,
      name,
      category: readText(statusEffect, 'category'),
      description: readText(statusEffect, 'description'),
      effect: readText(statusEffect, 'effect'),
      duration: readText(statusEffect, 'duration'),
      stackable: stackable === true ? 1 : 0,
      related_mechanics_json: JSON.stringify(readStrings(statusEffect, 'relatedMechanics')),
      tags_json: JSON.stringify(readStrings(statusEffect, 'tags')),
      notes: readText(statusEffect, 'notes')
    })
  }

  // ==========================================
  // EXPECTED RELATIONSHIPS
  // ==========================================

  function addRelationship(arcanistId: string, statusId: string): void {
    if (!arcanistIds.has(arcanistId) || !statusIds.has(statusId)) {
      throw new Error(`Invalid relationship: ${arcanistId} -> ${statusId}`)
    }

    const key = rowKey(arcanistId, statusId)

    relationshipMap.set(key, {
      key,
      arcanist_id: arcanistId,
      status_effect_id: statusId
    })
  }

  for (const arcanist of arcanists) {
    const arcanistId = readText(arcanist, 'id')

    for (const statusId of readStrings(arcanist, 'relatedStatusEffects')) {
      addRelationship(arcanistId, statusId)
    }
  }

  for (const statusEffect of statusEffects) {
    const statusId = readText(statusEffect, 'id')

    for (const arcanistId of readStrings(statusEffect, 'relatedArcanists')) {
      addRelationship(arcanistId, statusId)
    }
  }

  // ==========================================
  // READ SQLITE WITHOUT MODIFYING IT
  // ==========================================

  const db = getDatabase()
  const issues: string[] = []

  compareRows(
    'arcanists',
    expectedArcanists,
    queryRows(
      db,
      `SELECT id, name, image, afflatus, damage_type,
              roles_json, mechanics, tags_json, notes
       FROM arcanists`,
      ['id']
    ),
    issues
  )

  compareRows(
    'arcanist_skills',
    expectedSkills,
    queryRows(
      db,
      `SELECT arcanist_id, sort_order, name,
              skill_type, description
       FROM arcanist_skills`,
      ['arcanist_id', 'sort_order']
    ),
    issues
  )

  compareRows(
    'arcanist_portray',
    expectedPortray,
    queryRows(
      db,
      `SELECT arcanist_id, sort_order, level, description
       FROM arcanist_portray`,
      ['arcanist_id', 'sort_order']
    ),
    issues
  )

  compareRows(
    'status_effects',
    expectedStatuses,
    queryRows(
      db,
      `SELECT id, name, category, description, effect,
              duration, stackable, related_mechanics_json,
              tags_json, notes
       FROM status_effects`,
      ['id']
    ),
    issues
  )

  compareRows(
    'arcanist_status_effects',
    [...relationshipMap.values()],
    queryRows(
      db,
      `SELECT arcanist_id, status_effect_id
       FROM arcanist_status_effects`,
      ['arcanist_id', 'status_effect_id']
    ),
    issues
  )

  // ==========================================
  // VERIFY SQLITE INTEGRITY
  // ==========================================

  const foreignKeyErrors = db.pragma('foreign_key_check') as unknown[]

  if (foreignKeyErrors.length > 0) {
    issues.push(`Foreign key violations: ${foreignKeyErrors.length}`)
  }

  const integrity = db.pragma('integrity_check', { simple: true })

  if (integrity !== 'ok') {
    issues.push(`SQLite integrity check failed: ${String(integrity)}`)
  }

  // ==========================================
  // VERIFICATION RESULT
  // ==========================================

  const summary = {
    arcanists: expectedArcanists.length,
    skills: expectedSkills.length,
    portray: expectedPortray.length,
    statusEffects: expectedStatuses.length,
    relationships: relationshipMap.size,
    issues: issues.length
  }

  console.log('[SQLite Verify] Backup:', backupPath)
  console.log('[SQLite Verify] Compared records:', summary)

  if (issues.length > 0) {
    console.error('[SQLite Verify] FAILED.')

    for (const issue of issues.slice(0, 20)) {
      console.error('[SQLite Verify]', issue)
    }

    throw new Error(`SQLite verification found ${issues.length} issue(s).`)
  }

  console.log('[SQLite Verify] PASS: Backup and SQLite data match.')

  console.log('[SQLite Verify] PASS: Foreign keys and integrity are valid.')
}
