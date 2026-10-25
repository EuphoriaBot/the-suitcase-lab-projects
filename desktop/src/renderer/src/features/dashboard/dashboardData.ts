export interface DashboardArcanist {
  id: string
  name: string
  image?: string
  afflatus?: string
  damageType?: string
  roles?: string[]
  mechanics?: string
  notes?: string
  tags?: string[]
  skills?: unknown[]
  portray?: unknown[]
  relatedStatusEffects?: string[]
}

export interface DashboardStatusEffect {
  id: string
  name: string
  category?: string
  description?: string
  effect?: string
  duration?: string
  stackable?: boolean
  relatedArcanists?: string[]
  relatedMechanics?: string[]
  tags?: string[]
  notes?: string
}

export interface DashboardData {
  arcanists: DashboardArcanist[]
  statusEffects: DashboardStatusEffect[]
}

function readStoredList<T>(key: string): T[] {
  const stored = localStorage.getItem(key)

  if (!stored) {
    return []
  }

  try {
    const result: unknown = JSON.parse(stored)

    return Array.isArray(result) ? (result as T[]) : []
  } catch (error) {
    console.error(`Failed to read ${key}`, error)
    return []
  }
}

export function getDashboardData(): DashboardData {
  return {
    arcanists: readStoredList<DashboardArcanist>('reverse1999_arcanists'),
    statusEffects: readStoredList<DashboardStatusEffect>('reverse1999_status_effects')
  }
}
