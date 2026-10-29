import { randomUUID } from 'node:crypto'
import { getDatabase } from './database'
import { readSqliteSnapshot } from './sqliteRead'

type DataRecord = Record<string, unknown>

function asRecord(value: unknown, label: string): DataRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }

  return value as DataRecord
}

function getText(row: DataRecord, key: string): string {
  const value = row[key]

  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value !== 'string') {
    throw new Error(`${key} must be a string.`)
  }

  return value.trim()
}

function getName(row: DataRecord): string {
  const name = getText(row, 'name')

  if (!name) {
    throw new Error('Name is required.')
  }

  return name
}

function getId(id: string): string {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('A valid record ID is required.')
  }

  return id
}

function getStrings(row: DataRecord, key: string): string[] {
  const value = row[key]

  if (value === undefined || value === null) {
    return []
  }

  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`${key} must be an array of strings.`)
  }

  return value.map((item: string) => item.trim()).filter(Boolean)
}

function getObjects(row: DataRecord, key: string): DataRecord[] {
  const value = row[key]

  if (value === undefined || value === null) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`)
  }

  return value.map((item, index) => asRecord(item, `${key}[${index}]`))
}

function getLevel(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  const level = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN

  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Portray level must be a positive integer.')
  }

  return level
}

function getBoolean(row: DataRecord, key: string): boolean {
  const value = row[key]

  if (value === undefined || value === null) {
    return false
  }

  if (typeof value !== 'boolean') {
    throw new Error(`${key} must be a boolean.`)
  }

  return value
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

export function saveSqliteArcanist(payload: unknown, existingId?: string): string {
  const input = asRecord(payload, 'Arcanist')
  const db = getDatabase()

  const name = getName(input)

  const skills = getObjects(input, 'skills').map((skill) => ({
    name: getText(skill, 'name'),
    type: getText(skill, 'type'),
    description: getText(skill, 'description')
  }))

  const portray = getObjects(input, 'portray').map((entry) => ({
    level: getLevel(entry.level),
    description: getText(entry, 'description')
  }))

  const relatedIds = unique(getStrings(input, 'relatedStatusEffects'))

  const save = db.transaction((): string => {
    const id = existingId ? getId(existingId) : randomUUID()

    if (existingId) {
      const result = db
        .prepare(
          `
        UPDATE arcanists
        SET name = ?,
            image = ?,
            afflatus = ?,
            damage_type = ?,
            roles_json = ?,
            mechanics = ?,
            tags_json = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
        )
        .run(
          name,
          getText(input, 'image'),
          getText(input, 'afflatus'),
          getText(input, 'damageType'),
          JSON.stringify(getStrings(input, 'roles')),
          getText(input, 'mechanics'),
          JSON.stringify(getStrings(input, 'tags')),
          getText(input, 'notes'),
          id
        )

      if (result.changes !== 1) {
        throw new Error('Arcanist could not be found.')
      }
    } else {
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
        name,
        getText(input, 'image'),
        getText(input, 'afflatus'),
        getText(input, 'damageType'),
        JSON.stringify(getStrings(input, 'roles')),
        getText(input, 'mechanics'),
        JSON.stringify(getStrings(input, 'tags')),
        getText(input, 'notes')
      )
    }

    db.prepare('DELETE FROM arcanist_skills WHERE arcanist_id = ?').run(id)

    const insertSkill = db.prepare(`
      INSERT INTO arcanist_skills (
        arcanist_id, sort_order, name,
        skill_type, description
      )
      VALUES (?, ?, ?, ?, ?)
    `)

    skills.forEach((skill, index) => {
      insertSkill.run(id, index, skill.name, skill.type, skill.description)
    })

    db.prepare('DELETE FROM arcanist_portray WHERE arcanist_id = ?').run(id)

    const insertPortray = db.prepare(`
      INSERT INTO arcanist_portray (
        arcanist_id, sort_order, level, description
      )
      VALUES (?, ?, ?, ?)
    `)

    portray.forEach((entry, index) => {
      insertPortray.run(id, index, entry.level, entry.description)
    })

    db.prepare(
      `
      DELETE FROM arcanist_status_effects
      WHERE arcanist_id = ?
    `
    ).run(id)

    const insertRelationship = db.prepare(`
      INSERT INTO arcanist_status_effects (
        arcanist_id, status_effect_id
      )
      VALUES (?, ?)
    `)

    for (const statusId of relatedIds) {
      insertRelationship.run(id, statusId)
    }

    return id
  })

  return save()
}

export function deleteSqliteArcanist(id: string): void {
  const recordId = getId(id)
  const db = getDatabase()

  const remove = db.transaction((): void => {
    const result = db
      .prepare(
        `
      DELETE FROM arcanists
      WHERE id = ?
    `
      )
      .run(recordId)

    if (result.changes !== 1) {
      throw new Error('Arcanist could not be found.')
    }
  })

  remove()
}

export function saveSqliteStatusEffect(payload: unknown, existingId?: string): string {
  const input = asRecord(payload, 'Status Effect')
  const db = getDatabase()

  const name = getName(input)

  const relatedArcanistIds = unique(getStrings(input, 'relatedArcanists'))

  const save = db.transaction((): string => {
    const id = existingId ? getId(existingId) : randomUUID()

    const previous = existingId
      ? (db
          .prepare(
            `
          SELECT category, related_mechanics_json
          FROM status_effects
          WHERE id = ?
        `
          )
          .get(id) as
          | {
              category: string | null
              related_mechanics_json: string
            }
          | undefined)
      : undefined

    if (existingId && !previous) {
      throw new Error('Status Effect could not be found.')
    }

    const category =
      input.category === undefined ? (previous?.category ?? '') : getText(input, 'category')

    const relatedMechanics =
      input.relatedMechanics === undefined
        ? (previous?.related_mechanics_json ?? '[]')
        : JSON.stringify(getStrings(input, 'relatedMechanics'))

    const values = [
      name,
      category,
      getText(input, 'description'),
      getText(input, 'effect'),
      getText(input, 'duration'),
      getBoolean(input, 'stackable') ? 1 : 0,
      relatedMechanics,
      JSON.stringify(getStrings(input, 'tags')),
      getText(input, 'notes')
    ] as const

    if (existingId) {
      db.prepare(
        `
        UPDATE status_effects
        SET name = ?,
            category = ?,
            description = ?,
            effect = ?,
            duration = ?,
            stackable = ?,
            related_mechanics_json = ?,
            tags_json = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      ).run(...values, id)
    } else {
      db.prepare(
        `
        INSERT INTO status_effects (
          name, category, description, effect,
          duration, stackable, related_mechanics_json,
          tags_json, notes, id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      ).run(...values, id)
    }

    db.prepare(
      `
      DELETE FROM arcanist_status_effects
      WHERE status_effect_id = ?
    `
    ).run(id)

    const insertRelationship = db.prepare(`
      INSERT INTO arcanist_status_effects (
        arcanist_id, status_effect_id
      )
      VALUES (?, ?)
    `)

    for (const arcanistId of relatedArcanistIds) {
      insertRelationship.run(arcanistId, id)
    }

    return id
  })

  return save()
}

export function deleteSqliteStatusEffect(id: string): void {
  const recordId = getId(id)
  const db = getDatabase()

  const remove = db.transaction((): void => {
    const result = db
      .prepare(
        `
      DELETE FROM status_effects
      WHERE id = ?
    `
      )
      .run(recordId)

    if (result.changes !== 1) {
      throw new Error('Status Effect could not be found.')
    }
  })

  remove()
}

const TABLES = [
  'arcanists',
  'arcanist_skills',
  'arcanist_portray',
  'status_effects',
  'arcanist_status_effects'
] as const

function readCounts(): number[] {
  const db = getDatabase()

  return TABLES.map((table) => {
    const row = db
      .prepare(
        `
      SELECT COUNT(*) AS total FROM ${table}
    `
      )
      .get() as { total: number }

    return row.total
  })
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[SQLite CRUD Test] ${message}`)
  }
}

class ExpectedTestRollback extends Error {}

export function runSqliteCrudSmokeTest(): void {
  const db = getDatabase()
  const before = readCounts()

  let allTestsPassed = false

  try {
    const test = db.transaction((): void => {
      const arcanistId = saveSqliteArcanist({
        name: '__SQLite CRUD Test Arcanist__',
        image: '',
        afflatus: 'Star',
        damageType: 'Reality',
        roles: ['DPS'],
        mechanics: 'Temporary test.',
        tags: ['Test'],
        notes: 'Will be rolled back.',
        skills: [
          {
            name: 'Test Attack',
            type: 'Attack',
            description: 'Temporary skill.'
          }
        ],
        portray: [
          {
            level: 1,
            description: 'Temporary Portray.'
          }
        ],
        relatedStatusEffects: []
      })

      const statusId = saveSqliteStatusEffect({
        name: '__SQLite CRUD Test Effect__',
        description: 'Temporary Status Effect.',
        effect: 'Test effect.',
        duration: '2 rounds',
        stackable: false,
        tags: ['Test'],
        notes: '',
        relatedArcanists: [arcanistId]
      })

      let snapshot = readSqliteSnapshot()

      const createdArcanist = snapshot.arcanists.find((item) => item.id === arcanistId)

      assert(createdArcanist?.skills.length === 1, 'Creating Arcanist skills failed.')

      assert(createdArcanist?.portray.length === 1, 'Creating Arcanist Portray failed.')

      assert(
        createdArcanist?.relatedStatusEffects.includes(statusId) === true,
        'Creating relationship failed.'
      )

      saveSqliteArcanist(
        {
          name: '__SQLite CRUD Test Updated__',
          afflatus: 'Star',
          damageType: 'Reality',
          roles: ['DPS', 'Support'],
          skills: [
            {
              name: 'Updated Skill',
              type: 'Ultimate',
              description: 'Updated description.'
            }
          ],
          portray: [
            {
              level: 2,
              description: 'Updated Portray.'
            }
          ],
          relatedStatusEffects: [statusId]
        },
        arcanistId
      )

      saveSqliteStatusEffect(
        {
          name: '__SQLite CRUD Test Effect Updated__',
          description: 'Updated description.',
          effect: 'Updated effect.',
          duration: '3 rounds',
          stackable: true,
          tags: ['Buff'],
          notes: '',
          relatedArcanists: [arcanistId]
        },
        statusId
      )

      snapshot = readSqliteSnapshot()

      const updatedArcanist = snapshot.arcanists.find((item) => item.id === arcanistId)

      const updatedStatus = snapshot.statusEffects.find((item) => item.id === statusId)

      assert(updatedArcanist?.name === '__SQLite CRUD Test Updated__', 'Updating Arcanist failed.')

      assert(updatedArcanist?.skills[0]?.name === 'Updated Skill', 'Updating skills failed.')

      assert(updatedArcanist?.portray[0]?.level === 2, 'Updating Portray failed.')

      assert(updatedStatus?.stackable === true, 'Updating Status Effect failed.')

      assert(
        updatedStatus?.relatedArcanists.includes(arcanistId) === true,
        'Relationship synchronization failed.'
      )

      deleteSqliteArcanist(arcanistId)

      snapshot = readSqliteSnapshot()

      const statusAfterDelete = snapshot.statusEffects.find((item) => item.id === statusId)

      assert(
        !snapshot.arcanists.some((item) => item.id === arcanistId),
        'Deleting Arcanist failed.'
      )

      assert(
        statusAfterDelete !== undefined && statusAfterDelete.relatedArcanists.length === 0,
        'Cascade relationship cleanup failed.'
      )

      deleteSqliteStatusEffect(statusId)

      snapshot = readSqliteSnapshot()

      assert(
        !snapshot.statusEffects.some((item) => item.id === statusId),
        'Deleting Status Effect failed.'
      )

      allTestsPassed = true

      throw new ExpectedTestRollback()
    })

    test()
  } catch (error) {
    if (!(error instanceof ExpectedTestRollback)) {
      throw error
    }
  }

  const after = readCounts()

  assert(allTestsPassed, 'Test did not complete.')
  assert(
    JSON.stringify(before) === JSON.stringify(after),
    'Database counts changed after rollback.'
  )

  console.log('[SQLite CRUD] TEST PASSED.')
  console.log('[SQLite CRUD] CREATE, UPDATE and DELETE passed.')
  console.log('[SQLite CRUD] ROLLBACK CONFIRMED.')
  console.log('[SQLite CRUD] Original database counts:', after)
}
