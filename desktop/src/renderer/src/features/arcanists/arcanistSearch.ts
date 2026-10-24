import type { DashboardArcanist } from '../dashboard/dashboardData'

function extractTextFields(items: unknown[] | undefined, keys: string[]): string[] {
  if (!Array.isArray(items)) {
    return []
  }

  return items.flatMap((item) => {
    if (typeof item !== 'object' || item === null) {
      return []
    }

    const record = item as Record<string, unknown>

    return keys
      .map((key) => record[key])
      .filter((value): value is string => typeof value === 'string')
  })
}

export function matchesArcanistSearch(arcanist: DashboardArcanist, keyword: string): boolean {
  const searchableText = [
    arcanist.name,
    arcanist.afflatus,
    arcanist.damageType,

    ...(Array.isArray(arcanist.roles) ? arcanist.roles : []),

    arcanist.mechanics,
    arcanist.notes,

    ...(Array.isArray(arcanist.tags) ? arcanist.tags : []),

    ...extractTextFields(arcanist.skills, ['name', 'type', 'description']),

    ...extractTextFields(arcanist.portray, ['description'])
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase()

  return searchableText.includes(keyword.trim().toLowerCase())
}
