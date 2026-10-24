import type { DashboardArcanist } from '../dashboard/dashboardData'

export type ArcanistPayload = Omit<DashboardArcanist, 'id'>

const STORAGE_KEY = 'reverse1999_arcanists'

function readArcanists(): DashboardArcanist[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return []
  }

  const parsed: unknown = JSON.parse(stored)

  if (!Array.isArray(parsed)) {
    throw new Error('Stored Arcanist data is not a valid list.')
  }

  return parsed as DashboardArcanist[]
}

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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))

    return updatedArcanist
  }

  const newArcanist: DashboardArcanist = {
    ...payload,
    id: crypto.randomUUID()
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...arcanists, newArcanist]))

  return newArcanist
}
