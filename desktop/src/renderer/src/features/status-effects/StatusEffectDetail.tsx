import type { JSX, ReactNode } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

import '../../styles/css/status-effect-detail-polish.css'

interface StatusEffectDetailProps {
  statusEffect: DashboardStatusEffect
  arcanists: DashboardArcanist[]
  onBack: () => void
  onEdit: () => void
}

interface ArchiveSectionProps {
  number: string
  title: string
  description: string
  children: ReactNode
}

function ArchiveSection({
  number,
  title,
  description,
  children
}: ArchiveSectionProps): JSX.Element {
  return (
    <section className="archive-detail-section">
      <div className="archive-detail-section-heading">
        <span className="archive-detail-section-number">{number}</span>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="archive-detail-section-body">{children}</div>
    </section>
  )
}

function DetailText({
  value,
  fallback = 'No information available.'
}: {
  value?: string
  fallback?: string
}): JSX.Element {
  if (!value?.trim()) {
    return <p className="archive-detail-empty">{fallback}</p>
  }

  return <p className="archive-detail-text">{value}</p>
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

  const relatedArcanists = arcanists.filter(
    (arcanist) =>
      directRelations.includes(arcanist.id) ||
      arcanist.relatedStatusEffects?.includes(statusEffect.id)
  )

  const tags = Array.isArray(statusEffect.tags) ? statusEffect.tags : []

  const relatedMechanics = Array.isArray(statusEffect.relatedMechanics)
    ? statusEffect.relatedMechanics
    : []

  const category = statusEffect.category?.trim() || 'Status Effect'

  return (
    <div className="detail-page archive-status-detail">
      <div className="archive-detail-toolbar">
        <button type="button" className="archive-detail-back" onClick={onBack}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to Status Effects
        </button>

        <span className="archive-detail-breadcrumb">ARCHIVE / STATUS EFFECT</span>
      </div>

      <section className="archive-detail-hero">
        <div className="archive-detail-hero-main">
          <div className="archive-detail-emblem" aria-hidden="true">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M32 5 53 32 32 59 11 32 32 5Z" />
              <path d="M32 15 45 32 32 49 19 32 32 15Z" />
              <path d="M32 22v20M22 32h20" />
              <circle cx="32" cy="32" r="5" />
            </svg>
          </div>

          <div className="archive-detail-hero-copy">
            <span className="archive-detail-eyebrow">{category}</span>

            <h1>{statusEffect.name}</h1>

            <p>
              Status Effect Record
              <span aria-hidden="true"> · </span>
              Reverse: 1999 Knowledge Archive
            </p>
          </div>

          <button type="button" className="archive-detail-edit" onClick={onEdit}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
            </svg>
            Edit Status Effect
          </button>
        </div>

        <div className="archive-detail-hero-metrics">
          <div className="archive-detail-hero-metric">
            <span>Duration</span>

            <strong>{statusEffect.duration?.trim() || 'Not specified'}</strong>
          </div>

          <div className="archive-detail-hero-metric">
            <span>Stacking</span>

            <strong className={statusEffect.stackable ? 'archive-detail-metric-active' : undefined}>
              {statusEffect.stackable ? 'Stackable' : 'Not Stackable'}
            </strong>
          </div>

          <div className="archive-detail-hero-metric">
            <span>Linked Arcanists</span>

            <strong>
              {relatedArcanists.length} {relatedArcanists.length === 1 ? 'Arcanist' : 'Arcanists'}
            </strong>
          </div>
        </div>
      </section>

      <div className="archive-detail-grid">
        <div className="archive-detail-primary">
          <ArchiveSection
            number="01"
            title="Description"
            description="General information about this status effect."
          >
            <DetailText value={statusEffect.description} />
          </ArchiveSection>

          <ArchiveSection
            number="02"
            title="Effect"
            description="Gameplay behavior and mechanical effects."
          >
            <DetailText value={statusEffect.effect} />
          </ArchiveSection>

          <ArchiveSection
            number="03"
            title="Personal Notes"
            description="Additional observations and personal references."
          >
            <DetailText value={statusEffect.notes} fallback="No personal notes have been added." />
          </ArchiveSection>
        </div>

        <aside className="archive-detail-secondary">
          <section className="archive-detail-side-panel">
            <div className="archive-detail-side-heading">
              <div>
                <span className="archive-detail-side-eyebrow">CONNECTIONS</span>

                <h2>Related Arcanists</h2>
              </div>

              <span className="archive-detail-count">{relatedArcanists.length}</span>
            </div>

            {relatedArcanists.length === 0 ? (
              <p className="archive-detail-empty">No related Arcanists.</p>
            ) : (
              <ul className="archive-detail-relations">
                {relatedArcanists.map((arcanist) => (
                  <li key={arcanist.id} className="archive-detail-relation">
                    <span className="archive-detail-relation-symbol" aria-hidden="true">
                      ✦
                    </span>

                    <span className="archive-detail-relation-name">{arcanist.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="archive-detail-side-panel">
            <div className="archive-detail-side-heading">
              <div>
                <span className="archive-detail-side-eyebrow">CLASSIFICATION</span>

                <h2>Tags</h2>
              </div>

              <span className="archive-detail-count">{tags.length}</span>
            </div>

            {tags.length === 0 ? (
              <p className="archive-detail-empty">No tags available.</p>
            ) : (
              <div className="archive-detail-tag-list">
                {tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="archive-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {relatedMechanics.length > 0 && (
            <section className="archive-detail-side-panel">
              <div className="archive-detail-side-heading">
                <div>
                  <span className="archive-detail-side-eyebrow">MECHANICS</span>

                  <h2>Related Mechanics</h2>
                </div>
              </div>

              <div className="archive-detail-tag-list">
                {relatedMechanics.map((mechanic, index) => (
                  <span key={`${mechanic}-${index}`} className="archive-detail-tag">
                    {mechanic}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

export default StatusEffectDetail
