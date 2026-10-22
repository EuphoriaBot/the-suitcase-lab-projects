
import { useEffect, useState } from 'react'

const pageTitles = {
  dashboard: 'Dashboard',
  arcanists: 'Arcanists',
  'status-effects': 'Status Effects'
} as const

type Page = keyof typeof pageTitles

function getPageFromHash(): Page {
  const hash = window.location.hash.slice(1)

  return hash in pageTitles
    ? (hash as Page)
    : 'dashboard'
}

function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash())
    }

    window.addEventListener(
      'hashchange',
      handleHashChange
    )

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHashChange
      )
    }
  }, [])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Reverse: 1999</h1>
          <p>Knowledge Base</p>
        </div>

        <nav className="sidebar-nav">
          <a
            href="#dashboard"
            className={`nav-item ${
              currentPage === 'dashboard' ? 'active' : ''
            }`}
          >
            <span>⌂</span>
            <span>Dashboard</span>
          </a>

          <div className="nav-section-title">
            DATABASE
          </div>

          <a
            href="#arcanists"
            className={`nav-item ${
              currentPage === 'arcanists' ? 'active' : ''
            }`}
          >
            <span>♙</span>
            <span>Arcanists</span>
          </a>

          <a
            href="#status-effects"
            className={`nav-item ${
              currentPage === 'status-effects'
                ? 'active'
                : ''
            }`}
          >
            <span>◇</span>
            <span>Status Effects</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{pageTitles[currentPage]}</h2>
          </div>

          <div className="search-box">
            <span
              className="search-icon"
              aria-hidden="true"
            >
              🔍
            </span>

            <input
              type="search"
              placeholder="Search Arcanists and Status Effects..."
              aria-label="Search Arcanists and Status Effects"
              disabled
            />

            <kbd className="search-shortcut">
              /
            </kbd>
          </div>
        </header>

        <section
          className="page-content"
          id="page-content"
        >
          <div className="page-header">
            <div>
              <h1>{pageTitles[currentPage]}</h1>
              <p className="page-description">
                Content will be migrated to React.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
