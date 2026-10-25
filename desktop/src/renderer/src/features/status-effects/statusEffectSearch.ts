import type { DashboardStatusEffect } from '../dashboard/dashboardData'

export function matchesStatusEffectSearch(
  statusEffect: DashboardStatusEffect,
  keyword: string
): boolean {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (!normalizedKeyword) {
    return true
  }

  const searchableText = [
    statusEffect.name,
    statusEffect.description,
    statusEffect.effect,
    statusEffect.duration,
    statusEffect.notes,
    ...(Array.isArray(statusEffect.tags) ? statusEffect.tags : [])
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalizedKeyword)
}
