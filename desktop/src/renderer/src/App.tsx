import { useCallback, useEffect, useState, type JSX } from 'react'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import DashboardPage from './features/dashboard/DashboardPage'
import ArcanistsPage from './features/arcanists/ArcanistsPage'
import StatusEffectsPage from './features/status-effects/StatusEffectsPage'

import { setDashboardData } from './features/dashboard/dashboardData'
import { verifyAndMarkCutover } from './features/dashboard/sqliteCutover'
import { getPageFromHash, pageTitles, type Page } from './navigation'

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [, setRevision] = useState(0)

  const refreshData = useCallback(async (): Promise<void> => {
    const snapshot = await window.api.getSqliteSnapshot()

    setDashboardData(snapshot)
    setRevision((value) => value + 1)
  }, [])

  const initialize = useCallback(async (): Promise<void> => {
    try {
      if (!window.api || typeof window.api.getSqliteSnapshot !== 'function') {
        throw new Error('Electron SQLite API is unavailable.')
      }

      const status = await window.api.getSqliteWriteStatus()

      if (!status.enabled) {
        throw new Error(
          'SQLite write mode is disabled. Set SUITCASE_SQLITE_WRITE_ENABLED=YES before starting Electron.'
        )
      }

      const snapshot = await window.api.getSqliteSnapshot()

      verifyAndMarkCutover(snapshot)
      setDashboardData(snapshot)

      setError('')
      setReady(true)
    } catch (cause) {
      setReady(false)
      setError(cause instanceof Error ? cause.message : 'Unable to initialize SQLite.')
    }
  }, [])

  useEffect(() => {
    const handleHashChange = (): void => {
      setCurrentPage(getPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)

    return (): void => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(initialize)
  }, [initialize])

  function renderPage(): JSX.Element {
    if (!ready) {
      return (
        <div className="empty-state">
          <h2>{error ? 'SQLite Connection Required' : 'Loading SQLite...'}</h2>

          <p>{error || 'Loading your local database.'}</p>

          {error && (
            <button
              type="button"
              className="secondary-button"
              onClick={(): void => {
                void initialize()
              }}
            >
              Retry
            </button>
          )}
        </div>
      )
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />

      case 'arcanists':
        return <ArcanistsPage onRefresh={refreshData} />

      case 'status-effects':
        return <StatusEffectsPage onRefresh={refreshData} />
    }
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} />

      <main className="main-content">
        <Topbar title={pageTitles[currentPage]} />

        <section className="page-content" id="page-content">
          {renderPage()}
        </section>
      </main>
    </div>
  )
}

export default App
