import type { JSX } from 'react'
import { getDashboardData } from '../dashboard/dashboardData'
import ArcanistCard from './ArcanistCard'

function ArcanistsPage(): JSX.Element {
  const { arcanists } = getDashboardData()

  return (
    <div className="arcanists-page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">DATABASE</div>

          <h1>Arcanists</h1>

          <p className="page-description">Browse and manage your Reverse: 1999 Arcanist notes.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          disabled
          title="Add Arcanist feature is not available yet"
        >
          + Add Arcanist
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Arcanists..."
          aria-label="Search Arcanists"
          disabled
        />
      </div>

      {arcanists.length === 0 ? (
        <div className="empty-state">
          <h2>No Arcanists Found</h2>
          <p>No Arcanists have been recorded yet.</p>
        </div>
      ) : (
        <div className="arcanist-grid">
          {arcanists.map((arcanist) => (
            <ArcanistCard key={arcanist.id} arcanist={arcanist} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ArcanistsPage
