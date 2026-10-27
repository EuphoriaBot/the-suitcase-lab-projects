import { getDatabase } from './database'

interface ArcanistRow {
  id: string
  name: string
  image: string | null
  afflatus: string | null
  damage_type: string | null
  roles_json: string
  mechanics: string
  tags_json: string
  notes: string
}

interface SkillRow {
  arcanist_id: string
  sort_order: number
  name: string
  skill_type: string
  description: string
}

interface PortrayRow {
  arcanist_id: string
  sort_order: number
  level: number | null
  description: string
}

interface StatusEffectRow {
  id: string
  name: string
  category: string | null
  description: string
  effect: string
  duration: string
  stackable: number
  related_mechanics_json: string
  tags_json: string
  notes: string
}

interface RelationshipRow {
  arcanist_id: string
  status_effect_id: string
}

interface SqliteSkill {
  name: string
  type: string
  description: string
}

interface SqlitePortray {
  level: number | null
  description: string
}

interface SqliteArcanist {
  id: string
  name: string
  image: string
  afflatus: string
  damageType: string
  roles: string[]
  mechanics: string
  tags: string[]
  notes: string
  skills: SqliteSkill[]
  portray: SqlitePortray[]
  relatedStatusEffects: string[]
}

interface SqliteStatusEffect {
  id: string
  name: string
  category: string
  description: string
  effect: string
  duration: string
  stackable: boolean
  relatedMechanics: string[]
  tags: string[]
  notes: string
  relatedArcanists: string[]
}

export interface SqliteSnapshot {
  arcanists: SqliteArcanist[]
  statusEffects: SqliteStatusEffect[]
}

function parseStringArray(raw: string, column: string): string[] {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`Invalid JSON in SQLite column: ${column}`)
  }

  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) {
    throw new Error(`Invalid string array in SQLite column: ${column}`)
  }

  return parsed as string[]
}

function appendToMap<T>(map: Map<string, T[]>, ownerId: string, item: T): void {
  const values = map.get(ownerId) ?? []

  values.push(item)
  map.set(ownerId, values)
}

export function readSqliteSnapshot(): SqliteSnapshot {
  const db = getDatabase()

  const arcanistRows = db
    .prepare(
      `
      SELECT
        id, name, image, afflatus, damage_type,
        roles_json, mechanics, tags_json, notes
      FROM arcanists
      ORDER BY rowid
    `
    )
    .all() as ArcanistRow[]

  const skillRows = db
    .prepare(
      `
      SELECT
        arcanist_id, sort_order, name,
        skill_type, description
      FROM arcanist_skills
      ORDER BY arcanist_id, sort_order, id
    `
    )
    .all() as SkillRow[]

  const portrayRows = db
    .prepare(
      `
      SELECT
        arcanist_id, sort_order, level, description
      FROM arcanist_portray
      ORDER BY arcanist_id, sort_order, id
    `
    )
    .all() as PortrayRow[]

  const statusEffectRows = db
    .prepare(
      `
      SELECT
        id, name, category, description,
        effect, duration, stackable,
        related_mechanics_json, tags_json, notes
      FROM status_effects
      ORDER BY rowid
    `
    )
    .all() as StatusEffectRow[]

  const relationshipRows = db
    .prepare(
      `
      SELECT arcanist_id, status_effect_id
      FROM arcanist_status_effects
      ORDER BY arcanist_id, status_effect_id
    `
    )
    .all() as RelationshipRow[]

  const skillsByArcanist = new Map<string, SqliteSkill[]>()

  const portrayByArcanist = new Map<string, SqlitePortray[]>()

  const effectsByArcanist = new Map<string, string[]>()

  const arcanistsByEffect = new Map<string, string[]>()

  for (const skill of skillRows) {
    appendToMap(skillsByArcanist, skill.arcanist_id, {
      name: skill.name,
      type: skill.skill_type,
      description: skill.description
    })
  }

  for (const portray of portrayRows) {
    appendToMap(portrayByArcanist, portray.arcanist_id, {
      level: portray.level,
      description: portray.description
    })
  }

  for (const relationship of relationshipRows) {
    appendToMap(effectsByArcanist, relationship.arcanist_id, relationship.status_effect_id)

    appendToMap(arcanistsByEffect, relationship.status_effect_id, relationship.arcanist_id)
  }

  const arcanists: SqliteArcanist[] = arcanistRows.map((row) => ({
    id: row.id,
    name: row.name,
    image: row.image ?? '',
    afflatus: row.afflatus ?? '',
    damageType: row.damage_type ?? '',
    roles: parseStringArray(row.roles_json, 'roles_json'),
    mechanics: row.mechanics,
    tags: parseStringArray(row.tags_json, 'tags_json'),
    notes: row.notes,
    skills: skillsByArcanist.get(row.id) ?? [],
    portray: portrayByArcanist.get(row.id) ?? [],
    relatedStatusEffects: effectsByArcanist.get(row.id) ?? []
  }))

  const statusEffects: SqliteStatusEffect[] = statusEffectRows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category ?? '',
    description: row.description,
    effect: row.effect,
    duration: row.duration,
    stackable: row.stackable === 1,
    relatedMechanics: parseStringArray(row.related_mechanics_json, 'related_mechanics_json'),
    tags: parseStringArray(row.tags_json, 'tags_json'),
    notes: row.notes,
    relatedArcanists: arcanistsByEffect.get(row.id) ?? []
  }))

  return {
    arcanists,
    statusEffects
  }
}
