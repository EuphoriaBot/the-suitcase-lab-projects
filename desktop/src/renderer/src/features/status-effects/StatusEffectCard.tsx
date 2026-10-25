import type { JSX } from 'react'

import type { DashboardStatusEffect } from '../dashboard/dashboardData'

interface StatusEffectCardProps {
  statusEffect: DashboardStatusEffect
}

function StatusEffectCard({ statusEffect }: StatusEffectCardProps): JSX.Element {
  const relatedArcanistCount = Array.isArray(statusEffect.relatedArcanists)
    ? statusEffect.relatedArcanists.length
    : 0

  const tags = Array.isArray(statusEffect.tags) ? statusEffect.tags : []

  return (
    <article className="status-effect-card">
      <div className="status-effect-card-content">
        {/* STATUS EFFECT NAME */}
        <div className="status-effect-card-header">
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--color-text)'
              }}
            >
              {statusEffect.name}
            </h2>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="status-effect-summary">
          {statusEffect.description || 'No description available.'}
        </p>

        {/* TAGS */}
        {tags.length > 0 && (
          <div className="status-effect-tags">
            {tags.map((tag, index) => (
              <span className="tag" key={`${tag}-${index}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* STATUS EFFECT INFORMATION */}
        <div className="status-effect-card-stats">
          <span>{statusEffect.duration || 'No duration'}</span>

          <span>{statusEffect.stackable ? 'Stackable' : 'Not Stackable'}</span>

          <span>
            {relatedArcanistCount} {relatedArcanistCount === 1 ? 'Arcanist' : 'Arcanists'}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="status-effect-card-actions">
        <button
          type="button"
          className="danger-button delete-status-effect-button"
          disabled
          title="Delete will be available in a later stage"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default StatusEffectCard
