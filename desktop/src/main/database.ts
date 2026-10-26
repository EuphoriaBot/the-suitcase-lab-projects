import { app } from 'electron'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'

const SCHEMA_VERSION = 1

let connection: Database.Database | null = null

// ==========================================
// INITIALIZE SQLITE DATABASE
// ==========================================

export function initializeDatabase(): Database.Database {
  // Prevent duplicate connections.
  if (connection) {
    return connection
  }

  // Electron must be ready before accessing userData.
  if (!app.isReady()) {
    throw new Error('Electron app is not ready.')
  }

  // Keep database outside the project repository.
  const dataDirectory = join(app.getPath('userData'), 'data')

  mkdirSync(dataDirectory, { recursive: true })

  const databasePath = join(dataDirectory, 'suitcase-lab.sqlite')

  const db = new Database(databasePath)

  try {
    // Enable referential integrity.
    db.pragma('foreign_keys = ON')

    // Improve transaction and read/write handling.
    db.pragma('journal_mode = WAL')
    db.pragma('busy_timeout = 5000')

    const currentVersion = db.pragma('user_version', { simple: true }) as number

    // Do not accidentally downgrade a newer database.
    if (currentVersion > SCHEMA_VERSION) {
      throw new Error(`Unsupported SQLite schema version: ${currentVersion}`)
    }

    // ==========================================
    // CREATE DATABASE SCHEMA
    // ==========================================

    const createSchema = db.transaction((): void => {
      db.exec(`
        -- ARCANISTS
        CREATE TABLE IF NOT EXISTS arcanists (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          image TEXT,
          afflatus TEXT,
          damage_type TEXT,
          roles_json TEXT NOT NULL DEFAULT '[]',
          mechanics TEXT NOT NULL DEFAULT '',
          tags_json TEXT NOT NULL DEFAULT '[]',
          notes TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        -- ARCANIST SKILLS
        CREATE TABLE IF NOT EXISTS arcanist_skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          arcanist_id TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          name TEXT NOT NULL DEFAULT '',
          skill_type TEXT NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT '',

          FOREIGN KEY (arcanist_id)
            REFERENCES arcanists(id)
            ON DELETE CASCADE
        );

        -- ARCANIST PORTRAY
        CREATE TABLE IF NOT EXISTS arcanist_portray (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          arcanist_id TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          level INTEGER,
          description TEXT NOT NULL DEFAULT '',

          FOREIGN KEY (arcanist_id)
            REFERENCES arcanists(id)
            ON DELETE CASCADE
        );

        -- STATUS EFFECTS
        CREATE TABLE IF NOT EXISTS status_effects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT,
          description TEXT NOT NULL DEFAULT '',
          effect TEXT NOT NULL DEFAULT '',
          duration TEXT NOT NULL DEFAULT '',
          stackable INTEGER NOT NULL DEFAULT 0
            CHECK (stackable IN (0, 1)),
          related_mechanics_json TEXT NOT NULL DEFAULT '[]',
          tags_json TEXT NOT NULL DEFAULT '[]',
          notes TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        -- MANY-TO-MANY RELATIONSHIP
        CREATE TABLE IF NOT EXISTS arcanist_status_effects (
          arcanist_id TEXT NOT NULL,
          status_effect_id TEXT NOT NULL,

          PRIMARY KEY (arcanist_id, status_effect_id),

          FOREIGN KEY (arcanist_id)
            REFERENCES arcanists(id)
            ON DELETE CASCADE,

          FOREIGN KEY (status_effect_id)
            REFERENCES status_effects(id)
            ON DELETE CASCADE
        );

        -- INDEXES
        CREATE INDEX IF NOT EXISTS idx_arcanist_skills_owner
          ON arcanist_skills(arcanist_id, sort_order);

        CREATE INDEX IF NOT EXISTS idx_arcanist_portray_owner
          ON arcanist_portray(arcanist_id, sort_order);

        CREATE INDEX IF NOT EXISTS idx_relationship_status
          ON arcanist_status_effects(status_effect_id);
      `)

      // Mark the first schema version.
      if (currentVersion === 0) {
        db.pragma(`user_version = ${SCHEMA_VERSION}`)
      }
    })

    createSchema()

    // ==========================================
    // VERIFY DATABASE
    // ==========================================

    const integrityResult = db.pragma('integrity_check', { simple: true })

    if (integrityResult !== 'ok') {
      throw new Error(`SQLite integrity check failed: ${String(integrityResult)}`)
    }

    const tables = db
      .prepare(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `
      )
      .all() as Array<{ name: string }>

    console.log('[SQLite] Database initialized successfully.')
    console.log('[SQLite] Path:', databasePath)
    console.log('[SQLite] Schema version:', SCHEMA_VERSION)
    console.log('[SQLite] Tables:', tables.map((table) => table.name).join(', '))

    connection = db

    return db
  } catch (error) {
    // Avoid leaving an open connection on failure.
    db.close()
    throw error
  }
}

// ==========================================
// ACCESS EXISTING CONNECTION
// ==========================================

export function getDatabase(): Database.Database {
  if (!connection) {
    throw new Error('SQLite database has not been initialized.')
  }

  return connection
}

// ==========================================
// CLOSE DATABASE CONNECTION
// ==========================================

export function closeDatabase(): void {
  if (!connection) {
    return
  }

  connection.close()
  connection = null

  console.log('[SQLite] Database connection closed.')
}
