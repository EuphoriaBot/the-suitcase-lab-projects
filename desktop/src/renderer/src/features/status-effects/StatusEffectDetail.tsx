import type { JSX, ReactNode } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

interface StatusEffectDetailProps {
  statusEffect: DashboardStatusEffect
  arcanists: DashboardArcanist[]
  onBack: () => void
  onEdit: () => void
}

interface DetailSectionProps {
  title: string
  description: string
  className?: string
  children: ReactNode
}

function DetailSection({
  title,
  description,
  className = '',
  children
}: DetailSectionProps): JSX.Element {
  return (
    <section className={`detail-section ${className}`}>
      <div className="detail-section-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </section>
  )
}

function DetailText({ value }: { value?: string }): JSX.Element {
  if (!value?.trim()) {
    return <p className="detail-empty">No information available.</p>
  }

  return (
    <p className="detail-text" style={{ whiteSpace: 'pre-line' }}>
      {value}
    </p>
  )
}

function StatusEffectDetail({
  statusEffect,
  arcanists,
  onBack,
  onEdit
}: StatusEffectDetailProps): JSX.Element {
  const directRelations = Array.isArray(statusEffect.relatedArcanists)
    ? statusEffect.relatedArcanists
    : []

  // Read relationships recorded on either side.
  const relatedArcanists = arcanists.filter(
    (arcanist) =>
      directRelations.includes(arcanist.id) ||
      arcanist.relatedStatusEffects?.includes(statusEffect.id)
  )

  const tags = Array.isArray(statusEffect.tags) ? statusEffect.tags : []

  return (
    <div className="detail-page">
      {/* BACK BUTTON */}
      <div className="detail-topbar">
        <button
          type="button"
          className="secondary-button back-status-effect-button"
          onClick={onBack}
        >
          ← Back to Status Effects
        </button>
      </div>

      {/* STATUS EFFECT HERO */}
      <div className="detail-hero status-effect-detail-hero">
        <div className="detail-hero-content">
          <div className="detail-eyebrow">STATUS EFFECT</div>

          <h1>{statusEffect.name}</h1>

          <div className="status-effect-summary-badges">
            <span className="detail-info-badge">
              {statusEffect.duration || 'Duration not specified'}
            </span>

            <span
              className={`detail-info-badge ${
                statusEffect.stackable ? 'detail-info-badge-active' : ''
              }`}
            >
              {statusEffect.stackable ? 'Stackable' : 'Not Stackable'}
            </span>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <div className="detail-hero-actions">
          <button type="button" className="secondary-button" onClick={onEdit}>
            Edit Status Effect
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      <DetailSection
        title="Description"
        description="What this status effect represents."
        className="status-effect-primary-section"
      >
        <div className="detail-note">
          <DetailText value={statusEffect.description} />
        </div>
      </DetailSection>

      {/* EFFECT */}
      <DetailSection
        title="Effect"
        description="How this status effect affects gameplay."
        className="status-effect-primary-section"
      >
        <div className="detail-note">
          <DetailText value={statusEffect.effect} />
        </div>
      </DetailSection>

      {/* RELATED ARCANISTS */}
      <DetailSection
        title="Related Arcanists"
        description="Arcanists associated with this status effect."
      >
        {relatedArcanists.length === 0 ? (
          <p className="detail-empty">No related Arcanists.</p>
        ) : (
          <div className="related-item-list">
            {relatedArcanists.map((arcanist) => (
              <span key={arcanist.id} className="detail-info-badge">
                {arcanist.name}
              </span>
            ))}
          </div>
        )}
      </DetailSection>

      {/* TAGS */}
      <DetailSection
        title="Tags"
        description="Useful keywords for this status effect."
        className="status-effect-tags-section"
      >
        <div className="detail-tags">
          {tags.length === 0 ? (
            <p className="detail-empty">No tags.</p>
          ) : (
            tags.map((tag, index) => (
              <span className="tag" key={`${tag}-${index}`}>
                {tag}
              </span>
            ))
          )}
        </div>
      </DetailSection>

      {/* NOTES */}
      <DetailSection
        title="Notes"
        description="Personal notes and additional information."
        className="status-effect-notes-section"
      >
        <div className="detail-note">
          <DetailText value={statusEffect.notes} />
        </div>
      </DetailSection>
    </div>
  )
}

export default StatusEffectDetail
