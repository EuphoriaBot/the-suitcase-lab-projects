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
    </header>
  )
}

export default Topbar
