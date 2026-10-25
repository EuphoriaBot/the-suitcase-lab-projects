import { useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'

import StatusEffectCard from './StatusEffectCard'
import StatusEffectDetail from './StatusEffectDetail'

import { matchesStatusEffectSearch } from './statusEffectSearch'

function StatusEffectsPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedStatusEffectId, setSelectedStatusEffectId] = useState<string | null>(null)

  const { arcanists, statusEffects } = getDashboardData()

  const keyword = searchQuery.trim()

  const filteredStatusEffects = keyword
    ? statusEffects.filter((statusEffect) => matchesStatusEffectSearch(statusEffect, keyword))
    : statusEffects

  const selectedStatusEffect = statusEffects.find(
    (statusEffect) => statusEffect.id === selectedStatusEffectId
  )

  function openDetail(id: string): void {
    setSelectedStatusEffectId(id)
  }

  function backToList(): void {
    setSelectedStatusEffectId(null)
  }

  // STATUS EFFECT DETAIL
  if (selectedStatusEffect) {
    return (
      <StatusEffectDetail
        statusEffect={selectedStatusEffect}
        arcanists={arcanists}
        onBack={backToList}
      />
    )
  }

  // STATUS EFFECT LIST
  return (
    <div className="status-effects-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">DATABASE</div>

          <h1>Status Effects</h1>

          <p className="page-description">Record and review your Reverse: 1999 Status Effects.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          disabled
          title="Add Status Effect will be available later"
        >
          + Add Status Effect
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, effect, tag..."
          aria-label="Search Status Effects"
          value={searchQuery}
          onChange={(event): void => setSearchQuery(event.target.value)}
        />
      </div>

      {/* STATUS EFFECT LIST */}
      <div className="status-effect-list">
        {filteredStatusEffects.length === 0 ? (
          <div className="empty-state">
            <h2>No Status Effects Found</h2>

            <p>
              {keyword
                ? 'There are no Status Effects matching your search.'
                : 'No Status Effects have been recorded yet.'}
            </p>
          </div>
        ) : (
          filteredStatusEffects.map((statusEffect) => (
            <StatusEffectCard
              key={statusEffect.id}
              statusEffect={statusEffect}
              arcanists={arcanists}
              onOpen={openDetail}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default StatusEffectsPage
