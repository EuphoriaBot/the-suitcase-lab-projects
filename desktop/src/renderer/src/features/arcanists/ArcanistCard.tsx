import { useState, type JSX } from 'react'
import type { DashboardArcanist } from '../dashboard/dashboardData'

interface ArcanistCardProps {
  arcanist: DashboardArcanist
}

const imageAssets = import.meta.glob('../../assets/arcanist/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>

function getImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) return undefined

  const filename = imagePath.split(/[\\/]/).pop()
  if (!filename) return undefined

  for (const [path, url] of Object.entries(imageAssets)) {
    if (path.endsWith('/' + filename)) {
      return url
    }
  }

  return undefined
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (!parts[0]) return '?'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ArcanistCard({ arcanist }: ArcanistCardProps): JSX.Element {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getImageUrl(arcanist.image)

  return (
    <article className="arcanist-gallery-card" style={{ cursor: 'default' }}>
      <div className="arcanist-card-main">
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
          disabled
          title="Edit feature is not available yet"
        >
          Edit
        </button>

        <button
          type="button"
          className="danger-button"
          disabled
          title="Delete feature is not available yet"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default ArcanistCard
