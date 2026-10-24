import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

export type ArcanistPayload = Omit<DashboardArcanist, 'id'>

interface StoredStatusEffect extends DashboardStatusEffect {
  relatedArcanists?: string[]
}

const ARCANIST_KEY = 'reverse1999_arcanists'
const STATUS_EFFECT_KEY = 'reverse1999_status_effects'

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

// CREATE AND UPDATE
export function saveArcanist(payload: ArcanistPayload, existingId?: string): DashboardArcanist {
  if (!payload.name.trim()) {
    throw new Error('Arcanist name is required.')
  }

  const arcanists = readArcanists()

  if (existingId) {
    const index = arcanists.findIndex((arcanist) => arcanist.id === existingId)

    if (index === -1) {
      throw new Error('Arcanist could not be found.')
    }

    const updatedArcanist: DashboardArcanist = {
      ...arcanists[index],
      ...payload,
      id: existingId
    }

    const updatedList = [...arcanists]
    updatedList[index] = updatedArcanist

    localStorage.setItem(ARCANIST_KEY, JSON.stringify(updatedList))

    return updatedArcanist
  }

  const newArcanist: DashboardArcanist = {
    ...payload,
    id: crypto.randomUUID()
  }

  localStorage.setItem(ARCANIST_KEY, JSON.stringify([...arcanists, newArcanist]))

  return newArcanist
}

// DELETE AND CLEAN RELATED STATUS EFFECTS
export function deleteArcanist(id: string): void {
  const originalArcanistData = localStorage.getItem(ARCANIST_KEY)

  const originalStatusData = localStorage.getItem(STATUS_EFFECT_KEY)

  const arcanists = readStoredList<DashboardArcanist>(originalArcanistData, ARCANIST_KEY)

  const statusEffects = readStoredList<StoredStatusEffect>(originalStatusData, STATUS_EFFECT_KEY)

  const exists = arcanists.some((arcanist) => arcanist.id === id)

  if (!exists) {
    throw new Error('Arcanist could not be found.')
  }

  const remainingArcanists = arcanists.filter((arcanist) => arcanist.id !== id)

  const cleanedStatusEffects = statusEffects.map((effect) => {
    if (!Array.isArray(effect.relatedArcanists) || !effect.relatedArcanists.includes(id)) {
      return effect
    }

    return {
      ...effect,
      relatedArcanists: effect.relatedArcanists.filter((arcanistId) => arcanistId !== id)
    }
  })

  const statusRelationsChanged = cleanedStatusEffects.some(
    (effect, index) => effect !== statusEffects[index]
  )

  let statusDataSaved = false

  try {
    // Clean reverse relationships first.
    if (statusRelationsChanged) {
      localStorage.setItem(STATUS_EFFECT_KEY, JSON.stringify(cleanedStatusEffects))
      statusDataSaved = true
    }

    // Delete only the selected Arcanist.
    localStorage.setItem(ARCANIST_KEY, JSON.stringify(remainingArcanists))
  } catch (error) {
    // Attempt to restore Status Effects if the
    // second storage operation fails.
    if (statusDataSaved) {
      try {
        if (originalStatusData === null) {
          localStorage.removeItem(STATUS_EFFECT_KEY)
        } else {
          localStorage.setItem(STATUS_EFFECT_KEY, originalStatusData)
        }
      } catch (restoreError) {
        console.error('Failed to restore Status Effects:', restoreError)
      }
    }

    throw error
  }
}
