import { useState, type JSX } from 'react'
import type { DashboardArcanist } from '../dashboard/dashboardData'
import { getImageUrl, getInitials } from './arcanistImage'

interface ArcanistCardProps {
  arcanist: DashboardArcanist
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function ArcanistCard({ arcanist, onOpen, onEdit, onDelete }: ArcanistCardProps): JSX.Element {
  const [imageError, setImageError] = useState(false)

  const imageUrl = getImageUrl(arcanist.image)

  return (
    <article className="arcanist-gallery-card">
      <div
        className="arcanist-card-main"
        role="button"
        tabIndex={0}
        aria-label={`Open ${arcanist.name} details`}
        onClick={(): void => onOpen(arcanist.id)}
        onKeyDown={(event): void => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(arcanist.id)
          }
        }}
      >
        <div className="arcanist-image-overlay">
          <span className="arcanist-gallery-type">ARCANIST</span>
        </div>

        <div className="arcanist-image-container">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={arcanist.name}
              className="arcanist-card-image"
              onError={(): void => setImageError(true)}
            />
          ) : (
            <div className="arcanist-image-placeholder">
              <span>{getInitials(arcanist.name)}</span>
            </div>
          )}
        </div>

        <div className="arcanist-gallery-info">
          <h2 className="arcanist-gallery-name">{arcanist.name}</h2>

          <div className="arcanist-gallery-meta">
            <span>{arcanist.afflatus || 'Unknown'}</span>

            <span className="arcanist-gallery-divider" aria-hidden="true">
              •
            </span>

            <span>{arcanist.damageType || 'Unknown'}</span>
          </div>

          {arcanist.roles && arcanist.roles.length > 0 && (
            <div className="arcanist-gallery-tags">
              {arcanist.roles.map((role, index) => (
                <span className="tag" key={`${role}-${index}`}>
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="arcanist-gallery-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={(): void => onEdit(arcanist.id)}
        >
          Edit
        </button>

        <button type="button" className="danger-button" onClick={(): void => onDelete(arcanist.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default ArcanistCard
