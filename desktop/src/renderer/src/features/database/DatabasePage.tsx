import { useState, type JSX } from 'react'
import { getDashboardData } from '../dashboard/dashboardData'

type BackupResult = Awaited<ReturnType<typeof window.api.createSqliteBackup>>

type Feedback = {
  kind: 'success' | 'info' | 'error'
  message: string
}

function DatabasePage(): JSX.Element {
  const [busy, setBusy] = useState<'backup' | 'restore' | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [lastBackup, setLastBackup] = useState<BackupResult | null>(null)

  const { arcanists, statusEffects } = getDashboardData()

  const counts = {
    arcanists: arcanists.length,
    statusEffects: statusEffects.length,
    skills: arcanists.reduce((total, arcanist) => total + (arcanist.skills?.length ?? 0), 0),
    portray: arcanists.reduce((total, arcanist) => total + (arcanist.portray?.length ?? 0), 0),
    relationships: arcanists.reduce(
      (total, arcanist) => total + (arcanist.relatedStatusEffects?.length ?? 0),
      0
    )
  }

  const formattedCounts = [
    { label: 'Arcanists', value: counts.arcanists },
    { label: 'Status Effects', value: counts.statusEffects },
    { label: 'Skills', value: counts.skills },
    { label: 'Portray', value: counts.portray },
    { label: 'Relationships', value: counts.relationships }
  ]

  async function handleBackup(): Promise<void> {
    if (busy) {
      return
    }

    setBusy('backup')
    setFeedback(null)

    try {
      const result = await window.api.createSqliteBackup()

      setLastBackup(result)
      setFeedback({
        kind: 'success',
        message: 'Database backup created and verified successfully.'
      })
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Unable to create database backup.'
      })
    } finally {
      setBusy(null)
    }
  }

  async function handleRestore(): Promise<void> {
    if (busy) {
      return
    }

    setBusy('restore')
    setFeedback(null)

    try {
      const result = await window.api.restoreSqliteBackup()

      if (result.status === 'cancelled') {
        setFeedback({
          kind: 'info',
          message: 'Restore cancelled. Your database has not been changed.'
        })

        return
      }

      setFeedback({
        kind: 'success',
        message: 'Database restored successfully. Reloading application...'
      })
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Unable to restore database.'
      })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="database-page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">LOCAL STORAGE</div>
          <h1>Database Manager</h1>
          <p className="page-description">Manage your local SQLite data, backups, and recovery.</p>
        </div>

        <span className="database-local-badge">
          <span className="database-local-indicator" />
          Local SQLite
        </span>
      </div>

      <section className="database-overview">
        <div className="database-section-heading">
          <h2>Database Overview</h2>
          <p>Current records stored in your local database.</p>
        </div>

        <div className="database-stats">
          {formattedCounts.map((item) => (
            <div className="database-stat" key={item.label}>
              <span className="database-stat-value">{item.value.toLocaleString('en-US')}</span>
              <span className="database-stat-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="database-actions-grid">
        <div className="database-action-card">
          <div className="database-action-icon">↓</div>

          <h2>Create Backup</h2>

          <p>
            Create a verified copy of your current SQLite database. Your active data will remain
            unchanged.
          </p>

          <div className="database-action-footer">
            <span>Recommended before major changes</span>

            <button
              type="button"
              className="primary-button"
              onClick={() => void handleBackup()}
              disabled={busy !== null}
              aria-busy={busy === 'backup'}
            >
              {busy === 'backup' ? 'Creating Backup...' : 'Create Backup'}
            </button>
          </div>
        </div>

        <div className="database-action-card">
          <div className="database-action-icon database-restore-icon">↺</div>

          <h2>Restore Backup</h2>

          <p>
            Recover your data from an existing SQLite backup. A safety backup will be created before
            restoration.
          </p>

          <div className="database-action-footer">
            <span>Confirmation required</span>

            <button
              type="button"
              className="secondary-button"
              onClick={() => void handleRestore()}
              disabled={busy !== null}
              aria-busy={busy === 'restore'}
            >
              {busy === 'restore' ? 'Restoring...' : 'Restore Backup'}
            </button>
          </div>
        </div>
      </section>

      {feedback && (
        <div
          className={`database-feedback database-feedback-${feedback.kind}`}
          role={feedback.kind === 'error' ? 'alert' : 'status'}
        >
          {feedback.message}
        </div>
      )}

      {lastBackup && (
        <section className="database-backup-result">
          <div className="database-section-heading">
            <h2>Latest Backup Created</h2>
            <p>The backup was successfully checked for database integrity.</p>
          </div>

          <div className="database-backup-detail">
            <span>File location</span>
            <code>{lastBackup.path}</code>
          </div>

          <div className="database-backup-metadata">
            <div>
              <span>File size</span>
              <strong>{(lastBackup.sizeBytes / 1024).toFixed(1)} KB</strong>
            </div>

            <div>
              <span>Schema version</span>
              <strong>{lastBackup.schemaVersion}</strong>
            </div>

            <div>
              <span>Records</span>
              <strong>
                {lastBackup.counts.arcanists} Arcanists · {lastBackup.counts.statusEffects} Status
                Effects
              </strong>
            </div>
          </div>
        </section>
      )}

      <div className="database-information">
        <span aria-hidden="true">ⓘ</span>
        <p>
          Your database is stored locally on this computer. Backup files are saved separately in
          your TheSuitcaseLabBackups folder. Restoring a backup replaces the current records with
          the records in the selected file.
        </p>
      </div>
    </div>
  )
}

export default DatabasePage
