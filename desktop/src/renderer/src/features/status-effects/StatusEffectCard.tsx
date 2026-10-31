import type { JSX } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

interface StatusEffectCardProps {
  statusEffect: DashboardStatusEffect
  arcanists: DashboardArcanist[]
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

function StatusEffectCard({
  statusEffect,
  arcanists,
  onOpen,
  onDelete
}: StatusEffectCardProps): JSX.Element {
  const relatedArcanistCount = arcanists.filter(
    (arcanist) =>
      statusEffect.relatedArcanists?.includes(arcanist.id) ||
      arcanist.relatedStatusEffects?.includes(statusEffect.id)
  ).length

  const tags = Array.isArray(statusEffect.tags) ? statusEffect.tags : []

  return (
    <article className="status-effect-card">
      <button
        type="button"
        className="status-effect-card-open"
        aria-label={`View details for ${statusEffect.name}`}
        onClick={(): void => onOpen(statusEffect.id)}
      />

      <div className="status-effect-card-content">
        <div className="status-effect-card-header">
          <h2 className="status-effect-card-title">{statusEffect.name}</h2>
        </div>

        <p className="status-effect-summary">
          {statusEffect.description || 'No description available.'}
        </p>

        {tags.length > 0 && (
          <div className="status-effect-tags">
            {tags.map((tag, index) => (
              <span className="tag" key={`${tag}-${index}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="status-effect-card-stats">
          <span>{statusEffect.duration || 'No duration'}</span>

          <span>{statusEffect.stackable ? 'Stackable' : 'Not Stackable'}</span>

          <span>
            {relatedArcanistCount} {relatedArcanistCount === 1 ? 'Arcanist' : 'Arcanists'}
          </span>
        </div>
      </div>

      <div className="status-effect-card-actions">
        <button
          type="button"
          className="danger-button delete-status-effect-button"
          onClick={(): void => onDelete(statusEffect.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default StatusEffectCard
