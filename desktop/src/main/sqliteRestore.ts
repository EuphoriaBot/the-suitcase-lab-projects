import { app, BrowserWindow, dialog } from 'electron'
import { createHash, randomUUID } from 'node:crypto'
import { mkdirSync, realpathSync, rmSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import Database from 'better-sqlite3'

import { closeDatabase, getDatabase, initializeDatabase } from './database'

import { createSqliteBackup } from './sqliteBackup'

interface DatabaseCounts {
  arcanists: number
  skills: number
  portray: number
  statusEffects: number
  relationships: number
}

interface DatabaseSummary {
  schemaVersion: number
  counts: DatabaseCounts
}

interface DatabaseInspection {
  summary: DatabaseSummary
  schema: string
  fingerprint: string
}

export type SqliteRestoreResult =
  | {
      status: 'cancelled'
    }
  | {
      status: 'restored'
      before: DatabaseSummary
      after: DatabaseSummary
      safetyBackupPath: string
    }

const TABLES = [
  {
    name: 'arcanists',
    order: 'id'
  },
  {
    name: 'arcanist_skills',
    order: 'arcanist_id, sort_order, id'
  },
  {
    name: 'arcanist_portray',
    order: 'arcanist_id, sort_order, id'
  },
  {
    name: 'status_effects',
    order: 'id'
  },
  {
    name: 'arcanist_status_effects',
    order: 'arcanist_id, status_effect_id'
  }
] as const

let maintenanceBusy = false

export function assertSqliteAvailable(): void {
  if (maintenanceBusy) {
    throw new Error('SQLite is temporarily unavailable during database maintenance.')
  }
}

export async function withSqliteMaintenance<T>(action: () => Promise<T>): Promise<T> {
  assertSqliteAvailable()

  maintenanceBusy = true

  try {
    return await action()
  } finally {
    maintenanceBusy = false
  }
}

function countRows(db: Database.Database, table: string): number {
  const result = db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get() as { total: number }

  return result.total
}

function inspectDatabase(db: Database.Database): DatabaseInspection {
  const integrity = db.pragma('integrity_check', {
    simple: true
  })

  if (integrity !== 'ok') {
    throw new Error('SQLite database integrity check failed.')
  }

  const foreignKeyErrors = db.pragma('foreign_key_check') as unknown[]

  if (foreignKeyErrors.length > 0) {
    throw new Error('SQLite database contains invalid foreign key relationships.')
  }

  const schemaVersion = db.pragma('user_version', {
    simple: true
  }) as number

  const schemaRows = db
    .prepare(
      `
      SELECT type, name, tbl_name, sql
      FROM sqlite_master
      WHERE name NOT LIKE 'sqlite_%'
      ORDER BY type, name
    `
    )
    .all()

  const hash = createHash('sha256')

  for (const table of TABLES) {
    const records = db.prepare(`SELECT * FROM ${table.name} ORDER BY ${table.order}`).all()

    hash.update(table.name)
    hash.update(JSON.stringify(records))
  }

  return {
    summary: {
      schemaVersion,
      counts: {
        arcanists: countRows(db, 'arcanists'),
        skills: countRows(db, 'arcanist_skills'),
        portray: countRows(db, 'arcanist_portray'),
        statusEffects: countRows(db, 'status_effects'),
        relationships: countRows(db, 'arcanist_status_effects')
      }
    },
    schema: JSON.stringify(schemaRows),
    fingerprint: hash.digest('hex')
  }
}

function inspectFile(path: string): DatabaseInspection {
  const db = new Database(path, {
    readonly: true,
    fileMustExist: true
  })

  try {
    return inspectDatabase(db)
  } finally {
    db.close()
  }
}

async function copySqliteDatabase(sourcePath: string, destinationPath: string): Promise<void> {
  const source = new Database(sourcePath, {
    readonly: true,
    fileMustExist: true
  })

  try {
    await source.backup(destinationPath)
  } finally {
    source.close()
  }
}

function formatCounts(summary: DatabaseSummary): string {
  const counts = summary.counts

  return [
    `Arcanists: ${counts.arcanists}`,
    `Skills: ${counts.skills}`,
    `Portray: ${counts.portray}`,
    `Status Effects: ${counts.statusEffects}`,
    `Relationships: ${counts.relationships}`
  ].join('\n')
}

function cleanupStagedFiles(path: string): void {
  for (const filename of [path, `${path}-wal`, `${path}-shm`]) {
    try {
      rmSync(filename, { force: true })
    } catch (error) {
      console.error('[SQLite Restore] Temporary file cleanup failed:', error)
    }
  }
}

async function applyRestore(
  livePath: string,
  stagedPath: string,
  safetyBackupPath: string,
  expected: DatabaseInspection
): Promise<DatabaseSummary> {
  closeDatabase()

  try {
    await copySqliteDatabase(stagedPath, livePath)

    initializeDatabase()

    const restored = inspectDatabase(getDatabase())

    if (
      restored.schema !== expected.schema ||
      restored.fingerprint !== expected.fingerprint ||
      restored.summary.schemaVersion !== expected.summary.schemaVersion
    ) {
      throw new Error('Restored database does not match the selected backup.')
    }

    return restored.summary
  } catch (restoreError) {
    try {
      closeDatabase()
    } catch (closeError) {
      console.error('[SQLite Restore] Database close failed:', closeError)
    }

    try {
      await copySqliteDatabase(safetyBackupPath, livePath)

      initializeDatabase()

      inspectDatabase(getDatabase())

      console.log('[SQLite Restore] Previous database recovered successfully.')
    } catch (recoveryError) {
      console.error('[SQLite Restore] Automatic recovery failed:', recoveryError)

      throw new Error(
        `Restore and automatic recovery failed. The safety backup is located at: ${safetyBackupPath}`,
        { cause: recoveryError }
      )
    }

    const message = restoreError instanceof Error ? restoreError.message : String(restoreError)

    throw new Error(`Restore failed. The previous database was recovered. ${message}`, {
      cause: restoreError
    })
  }
}

export async function restoreSqliteBackup(window: BrowserWindow): Promise<SqliteRestoreResult> {
  return withSqliteMaintenance(async () => {
    const selected = await dialog.showOpenDialog(window, {
      title: 'Select SQLite Backup',
      buttonLabel: 'Select Backup',
      properties: ['openFile'],
      filters: [
        {
          name: 'SQLite Database',
          extensions: ['sqlite', 'db']
        }
      ]
    })

    if (selected.canceled || !selected.filePaths[0]) {
      return { status: 'cancelled' }
    }

    const selectedPath = realpathSync(selected.filePaths[0])

    const livePath = getDatabase().name

    if (resolve(selectedPath).toLowerCase() === resolve(livePath).toLowerCase()) {
      throw new Error('The active database cannot be used as its own restore source.')
    }

    const currentInspection = inspectDatabase(getDatabase())

    const sourceInspection = inspectFile(selectedPath)

    if (sourceInspection.summary.schemaVersion !== currentInspection.summary.schemaVersion) {
      throw new Error('The backup schema version is incompatible with this application.')
    }

    if (sourceInspection.schema !== currentInspection.schema) {
      throw new Error('The backup database schema does not match the current application.')
    }

    const stagingDirectory = join(app.getPath('userData'), 'data')

    mkdirSync(stagingDirectory, { recursive: true })

    const stagedPath = join(stagingDirectory, `sqlite-restore-stage-${randomUUID()}.sqlite`)

    try {
      await copySqliteDatabase(selectedPath, stagedPath)

      const stagedInspection = inspectFile(stagedPath)

      if (
        stagedInspection.schema !== sourceInspection.schema ||
        stagedInspection.fingerprint !== sourceInspection.fingerprint
      ) {
        throw new Error('Staged backup validation failed.')
      }

      const confirmation = await dialog.showMessageBox(window, {
        type: 'warning',
        title: 'Confirm SQLite Restore',
        message: 'Replace the current database?',
        detail: [
          `Backup: ${basename(selectedPath)}`,
          '',
          'Current database:',
          formatCounts(currentInspection.summary),
          '',
          'Selected backup:',
          formatCounts(stagedInspection.summary),
          '',
          'All current records will be replaced with the selected backup.',
          'A safety backup will be created before restoring.'
        ].join('\n'),
        buttons: ['Cancel', 'Restore Database'],
        defaultId: 0,
        cancelId: 0,
        noLink: true
      })

      if (confirmation.response !== 1) {
        console.log('[SQLite Restore] Cancelled by user.')

        return { status: 'cancelled' }
      }

      const safetyBackup = await createSqliteBackup()

      const beforeApplying = inspectDatabase(getDatabase())

      if (beforeApplying.fingerprint !== currentInspection.fingerprint) {
        throw new Error('The current database changed during restore preparation.')
      }

      const after = await applyRestore(livePath, stagedPath, safetyBackup.path, stagedInspection)

      console.log('[SQLite Restore] RESTORE SUCCESSFUL.')

      console.log('[SQLite Restore] Safety backup:', safetyBackup.path)

      console.log('[SQLite Restore] Restored counts:', after.counts)

      setTimeout(() => {
        if (!window.isDestroyed()) {
          window.webContents.reload()
        }
      }, 500)

      return {
        status: 'restored',
        before: currentInspection.summary,
        after,
        safetyBackupPath: safetyBackup.path
      }
    } finally {
      cleanupStagedFiles(stagedPath)
    }
  })
}
