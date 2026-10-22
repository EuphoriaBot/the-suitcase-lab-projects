import type { JSX } from 'react'

interface TopbarProps {
  title: string
}

function Topbar({ title }: TopbarProps): JSX.Element {
  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
      </div>

      <div className="search-box">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>

        <input
          type="search"
          placeholder="Search Arcanists and Status Effects..."
          aria-label="Search Arcanists and Status Effects"
          disabled
        />

        <kbd className="search-shortcut">/</kbd>
      </div>
    </header>
  )
}

export default Topbar
