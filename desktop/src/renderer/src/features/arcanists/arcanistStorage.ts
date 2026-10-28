import type { DashboardArcanist } from '../dashboard/dashboardData'

export type ArcanistPayload = Omit<DashboardArcanist, 'id'>

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Invalid Arcanist entry.')
  }

  return value as Record<string, unknown>
}

function text(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

export async function saveArcanist(payload: ArcanistPayload, existingId?: string): Promise<string> {
  const skills = (payload.skills ?? []).map((item) => {
    const skill = record(item)

    return {
      name: text(skill.name),
      type: text(skill.type),
      description: text(skill.description)
    }
  })

  const portray = (payload.portray ?? []).map((item) => {
    const entry = record(item)
    const rawLevel = entry.level

    const level =
      rawLevel === null || rawLevel === undefined || rawLevel === '' ? null : Number(rawLevel)

    if (level !== null && (!Number.isInteger(level) || level < 1)) {
      throw new Error('Invalid Portray level.')
    }

    return {
      level,
      description: text(entry.description)
    }
  })

  return window.api.saveSqliteArcanist(
    {
      name: payload.name,
      image: payload.image ?? '',
      afflatus: payload.afflatus ?? '',
      damageType: payload.damageType ?? '',
      roles: payload.roles ?? [],
      mechanics: payload.mechanics ?? '',
      tags: payload.tags ?? [],
      notes: payload.notes ?? '',
      skills,
      portray,
      relatedStatusEffects: payload.relatedStatusEffects ?? []
    },
    existingId
  )
}

export async function deleteArcanist(id: string): Promise<void> {
  await window.api.deleteSqliteArcanist(id)
}
