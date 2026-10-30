import type { JSX } from 'react'

interface TopbarProps {
  title: string
}

function Topbar({ title }: TopbarProps): JSX.Element {
  return (
    <header className="topbar archive-topbar">
      <div className="archive-topbar-heading">
        <span className="archive-topbar-eyebrow">
          THE SUITCASE LAB
          <span className="archive-topbar-separator" aria-hidden="true">
            /
          </span>
          ARCHIVE
        </span>

        <h2>{title}</h2>
      </div>

      <div className="archive-topbar-tools">
        <div className="search-box archive-search-box">
          <span className="search-icon archive-search-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
          </span>

          <input
            type="search"
            placeholder="Global search coming soon"
            aria-label="Global search is not available yet"
            title="Use the search field in Arcanists or Status Effects"
            disabled
          />

          <span className="archive-search-soon" aria-hidden="true">
            SOON
          </span>
        </div>

        <div className="archive-topbar-status">
          <span className="archive-status-indicator" aria-hidden="true" />

          <div className="archive-status-copy">
            <strong>LOCAL ARCHIVE</strong>
            <small>Private workspace</small>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
