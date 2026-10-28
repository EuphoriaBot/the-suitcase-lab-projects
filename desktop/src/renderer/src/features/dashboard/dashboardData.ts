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

let currentData: DashboardData | null = null

export function setDashboardData(data: DashboardData): void {
  currentData = data
}

export function getDashboardData(): DashboardData {
  if (!currentData) {
    throw new Error('SQLite data has not been loaded.')
  }

  return currentData
}
