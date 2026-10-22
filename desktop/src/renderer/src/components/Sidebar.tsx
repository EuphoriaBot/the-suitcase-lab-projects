import type { Page } from '../navigation'
import type { JSX } from 'react'

interface SidebarProps {
  currentPage: Page
}

function Sidebar({ currentPage }: SidebarProps): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Reverse: 1999</h1>
        <p>Knowledge Base</p>
      </div>

      <nav className="sidebar-nav">
        <a href="#dashboard" className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}>
          <span>⌂</span>
          <span>Dashboard</span>
        </a>

        <div className="nav-section-title">DATABASE</div>

        <a href="#arcanists" className={`nav-item ${currentPage === 'arcanists' ? 'active' : ''}`}>
          <span>♙</span>
          <span>Arcanists</span>
        </a>

        <a
          href="#status-effects"
          className={`nav-item ${currentPage === 'status-effects' ? 'active' : ''}`}
        >
          <span>◇</span>
          <span>Status Effects</span>
        </a>
      </nav>
    </aside>
  )
}

export default Sidebar
