import { readFileSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import { getDatabase } from './database'
import { readSqliteSnapshot } from './sqliteRead'

type Row = Record<string, unknown>

function asRow(value: unknown, label: string): Row {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }

  return value as Row
}

function text(row: Row, key: string): string {
  const value = row[key]

  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value !== 'string') {
    throw new Error(`${key} must be a string.`)
  }

  return value
}

function strings(row: Row, key: string): string[] {
  const value = row[key]

  if (value === null || value === undefined) {
    return []
  }

  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`${key} must be an array of strings.`)
  }

  return value as string[]
}

function objects(row: Row, key: string): Row[] {
  const value = row[key]

  if (value === null || value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`)
  }

  return value.map((item, index) => asRow(item, `${key}[${index}]`))
}

function boolean(row: Row, key: string): boolean {
  const value = row[key]

  if (value === null || value === undefined) {
    return false
  }

  if (typeof value !== 'boolean') {
    throw new Error(`${key} must be a boolean.`)
  }

  return value
}

function level(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const result = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN

  if (!Number.isInteger(result) || result < 1) {
    throw new Error('Invalid Portray level.')
  }

  return result
}

function parseList(value: unknown, label: string): Row[] {
  if (value === null) {
    return []
  }

  if (typeof value !== 'string') {
    throw new Error(`${label} must contain JSON text.`)
  }

  const parsed: unknown = JSON.parse(value)

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be an array.`)
  }

  return parsed.map((item, index) => asRow(item, `${label}[${index}]`))
}

function mapById(items: unknown[], label: string): Map<string, Row> {
  const result = new Map<string, Row>()

  for (const value of items) {
    const row = asRow(value, label)
    const id = text(row, 'id')

    if (!id.trim() || !text(row, 'name').trim()) {
      throw new Error(`${label} has invalid ID or name.`)
    }

    if (result.has(id)) {
      throw new Error(`Duplicate ${label} ID: ${id}`)
    }

    result.set(id, row)
  }

  return result
}

function comparableArcanist(value: unknown): string {
  const row = asRow(value, 'Arcanist')

  return JSON.stringify({
    name: text(row, 'name'),
    image: text(row, 'image'),
    afflatus: text(row, 'afflatus'),
    damageType: text(row, 'damageType'),
    roles: strings(row, 'roles'),
    mechanics: text(row, 'mechanics'),
    tags: strings(row, 'tags'),
    notes: text(row, 'notes'),
    skills: objects(row, 'skills').map((skill) => ({
      name: text(skill, 'name'),
      type: text(skill, 'type'),
      description: text(skill, 'description')
    })),
    portray: objects(row, 'portray').map((entry) => ({
      level: level(entry.level),
      description: text(entry, 'description')
    }))
  })
}

function comparableStatusEffect(value: unknown): string {
  const row = asRow(value, 'Status Effect')

  return JSON.stringify({
    name: text(row, 'name'),
    category: text(row, 'category'),
    description: text(row, 'description'),
    effect: text(row, 'effect'),
    duration: text(row, 'duration'),
    stackable: boolean(row, 'stackable'),
    relatedMechanics: strings(row, 'relatedMechanics'),
    tags: strings(row, 'tags'),
    notes: text(row, 'notes')
  })
}

function relationshipPairs(arcanists: Map<string, Row>, statuses: Map<string, Row>): Set<string> {
  const pairs = new Set<string>()

  for (const [arcanistId, arcanist] of arcanists) {
    const related = strings(arcanist, 'relatedStatusEffects')

    for (const statusId of related) {
      const status = statuses.get(statusId)

      if (!status) {
        throw new Error(`Missing Status Effect referenced by ${arcanistId}: ${statusId}`)
      }

      if (!strings(status, 'relatedArcanists').includes(arcanistId)) {
        throw new Error(`One-way relationship: ${arcanistId} -> ${statusId}`)
      }

      pairs.add(JSON.stringify([arcanistId, statusId]))
    }
  }

  for (const [statusId, status] of statuses) {
    for (const arcanistId of strings(status, 'relatedArcanists')) {
      const arcanist = arcanists.get(arcanistId)

      if (!arcanist) {
        throw new Error(`Missing Arcanist referenced by ${statusId}: ${arcanistId}`)
      }

      if (!strings(arcanist, 'relatedStatusEffects').includes(statusId)) {
        throw new Error(`One-way relationship: ${statusId} -> ${arcanistId}`)
      }

      pairs.add(JSON.stringify([arcanistId, statusId]))
    }
  }

  return pairs
}

function loadBackup(path: string): {
  arcanists: Row[]
  statuses: Row[]
} {
  if (!isAbsolute(path)) {
    throw new Error('Backup path must be absolute.')
  }

  const backup = asRow(JSON.parse(readFileSync(path, 'utf8')) as unknown, 'Backup')

  if (backup.format !== 'the-suitcase-lab-localstorage-backup' || backup.version !== 1) {
    throw new Error('Unsupported backup format.')
  }

  const storage = asRow(backup.storage, 'Backup storage')
  const counts = asRow(backup.counts, 'Backup counts')

  const arcanists = parseList(storage.reverse1999_arcanists, 'Arcanists')

  const statuses = parseList(storage.reverse1999_status_effects, 'Status Effects')

  if (counts.arcanists !== arcanists.length || counts.statusEffects !== statuses.length) {
    throw new Error('Backup record counts do not match.')
  }

  return { arcanists, statuses }
}

function insertArcanist(row: Row): void {
  const db = getDatabase()
  const id = text(row, 'id')

  db.prepare(
    `
    INSERT INTO arcanists (
      id, name, image, afflatus, damage_type,
      roles_json, mechanics, tags_json, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    id,
    text(row, 'name'),
    text(row, 'image'),
    text(row, 'afflatus'),
    text(row, 'damageType'),
    JSON.stringify(strings(row, 'roles')),
    text(row, 'mechanics'),
    JSON.stringify(strings(row, 'tags')),
    text(row, 'notes')
  )

  const insertSkill = db.prepare(`
    INSERT INTO arcanist_skills (
      arcanist_id, sort_order, name,
      skill_type, description
    )
    VALUES (?, ?, ?, ?, ?)
  `)

  objects(row, 'skills').forEach((skill, index) => {
    insertSkill.run(id, index, text(skill, 'name'), text(skill, 'type'), text(skill, 'description'))
  })

  const insertPortray = db.prepare(`
    INSERT INTO arcanist_portray (
      arcanist_id, sort_order, level, description
    )
    VALUES (?, ?, ?, ?)
  `)

  objects(row, 'portray').forEach((entry, index) => {
    insertPortray.run(id, index, level(entry.level), text(entry, 'description'))
  })
}

function insertStatusEffect(row: Row): void {
  const db = getDatabase()

  db.prepare(
    `
    INSERT INTO status_effects (
      id, name, category, description, effect,
      duration, stackable, related_mechanics_json,
      tags_json, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    text(row, 'id'),
    text(row, 'name'),
    text(row, 'category'),
    text(row, 'description'),
    text(row, 'effect'),
    text(row, 'duration'),
    boolean(row, 'stackable') ? 1 : 0,
    JSON.stringify(strings(row, 'relatedMechanics')),
    JSON.stringify(strings(row, 'tags')),
    text(row, 'notes')
  )
}

export function reconcileLocalBackupFromEnvironment(): void {
  const path = process.env['SUITCASE_RECONCILE_BACKUP_FILE']

  if (!path) {
    return
  }

  const backup = loadBackup(path)
  const snapshot = readSqliteSnapshot()

  const localArcanists = mapById(backup.arcanists, 'Backup Arcanist')

  const localStatuses = mapById(backup.statuses, 'Backup Status Effect')

  const sqliteArcanists = mapById(snapshot.arcanists, 'SQLite Arcanist')

  const sqliteStatuses = mapById(snapshot.statusEffects, 'SQLite Status Effect')

  const localPairs = relationshipPairs(localArcanists, localStatuses)

  const sqlitePairs = relationshipPairs(sqliteArcanists, sqliteStatuses)

  const newArcanists = [...localArcanists]
    .filter(([id]) => !sqliteArcanists.has(id))
    .map(([, row]) => row)

  const newStatuses = [...localStatuses]
    .filter(([id]) => !sqliteStatuses.has(id))
    .map(([, row]) => row)

  const conflicts: string[] = []

  for (const [id, row] of localArcanists) {
    const current = sqliteArcanists.get(id)

    if (current && comparableArcanist(row) !== comparableArcanist(current)) {
      conflicts.push(`Changed existing Arcanist: ${id}`)
    }
  }

  for (const [id, row] of localStatuses) {
    const current = sqliteStatuses.get(id)

    if (current && comparableStatusEffect(row) !== comparableStatusEffect(current)) {
      conflicts.push(`Changed existing Status Effect: ${id}`)
    }
  }

  for (const id of sqliteArcanists.keys()) {
    if (!localArcanists.has(id)) {
      conflicts.push(`SQLite-only Arcanist: ${id}`)
    }
  }

  for (const id of sqliteStatuses.keys()) {
    if (!localStatuses.has(id)) {
      conflicts.push(`SQLite-only Status Effect: ${id}`)
    }
  }

  const newPairs = [...localPairs].filter((pair) => !sqlitePairs.has(pair))

  for (const pair of newPairs) {
    const [arcanistId, statusId] = JSON.parse(pair) as [string, string]

    if (sqliteArcanists.has(arcanistId) && sqliteStatuses.has(statusId)) {
      conflicts.push(`Changed relationship between existing records: ${pair}`)
    }
  }

  for (const pair of sqlitePairs) {
    if (!localPairs.has(pair)) {
      conflicts.push(`SQLite-only relationship: ${pair}`)
    }
  }

  for (const row of localArcanists.values()) {
    comparableArcanist(row)
  }

  for (const row of localStatuses.values()) {
    comparableStatusEffect(row)
  }

  console.log('[SQLite Reconcile] Backup:', path)

  console.log('[SQLite Reconcile] Preview:', {
    newArcanists: newArcanists.length,
    newStatusEffects: newStatuses.length,
    newRelationships: newPairs.length,
    conflicts: conflicts.length
  })

  console.log(
    '[SQLite Reconcile] New Arcanists:',
    newArcanists.map((row) => text(row, 'name'))
  )

  console.log(
    '[SQLite Reconcile] New Status Effects:',
    newStatuses.map((row) => text(row, 'name'))
  )

  if (conflicts.length > 0) {
    console.error('[SQLite Reconcile] BLOCKED: Existing data differs.')

    conflicts.forEach((conflict) => {
      console.error('[SQLite Reconcile]', conflict)
    })

    return
  }

  if (process.env['SUITCASE_RECONCILE_CONFIRM'] !== 'YES') {
    console.log('[SQLite Reconcile] PREVIEW ONLY. No data was written.')
    return
  }

  const db = getDatabase()

  const originalSnapshot = JSON.stringify(snapshot)

  const reconcile = db.transaction((): void => {
    if (JSON.stringify(readSqliteSnapshot()) !== originalSnapshot) {
      throw new Error('SQLite changed after preview.')
    }

    for (const row of newArcanists) {
      insertArcanist(row)
    }

    for (const row of newStatuses) {
      insertStatusEffect(row)
    }

    const insertRelation = db.prepare(`
      INSERT INTO arcanist_status_effects (
        arcanist_id, status_effect_id
      )
      VALUES (?, ?)
    `)

    for (const pair of newPairs) {
      const [arcanistId, statusId] = JSON.parse(pair) as [string, string]

      insertRelation.run(arcanistId, statusId)
    }

    const result = readSqliteSnapshot()

    const resultArcanists = mapById(result.arcanists, 'Result Arcanist')

    const resultStatuses = mapById(result.statusEffects, 'Result Status Effect')

    if (
      resultArcanists.size !== localArcanists.size ||
      resultStatuses.size !== localStatuses.size
    ) {
      throw new Error('Record counts differ after reconciliation.')
    }

    for (const [id, row] of localArcanists) {
      const resultRow = resultArcanists.get(id)

      if (!resultRow || comparableArcanist(row) !== comparableArcanist(resultRow)) {
        throw new Error(`Arcanist mismatch: ${id}`)
      }
    }

    for (const [id, row] of localStatuses) {
      const resultRow = resultStatuses.get(id)

      if (!resultRow || comparableStatusEffect(row) !== comparableStatusEffect(resultRow)) {
        throw new Error(`Status Effect mismatch: ${id}`)
      }
    }

    const resultPairs = relationshipPairs(resultArcanists, resultStatuses)

    if (
      resultPairs.size !== localPairs.size ||
      [...localPairs].some((pair) => !resultPairs.has(pair))
    ) {
      throw new Error('Relationship mismatch after reconciliation.')
    }

    const foreignKeyErrors = db.pragma('foreign_key_check') as unknown[]

    if (foreignKeyErrors.length > 0) {
      throw new Error('SQLite foreign key check failed.')
    }
  })

  reconcile()

  console.log('[SQLite Reconcile] SYNC SUCCESSFUL.')
  console.log('[SQLite Reconcile] Final counts:', {
    arcanists: readSqliteSnapshot().arcanists.length,
    statusEffects: readSqliteSnapshot().statusEffects.length
  })
}
