import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

export interface StatusEffectPayload {
  name: string
  description: string
  effect: string
  duration: string
  stackable: boolean
  relatedArcanists: string[]
  tags: string[]
  notes: string
}

const STATUS_KEY = 'reverse1999_status_effects'
const ARCANIST_KEY = 'reverse1999_arcanists'

function readList<T>(key: string): T[] {
  const stored = localStorage.getItem(key)

  if (stored === null) {
    return []
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(stored)
  } catch {
    throw new Error(`Invalid JSON stored in ${key}.`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Stored data in ${key} is not a valid list.`)
  }

  return parsed as T[]
}

function restoreStorage(key: string, original: string | null): void {
  if (original === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, original)
  }
}

export function saveStatusEffect(
  payload: StatusEffectPayload,
  existingId?: string
): DashboardStatusEffect {
  const name = payload.name.trim()

  if (!name) {
    throw new Error('Status Effect name is required.')
  }

  const originalStatusData = localStorage.getItem(STATUS_KEY)
  const originalArcanistData = localStorage.getItem(ARCANIST_KEY)

  const statusEffects = readList<DashboardStatusEffect>(STATUS_KEY)
  const arcanists = readList<DashboardArcanist>(ARCANIST_KEY)

  const existing = existingId ? statusEffects.find((item) => item.id === existingId) : undefined

  if (existingId && !existing) {
    throw new Error('Status Effect could not be found.')
  }

  // Only keep IDs belonging to existing Arcanists.
  const validArcanistIds = new Set(arcanists.map((arcanist) => arcanist.id))

  const selectedArcanistIds = [...new Set(payload.relatedArcanists)].filter((id) =>
    validArcanistIds.has(id)
  )

  const normalizedPayload: StatusEffectPayload = {
    name,
    description: payload.description.trim(),
    effect: payload.effect.trim(),
    duration: payload.duration.trim(),
    stackable: payload.stackable,
    relatedArcanists: selectedArcanistIds,
    tags: payload.tags,
    notes: payload.notes.trim()
  }

  // Preserve any additional data on an existing Status Effect.
  const savedStatusEffect: DashboardStatusEffect = {
    ...existing,
    ...normalizedPayload,
    id: existingId ?? crypto.randomUUID()
  }

  const updatedStatusEffects = existingId
    ? statusEffects.map((item) => (item.id === existingId ? savedStatusEffect : item))
    : [...statusEffects, savedStatusEffect]

  // Keep reverse relationships in Arcanist records in sync.
  const selectedIds = new Set(selectedArcanistIds)

  const updatedArcanists = arcanists.map((arcanist) => {
    const related = Array.isArray(arcanist.relatedStatusEffects)
      ? arcanist.relatedStatusEffects
      : []

    const isSelected = selectedIds.has(arcanist.id)
    const wasRelated = related.includes(savedStatusEffect.id)

    if (isSelected && !wasRelated) {
      return {
        ...arcanist,
        relatedStatusEffects: [...related, savedStatusEffect.id]
      }
    }

    if (!isSelected && wasRelated) {
      return {
        ...arcanist,
        relatedStatusEffects: related.filter((id) => id !== savedStatusEffect.id)
      }
    }

    return arcanist
  })

  const arcanistsChanged = updatedArcanists.some((item, index) => item !== arcanists[index])

  // localStorage has no multi-key transaction support.
  // Attempt to restore both original values if saving fails.
  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(updatedStatusEffects))

    if (arcanistsChanged) {
      localStorage.setItem(ARCANIST_KEY, JSON.stringify(updatedArcanists))
    }
  } catch (error) {
    try {
      restoreStorage(STATUS_KEY, originalStatusData)

      if (arcanistsChanged) {
        restoreStorage(ARCANIST_KEY, originalArcanistData)
      }
    } catch (restoreError) {
      console.error('Failed to restore original data:', restoreError)
    }

    throw error
  }

  return savedStatusEffect
}
