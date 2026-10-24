import { useEffect, useState, type JSX, type ReactNode } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

import { getImageUrl, getInitials } from './arcanistImage'

interface ArcanistDetailProps {
  arcanist: DashboardArcanist
  statusEffects: DashboardStatusEffect[]
  onBack: () => void
}

const sections = [
  { id: 'skills-section', label: 'Skills' },
  { id: 'mechanics-section', label: 'Mechanics' },
  { id: 'status-effects-section', label: 'Status Effects' },
  { id: 'portray-section', label: 'Portray' },
  { id: 'tags-section', label: 'Tags' },
  { id: 'notes-section', label: 'Notes' }
] as const

type SectionId = (typeof sections)[number]['id']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

function DetailText({ value }: { value: unknown }): JSX.Element {
  return (
    <p className="detail-text" style={{ whiteSpace: 'pre-line' }}>
      {toText(value) || 'No information available.'}
    </p>
  )
}

interface DetailSectionProps {
  id: SectionId
  title: string
  description: string
  children: ReactNode
}

function DetailSection({ id, title, description, children }: DetailSectionProps): JSX.Element {
  return (
    <section className="detail-section" id={id}>
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

function ArcanistDetail({ arcanist, statusEffects, onBack }: ArcanistDetailProps): JSX.Element {
  const [activeSection, setActiveSection] = useState<SectionId>('skills-section')

  const [imageError, setImageError] = useState(false)

  const imageUrl = getImageUrl(arcanist.image)

  const skills = Array.isArray(arcanist.skills) ? arcanist.skills.filter(isRecord) : []

  const portray = Array.isArray(arcanist.portray) ? arcanist.portray.filter(isRecord) : []

  const relatedStatusEffects = statusEffects.filter((effect) =>
    arcanist.relatedStatusEffects?.includes(effect.id)
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries): void => {
        entries.forEach((entry): void => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        })
      },
      {
        threshold: 0.25,
        rootMargin: '-120px 0px -55% 0px'
      }
    )

    sections.forEach(({ id }): void => {
      const element = document.getElementById(id)

      if (element) {
        observer.observe(element)
      }
    })

    return (): void => observer.disconnect()
  }, [])

  function scrollToSection(id: SectionId): void {
    setActiveSection(id)

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="detail-page">
      {/* BACK BUTTON */}
      <div className="detail-topbar">
        <button type="button" className="secondary-button back-arcanist-button" onClick={onBack}>
          ← Back to Arcanists
        </button>
      </div>

      {/* CHARACTER HERO */}
      <div className="detail-hero">
        <div className="detail-hero-image">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={arcanist.name}
              className="detail-character-image"
              onError={(): void => setImageError(true)}
            />
          ) : (
            <div className="detail-character-placeholder">
              <span>{getInitials(arcanist.name)}</span>
            </div>
          )}
        </div>

        <div className="detail-hero-content">
          <div className="detail-eyebrow">ARCANIST</div>

          <h1>{arcanist.name}</h1>

          <div className="detail-meta-row">
            <span className="detail-meta-badge">{arcanist.afflatus || 'Unknown Afflatus'}</span>

            <span className="detail-meta-badge">{arcanist.damageType || 'Unknown Damage'}</span>
          </div>

          <div className="detail-tags detail-hero-tags">
            {arcanist.roles?.length ? (
              arcanist.roles.map((role, index) => (
                <span className="tag" key={`${role}-${index}`}>
                  {role}
                </span>
              ))
            ) : (
              <p className="detail-empty">No roles.</p>
            )}
          </div>

          <div className="detail-hero-actions">
            <button
              type="button"
              className="secondary-button"
              disabled
              title="Editing will be available later"
            >
              Edit Arcanist
            </button>
          </div>
        </div>
      </div>

      {/* SECTION NAVIGATION */}
      <nav className="detail-section-nav" aria-label="Arcanist sections">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`detail-section-nav-item ${activeSection === id ? 'active' : ''}`}
            onClick={(): void => scrollToSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* SKILLS */}
      <DetailSection
        id="skills-section"
        title="Skills"
        description="Skills and abilities of this Arcanist."
      >
        {skills.length === 0 ? (
          <div className="detail-empty-block">
            <p className="detail-empty">No skills available.</p>
          </div>
        ) : (
          <div className="detail-repeatable-list skill-list">
            {skills.map((skill, index) => (
              <article className="detail-repeatable-item skill-detail-card" key={index}>
                <div className="skill-detail-header">
                  <div className="detail-item-title">
                    <span className="detail-item-number">{index + 1}</span>

                    <div className="skill-detail-heading">
                      <h3>{toText(skill.name) || 'Unnamed Skill'}</h3>
                    </div>
                  </div>

                  {toText(skill.type) && (
                    <span className="skill-type-badge">{toText(skill.type)}</span>
                  )}
                </div>

                <div className="skill-detail-description">
                  <DetailText value={skill.description} />
                </div>
              </article>
            ))}
          </div>
        )}
      </DetailSection>

      {/* MECHANICS */}
      <DetailSection
        id="mechanics-section"
        title="Mechanics"
        description="Important mechanics and behavior."
      >
        <div className="detail-note">
          <DetailText value={arcanist.mechanics} />
        </div>
      </DetailSection>

      {/* RELATED STATUS EFFECTS */}
      <DetailSection
        id="status-effects-section"
        title="Related Status Effects"
        description="Status effects associated with this Arcanist."
      >
        {relatedStatusEffects.length === 0 ? (
          <div className="detail-empty-block">
            <p className="detail-empty">No related Status Effects.</p>
          </div>
        ) : (
          <div className="related-status-effect-grid">
            {relatedStatusEffects.map((effect) => (
              <article className="related-status-effect-card" key={effect.id}>
                <div className="related-status-effect-content">
                  <div className="related-status-effect-header">
                    <h3>{effect.name}</h3>
                  </div>

                  {effect.description && (
                    <p className="related-status-effect-description">{effect.description}</p>
                  )}

                  {effect.tags && effect.tags.length > 0 && (
                    <div className="related-status-effect-tags">
                      {effect.tags.slice(0, 3).map((tag, index) => (
                        <span className="tag" key={`${tag}-${index}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </DetailSection>

      {/* PORTRAY */}
      <DetailSection
        id="portray-section"
        title="Portray"
        description="Portray effects and upgrades."
      >
        {portray.length === 0 ? (
          <div className="detail-empty-block">
            <p className="detail-empty">No Portray information available.</p>
          </div>
        ) : (
          <div className="detail-repeatable-list portray-list">
            {portray.map((item, index) => {
              const level = toText(item.level) || '?'

              return (
                <article className="detail-repeatable-item portray-detail-card" key={index}>
                  <div className="portray-detail-header">
                    <div className="portray-detail-title">
                      <span className="portray-level">P{level}</span>

                      <div>
                        <h3>Portray {level}</h3>
                        <p>Upgrade effect</p>
                      </div>
                    </div>
                  </div>

                  <div className="portray-detail-description">
                    <DetailText value={item.description} />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </DetailSection>

      {/* TAGS */}
      <DetailSection
        id="tags-section"
        title="Tags"
        description="Useful keywords for this Arcanist."
      >
        <div className="detail-tags">
          {arcanist.tags?.length ? (
            arcanist.tags.map((tag, index) => (
              <span className="tag" key={`${tag}-${index}`}>
                {tag}
              </span>
            ))
          ) : (
            <p className="detail-empty">No tags.</p>
          )}
        </div>
      </DetailSection>

      {/* NOTES */}
      <DetailSection
        id="notes-section"
        title="Notes"
        description="Personal notes and additional information."
      >
        <div className="detail-note">
          <DetailText value={arcanist.notes} />
        </div>
      </DetailSection>
    </div>
  )
}

export default ArcanistDetail
