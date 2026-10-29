import { app } from 'electron'
import { randomUUID } from 'node:crypto'
import { mkdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'

import { getDatabase } from './database'

export interface SqliteBackupResult {
  path: string
  sizeBytes: number
  schemaVersion: number
  counts: {
    arcanists: number
    skills: number
    portray: number
    statusEffects: number
    relationships: number
  }
}

let backupInProgress = false

function countRows(db: Database.Database, table: string): number {
  const row = db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get() as {
    total: number
  }

  return row.total
}

function verifyBackup(path: string): SqliteBackupResult {
  const backupDb = new Database(path, {
    readonly: true,
    fileMustExist: true
  })

  try {
    const integrity = backupDb.pragma('integrity_check', {
      simple: true
    })

    if (integrity !== 'ok') {
      throw new Error(`Backup integrity check failed: ${String(integrity)}`)
    }

    const foreignKeyErrors = backupDb.pragma('foreign_key_check') as unknown[]

    if (foreignKeyErrors.length > 0) {
      throw new Error('Backup contains invalid foreign key relationships.')
    }

    const schemaVersion = backupDb.pragma('user_version', {
      simple: true
    }) as number

    const originalVersion = getDatabase().pragma('user_version', {
      simple: true
    }) as number

    if (schemaVersion !== originalVersion) {
      throw new Error('Backup schema version does not match the original database.')
    }

    return {
      path,
      sizeBytes: statSync(path).size,
      schemaVersion,
      counts: {
        arcanists: countRows(backupDb, 'arcanists'),
        skills: countRows(backupDb, 'arcanist_skills'),
        portray: countRows(backupDb, 'arcanist_portray'),
        statusEffects: countRows(backupDb, 'status_effects'),
        relationships: countRows(backupDb, 'arcanist_status_effects')
      }
    }
  } finally {
    backupDb.close()
  }
}

export async function createSqliteBackup(): Promise<SqliteBackupResult> {
  if (backupInProgress) {
    throw new Error('A SQLite backup is already in progress.')
  }

  backupInProgress = true

  const backupDirectory = join(app.getPath('home'), 'TheSuitcaseLabBackups')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  const uniqueId = randomUUID().slice(0, 8)

  const destination = join(backupDirectory, `suitcase-lab-sqlite-${timestamp}-${uniqueId}.sqlite`)

  try {
    mkdirSync(backupDirectory, { recursive: true })

    await getDatabase().backup(destination)

    const result = verifyBackup(destination)

    console.log('[SQLite Backup] SUCCESSFUL.')
    console.log('[SQLite Backup] Path:', result.path)
    console.log('[SQLite Backup] Size:', result.sizeBytes)
    console.log('[SQLite Backup] Schema version:', result.schemaVersion)
    console.log('[SQLite Backup] Counts:', result.counts)

    return result
  } catch (error) {
    try {
      rmSync(destination, { force: true })
    } catch (cleanupError) {
      console.error('[SQLite Backup] Cleanup failed:', cleanupError)
    }

    console.error('[SQLite Backup] FAILED:', error)

    throw error
  } finally {
    backupInProgress = false
  }
}
