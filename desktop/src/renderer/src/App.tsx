import { useEffect, useState, type JSX } from 'react'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import DashboardPage from './features/dashboard/DashboardPage'
import ArcanistsPage from './features/arcanists/ArcanistsPage'
import StatusEffectsPage from './features/status-effects/StatusEffectsPage'

import { getPageFromHash, pageTitles, type Page } from './navigation'

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash)

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
    if (!import.meta.env.DEV) {
      return
    }

    if (typeof window.api?.getSqliteSnapshot !== 'function') {
      console.error('[SQLite IPC] Electron preload API is unavailable.')
      return
    }

    let cancelled = false

    void window.api
      .getSqliteSnapshot()
      .then((snapshot): void => {
        if (cancelled) {
          return
        }

        console.log('[SQLite IPC] READ SUCCESSFUL.')

        console.log('[SQLite IPC] Database counts:', {
          arcanists: snapshot.arcanists.length,
          skills: snapshot.arcanists.reduce((total, arcanist) => total + arcanist.skills.length, 0),
          portray: snapshot.arcanists.reduce(
            (total, arcanist) => total + arcanist.portray.length,
            0
          ),
          statusEffects: snapshot.statusEffects.length,
          relationships: snapshot.arcanists.reduce(
            (total, arcanist) => total + arcanist.relatedStatusEffects.length,
            0
          )
        })

        console.log('[SQLite IPC] Arcanists:')

        console.table(
          snapshot.arcanists.map((arcanist) => ({
            id: arcanist.id,
            name: arcanist.name
          }))
        )

        console.log('[SQLite IPC] Status Effects:')

        console.table(
          snapshot.statusEffects.map((effect) => ({
            id: effect.id,
            name: effect.name
          }))
        )
      })
      .catch((error: unknown): void => {
        if (cancelled) {
          return
        }

        console.error('[SQLite IPC] READ FAILED:', error)
      })

    return (): void => {
      cancelled = true
    }
  }, [])

  const title = pageTitles[currentPage]

  function renderPage(): JSX.Element {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />

      case 'arcanists':
        return <ArcanistsPage />

      case 'status-effects':
        return <StatusEffectsPage />
    }
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} />

      <main className="main-content">
        <Topbar title={title} />

        <section className="page-content" id="page-content">
          {renderPage()}
        </section>
      </main>
    </div>
  )
}

export default App
