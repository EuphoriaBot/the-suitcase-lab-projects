import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import type { JSX } from 'react'

import { getPageFromHash, pageTitles, type Page } from './navigation'

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash)

  useEffect(() => {
    const handleHashChange = (): void => {
      setCurrentPage(getPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const title = pageTitles[currentPage]

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} />

      <main className="main-content">
        <Topbar title={title} />

        <section className="page-content" id="page-content">
          <div className="page-header">
            <div>
              <h1>{title}</h1>
              <p className="page-description">Content will be migrated to React.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
