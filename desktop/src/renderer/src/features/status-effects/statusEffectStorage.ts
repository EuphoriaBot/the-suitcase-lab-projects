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

// ==========================================
// CREATE AND UPDATE STATUS EFFECT
// ==========================================

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

  // Only accept existing Arcanist IDs.
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

  const savedStatusEffect: DashboardStatusEffect = {
    ...existing,
    ...normalizedPayload,
    id: existingId ?? crypto.randomUUID()
  }

  const updatedStatusEffects = existingId
    ? statusEffects.map((item) => (item.id === existingId ? savedStatusEffect : item))
    : [...statusEffects, savedStatusEffect]

  // Synchronize relationships stored on Arcanists.
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

// ==========================================
// DELETE STATUS EFFECT
// ==========================================

export function deleteStatusEffect(id: string): void {
  const originalArcanistData = localStorage.getItem(ARCANIST_KEY)

  const statusEffects = readList<DashboardStatusEffect>(STATUS_KEY)

  const arcanists = readList<DashboardArcanist>(ARCANIST_KEY)

  // Make sure the requested Status Effect exists.
  const exists = statusEffects.some((statusEffect) => statusEffect.id === id)

  if (!exists) {
    throw new Error('Status Effect could not be found.')
  }

  // Remove only the selected Status Effect.
  const remainingStatusEffects = statusEffects.filter((statusEffect) => statusEffect.id !== id)

  // Remove its ID from all Arcanist relationships.
  const cleanedArcanists = arcanists.map((arcanist) => {
    const related = arcanist.relatedStatusEffects

    if (!Array.isArray(related) || !related.includes(id)) {
      return arcanist
    }

    return {
      ...arcanist,
      relatedStatusEffects: related.filter((statusEffectId) => statusEffectId !== id)
    }
  })

  const arcanistsChanged = cleanedArcanists.some((item, index) => item !== arcanists[index])

  let arcanistsSaved = false

  try {
    // Clean related Arcanists first.
    if (arcanistsChanged) {
      localStorage.setItem(ARCANIST_KEY, JSON.stringify(cleanedArcanists))

      arcanistsSaved = true
    }

    // Delete the Status Effect.
    localStorage.setItem(STATUS_KEY, JSON.stringify(remainingStatusEffects))
  } catch (error) {
    // Attempt to undo relationship changes if deletion fails.
    if (arcanistsSaved) {
      try {
        restoreStorage(ARCANIST_KEY, originalArcanistData)
      } catch (restoreError) {
        console.error('Failed to restore Arcanist relationships:', restoreError)
      }
    }

    throw error
  }
}
