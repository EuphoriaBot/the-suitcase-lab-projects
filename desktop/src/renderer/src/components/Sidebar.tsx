import type { JSX } from 'react'
import type { Page } from '../navigation'

interface SidebarProps {
  currentPage: Page
}

function Sidebar({ currentPage }: SidebarProps): JSX.Element {
  return (
    <aside className="sidebar archive-sidebar">
      <div className="archive-sidebar-brand">
        <div className="archive-brand-mark" aria-hidden="true">
          <svg
            width="27"
            height="27"
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 5.5h14v17H7z" />
            <path d="M10 5.5v17" />
            <path d="M13 10h5" />
            <path d="M13 14h5" />
            <path d="M13 18h3" />
            <path d="M4 9v10" />
          </svg>
        </div>

        <div className="archive-brand-copy">
          <span className="archive-brand-eyebrow">THE SUITCASE LAB</span>

          <h1>Reverse: 1999</h1>

          <p>Knowledge Archive</p>
        </div>
      </div>

      <div className="archive-sidebar-divider" aria-hidden="true">
        <span />
        <span className="archive-divider-diamond" />
        <span />
      </div>

      <nav className="sidebar-nav archive-nav" aria-label="Main navigation">
        <div className="archive-nav-group">
          <div className="nav-section-title archive-nav-caption">OVERVIEW</div>

          <a
            href="#dashboard"
            className={`nav-item archive-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          >
            <span className="archive-nav-icon" aria-hidden="true">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 10 9-7 9 7" />
                <path d="M5 9v11h14V9" />
                <path d="M9 20v-7h6v7" />
              </svg>
            </span>

            <span className="archive-nav-label">Dashboard</span>

            <span className="archive-nav-active-dot" aria-hidden="true" />
          </a>
        </div>

        <div className="archive-nav-group">
          <div className="nav-section-title archive-nav-caption">COLLECTION</div>

          <a
            href="#arcanists"
            className={`nav-item archive-nav-item ${currentPage === 'arcanists' ? 'active' : ''}`}
            aria-current={currentPage === 'arcanists' ? 'page' : undefined}
          >
            <span className="archive-nav-icon" aria-hidden="true">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7.5" r="3" />
                <path d="M6.5 20v-2.5a5.5 5.5 0 0 1 11 0V20" />
                <path d="M4 20h16" />
                <path d="M12 2v2" />
              </svg>
            </span>

            <span className="archive-nav-label">Arcanists</span>

            <span className="archive-nav-active-dot" aria-hidden="true" />
          </a>

          <a
            href="#status-effects"
            className={`nav-item archive-nav-item ${
              currentPage === 'status-effects' ? 'active' : ''
            }`}
            aria-current={currentPage === 'status-effects' ? 'page' : undefined}
          >
            <span className="archive-nav-icon" aria-hidden="true">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 2 8 10-8 10L4 12 12 2Z" />
                <path d="M8 12h8" />
                <path d="m12 8 4 4-4 4-4-4 4-4Z" />
              </svg>
            </span>

            <span className="archive-nav-label">Status Effects</span>

            <span className="archive-nav-active-dot" aria-hidden="true" />
          </a>
        </div>

        <div className="archive-nav-group">
          <div className="nav-section-title archive-nav-caption">WORKSPACE</div>

          <a
            href="#database"
            className={`nav-item archive-nav-item ${currentPage === 'database' ? 'active' : ''}`}
            aria-current={currentPage === 'database' ? 'page' : undefined}
          >
            <span className="archive-nav-icon" aria-hidden="true">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="12" cy="5" rx="8" ry="3" />
                <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
              </svg>
            </span>

            <span className="archive-nav-label">Database</span>

            <span className="archive-nav-active-dot" aria-hidden="true" />
          </a>
        </div>
      </nav>

      <div className="archive-sidebar-footer">
        <div className="archive-footer-symbol" aria-hidden="true">
          <span />
        </div>

        <div className="archive-footer-content">
          <span>PERSONAL ARCHIVE</span>
          <small>Stored on this device</small>
        </div>

        <span className="archive-footer-status" aria-label="Local storage" />
      </div>
    </aside>
  )
}

export default Sidebar
