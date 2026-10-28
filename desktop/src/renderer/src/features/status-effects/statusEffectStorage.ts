import { getDashboardData } from '../dashboard/dashboardData'

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

export async function saveStatusEffect(
  payload: StatusEffectPayload,
  existingId?: string
): Promise<string> {
  const existing = existingId
    ? getDashboardData().statusEffects.find((item) => item.id === existingId)
    : undefined

  if (existingId && !existing) {
    throw new Error('Status Effect could not be found.')
  }

  return window.api.saveSqliteStatusEffect(
    {
      ...payload,
      category: existing?.category ?? '',
      relatedMechanics: existing?.relatedMechanics ?? []
    },
    existingId
  )
}

export async function deleteStatusEffect(id: string): Promise<void> {
  await window.api.deleteSqliteStatusEffect(id)
}
