import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

export type ArcanistPayload = Omit<DashboardArcanist, 'id'>

const ARCANIST_KEY = 'reverse1999_arcanists'
const STATUS_EFFECT_KEY = 'reverse1999_status_effects'

// ==========================================
// LOCAL STORAGE UTILITIES
// ==========================================

function readStoredList<T>(stored: string | null, key: string): T[] {
  if (stored === null) {
    return []
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(stored)
  } catch {
    throw new Error(`Invalid JSON data in ${key}.`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Stored data in ${key} is not a valid list.`)
  }

  return parsed as T[]
}

function readArcanists(): DashboardArcanist[] {
  return readStoredList<DashboardArcanist>(localStorage.getItem(ARCANIST_KEY), ARCANIST_KEY)
}

function readStatusEffects(): DashboardStatusEffect[] {
  return readStoredList<DashboardStatusEffect>(
    localStorage.getItem(STATUS_EFFECT_KEY),
    STATUS_EFFECT_KEY
  )
}

function restoreStorage(key: string, originalValue: string | null): void {
  if (originalValue === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, originalValue)
  }
}

// ==========================================
// SYNCHRONIZE STATUS EFFECT RELATIONSHIPS
// ==========================================

function synchronizeStatusEffects(
  statusEffects: DashboardStatusEffect[],
  arcanistId: string,
  selectedStatusEffectIds: string[]
): DashboardStatusEffect[] {
  const selectedIds = new Set(selectedStatusEffectIds)

  return statusEffects.map((statusEffect) => {
    const currentRelations = Array.isArray(statusEffect.relatedArcanists)
      ? statusEffect.relatedArcanists
      : []

    const isSelected = selectedIds.has(statusEffect.id)

    const isAlreadyRelated = currentRelations.includes(arcanistId)

    // Add Arcanist to the Status Effect.
    if (isSelected && !isAlreadyRelated) {
      return {
        ...statusEffect,
        relatedArcanists: [...currentRelations, arcanistId]
      }
    }

    // Remove Arcanist from the Status Effect.
    if (!isSelected && isAlreadyRelated) {
      return {
        ...statusEffect,
        relatedArcanists: currentRelations.filter((id) => id !== arcanistId)
      }
    }

    // No relationship changes needed.
    return statusEffect
  })
}

// ==========================================
// CREATE AND UPDATE ARCANIST
// ==========================================

export function saveArcanist(payload: ArcanistPayload, existingId?: string): DashboardArcanist {
  const name = payload.name.trim()

  if (!name) {
    throw new Error('Arcanist name is required.')
  }

  // Preserve existing storage for error recovery.
  const originalArcanistData = localStorage.getItem(ARCANIST_KEY)

  const originalStatusData = localStorage.getItem(STATUS_EFFECT_KEY)

  const arcanists = readArcanists()
  const statusEffects = readStatusEffects()

  // Find the original Arcanist when editing.
  const existingArcanist = existingId
    ? arcanists.find((arcanist) => arcanist.id === existingId)
    : undefined

  if (existingId && !existingArcanist) {
    throw new Error('Arcanist could not be found.')
  }

  // Generate ID only for new Arcanists.
  const arcanistId = existingId ?? crypto.randomUUID()

  // Only allow relationships with existing Status Effects.
  const validStatusEffectIds = new Set(statusEffects.map((statusEffect) => statusEffect.id))

  const requestedRelations = Array.isArray(payload.relatedStatusEffects)
    ? payload.relatedStatusEffects
    : []

  const selectedStatusEffectIds = [...new Set(requestedRelations)].filter((id) =>
    validStatusEffectIds.has(id)
  )

  // Preserve existing data when editing.
  const savedArcanist: DashboardArcanist = {
    ...existingArcanist,
    ...payload,
    id: arcanistId,
    name,
    relatedStatusEffects: selectedStatusEffectIds
  }

  // Update the Arcanist list.
  const updatedArcanists = existingId
    ? arcanists.map((arcanist) => (arcanist.id === existingId ? savedArcanist : arcanist))
    : [...arcanists, savedArcanist]

  // Update reverse relationships on Status Effects.
  const updatedStatusEffects = synchronizeStatusEffects(
    statusEffects,
    arcanistId,
    selectedStatusEffectIds
  )

  const statusEffectsChanged = updatedStatusEffects.some(
    (item, index) => item !== statusEffects[index]
  )

  let statusDataSaved = false

  // ==========================================
  // SAVE BOTH SIDES
  // ==========================================

  try {
    // Update Status Effect relationships first.
    if (statusEffectsChanged) {
      localStorage.setItem(STATUS_EFFECT_KEY, JSON.stringify(updatedStatusEffects))

      statusDataSaved = true
    }

    // Save the Arcanist data.
    localStorage.setItem(ARCANIST_KEY, JSON.stringify(updatedArcanists))
  } catch (error) {
    // Attempt to restore Status Effects if
    // saving the Arcanist fails.
    if (statusDataSaved) {
      try {
        restoreStorage(STATUS_EFFECT_KEY, originalStatusData)
      } catch (restoreError) {
        console.error('Failed to restore Status Effects:', restoreError)
      }
    }

    // The original Arcanist data was not modified
    // successfully if its setItem operation threw.
    // Keep this reference for future transaction migration.
    void originalArcanistData

    throw error
  }

  return savedArcanist
}

// ==========================================
// DELETE ARCANIST
// ==========================================

export function deleteArcanist(id: string): void {
  const originalStatusData = localStorage.getItem(STATUS_EFFECT_KEY)

  const arcanists = readArcanists()
  const statusEffects = readStatusEffects()

  const exists = arcanists.some((arcanist) => arcanist.id === id)

  if (!exists) {
    throw new Error('Arcanist could not be found.')
  }

  // Remove the selected Arcanist.
  const remainingArcanists = arcanists.filter((arcanist) => arcanist.id !== id)

  // Clean its references from all Status Effects.
  const cleanedStatusEffects = statusEffects.map((statusEffect) => {
    const relations = statusEffect.relatedArcanists

    if (!Array.isArray(relations) || !relations.includes(id)) {
      return statusEffect
    }

    return {
      ...statusEffect,
      relatedArcanists: relations.filter((arcanistId) => arcanistId !== id)
    }
  })

  const statusEffectsChanged = cleanedStatusEffects.some(
    (item, index) => item !== statusEffects[index]
  )

  let statusDataSaved = false

  try {
    // Clean the Status Effect relationships first.
    if (statusEffectsChanged) {
      localStorage.setItem(STATUS_EFFECT_KEY, JSON.stringify(cleanedStatusEffects))

      statusDataSaved = true
    }

    // Delete the Arcanist.
    localStorage.setItem(ARCANIST_KEY, JSON.stringify(remainingArcanists))
  } catch (error) {
    if (statusDataSaved) {
      try {
        restoreStorage(STATUS_EFFECT_KEY, originalStatusData)
      } catch (restoreError) {
        console.error('Failed to restore Status Effect relationships:', restoreError)
      }
    }

    throw error
  }
}
