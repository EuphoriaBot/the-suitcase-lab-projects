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
