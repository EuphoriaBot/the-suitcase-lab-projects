import type { ElectronAPI } from '@electron-toolkit/preload'

export interface SqliteSkill {
  name: string
  type: string
  description: string
}

export interface SqlitePortray {
  level: number | null
  description: string
}

export interface SqliteArcanist {
  id: string
  name: string
  image: string
  afflatus: string
  damageType: string
  roles: string[]
  mechanics: string
  tags: string[]
  notes: string
  skills: SqliteSkill[]
  portray: SqlitePortray[]
  relatedStatusEffects: string[]
}

export interface SqliteStatusEffect {
  id: string
  name: string
  category: string
  description: string
  effect: string
  duration: string
  stackable: boolean
  relatedMechanics: string[]
  tags: string[]
  notes: string
  relatedArcanists: string[]
}

export interface SqliteSnapshot {
  arcanists: SqliteArcanist[]
  statusEffects: SqliteStatusEffect[]
}

export interface SuitcaseAPI {
  getSqliteSnapshot: () => Promise<SqliteSnapshot>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SuitcaseAPI
  }
}
