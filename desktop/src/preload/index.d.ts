import type { ElectronAPI } from '@electron-toolkit/preload'

// ==========================================
// SQLITE RECORD TYPES
// ==========================================

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

// ==========================================
// WRITE PAYLOAD TYPES
// ==========================================

export type SqliteArcanistInput = Omit<SqliteArcanist, 'id'>

export type SqliteStatusEffectInput = Omit<SqliteStatusEffect, 'id'>

// ==========================================
// IPC API
// ==========================================

export interface SuitcaseAPI {
  getSqliteSnapshot: () => Promise<SqliteSnapshot>

  getSqliteWriteStatus: () => Promise<{
    enabled: boolean
  }>

  saveSqliteArcanist: (payload: SqliteArcanistInput, existingId?: string) => Promise<string>

  deleteSqliteArcanist: (id: string) => Promise<void>

  saveSqliteStatusEffect: (payload: SqliteStatusEffectInput, existingId?: string) => Promise<string>

  deleteSqliteStatusEffect: (id: string) => Promise<void>
}

// ==========================================
// GLOBAL WINDOW TYPES
// ==========================================

declare global {
  interface Window {
    electron: ElectronAPI
    api: SuitcaseAPI
  }
}
