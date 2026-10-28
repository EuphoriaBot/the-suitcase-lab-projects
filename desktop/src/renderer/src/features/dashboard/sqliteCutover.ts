import type { DashboardData } from './dashboardData'

const CUTOVER_KEY = 'the-suitcase-lab-sqlite-cutover-v1'

function readLocalList(key: string): Record<string, unknown>[] {
  const stored = localStorage.getItem(key)

  if (!stored) {
    return []
  }

  const parsed: unknown = JSON.parse(stored)

  if (!Array.isArray(parsed)) {
    throw new Error(`Invalid localStorage data: ${key}`)
  }

  return parsed.map((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`Invalid record in ${key}`)
    }

    return item as Record<string, unknown>
  })
}

function object(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Invalid stored record.')
  }

  return value as Record<string, unknown>
}

function string(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function array(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function normalizeArcanist(value: unknown): unknown {
  const row = object(value)

  return {
    id: string(row.id),
    name: string(row.name),
    image: string(row.image),
    afflatus: string(row.afflatus),
    damageType: string(row.damageType),
    roles: array(row.roles),
    mechanics: string(row.mechanics),
    tags: array(row.tags),
    notes: string(row.notes),
    skills: Array.isArray(row.skills)
      ? row.skills.map((item) => {
          const skill = object(item)

          return {
            name: string(skill.name),
            type: string(skill.type),
            description: string(skill.description)
          }
        })
      : [],
    portray: Array.isArray(row.portray)
      ? row.portray.map((item) => {
          const entry = object(item)
          const rawLevel = entry.level

          return {
            level:
              rawLevel === null || rawLevel === undefined || rawLevel === ''
                ? null
                : Number(rawLevel),
            description: string(entry.description)
          }
        })
      : []
  }
}

function normalizeStatus(value: unknown): unknown {
  const row = object(value)

  return {
    id: string(row.id),
    name: string(row.name),
    category: string(row.category),
    description: string(row.description),
    effect: string(row.effect),
    duration: string(row.duration),
    stackable: row.stackable === true,
    relatedMechanics: array(row.relatedMechanics),
    tags: array(row.tags),
    notes: string(row.notes)
  }
}

function normalizedRecords(records: unknown[], normalize: (value: unknown) => unknown): string[] {
  return records.map((item) => JSON.stringify(normalize(item))).sort()
}

function relationships(
  arcanists: Record<string, unknown>[],
  statuses: Record<string, unknown>[]
): string[] {
  const pairs = new Set<string>()

  for (const arcanist of arcanists) {
    for (const statusId of array(arcanist.relatedStatusEffects)) {
      pairs.add(JSON.stringify([arcanist.id, statusId]))
    }
  }

  for (const status of statuses) {
    for (const arcanistId of array(status.relatedArcanists)) {
      pairs.add(JSON.stringify([arcanistId, status.id]))
    }
  }

  return [...pairs].sort()
}

export function verifyAndMarkCutover(data: DashboardData): void {
  if (localStorage.getItem(CUTOVER_KEY) === 'sqlite') {
    return
  }

  const localArcanists = readLocalList('reverse1999_arcanists')
  const localStatuses = readLocalList('reverse1999_status_effects')

  const sqliteArcanists = data.arcanists.map((item) => object(item))
  const sqliteStatuses = data.statusEffects.map((item) => object(item))

  const checks = [
    [
      normalizedRecords(localArcanists, normalizeArcanist),
      normalizedRecords(sqliteArcanists, normalizeArcanist)
    ],
    [
      normalizedRecords(localStatuses, normalizeStatus),
      normalizedRecords(sqliteStatuses, normalizeStatus)
    ],
    [relationships(localArcanists, localStatuses), relationships(sqliteArcanists, sqliteStatuses)]
  ]

  const matches = checks.every(([left, right]) => JSON.stringify(left) === JSON.stringify(right))

  if (!matches) {
    throw new Error(
      'Data localStorage dan SQLite belum sama. Cutover dibatalkan. Jangan hapus data atau backup.'
    )
  }

  localStorage.setItem(CUTOVER_KEY, 'sqlite')
}
