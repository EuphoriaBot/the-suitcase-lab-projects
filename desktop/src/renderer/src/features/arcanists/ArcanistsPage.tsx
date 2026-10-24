import { useState, type JSX } from 'react'
import { getDashboardData } from '../dashboard/dashboardData'
import ArcanistCard from './ArcanistCard'
import { matchesArcanistSearch } from './arcanistSearch'

function ArcanistsPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  const { arcanists } = getDashboardData()

  const keyword = searchQuery.trim().toLowerCase()

  const filteredArcanists = keyword
    ? arcanists.filter((arcanist) => matchesArcanistSearch(arcanist, keyword))
    : arcanists

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
          value={searchQuery}
          onChange={(event): void => setSearchQuery(event.target.value)}
        />
      </div>

      {filteredArcanists.length === 0 ? (
        <div className="empty-state">
          <h2>No Arcanists Found</h2>

          <p>
            {keyword
              ? 'There are no Arcanists matching your search.'
              : 'No Arcanists have been recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="arcanist-grid">
          {filteredArcanists.map((arcanist) => (
            <ArcanistCard key={arcanist.id} arcanist={arcanist} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ArcanistsPage
