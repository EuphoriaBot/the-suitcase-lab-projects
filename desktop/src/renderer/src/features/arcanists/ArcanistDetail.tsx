import { useRef, useState, type JSX } from 'react'
import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'
import { getImageUrl, getInitials } from './arcanistImage'
import './arcanists-book.css'
import './arcanist-detail-book.css'

interface ArcanistDetailProps {
  arcanist: DashboardArcanist
  statusEffects: DashboardStatusEffect[]
  onBack: () => void
  onEdit: () => void
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
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function DetailText({ value }: { value: unknown }): JSX.Element {
  return <p className="arcanists-dossier__text">{toText(value) || 'No information available.'}</p>
}

function DossierPortrait({ arcanist }: { arcanist: DashboardArcanist }): JSX.Element {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getImageUrl(arcanist.image)

  return (
    <div className="arcanists-dossier__portrait">
      {imageUrl && !imageError ? (
        <img src={imageUrl} alt={arcanist.name} onError={(): void => setImageError(true)} />
      ) : (
        <span className="arcanists-dossier__monogram">{getInitials(arcanist.name)}</span>
      )}
    </div>
  )
}

export default function ArcanistDetail({
  arcanist,
  statusEffects,
  onBack,
  onEdit
}: ArcanistDetailProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<SectionId>('skills-section')
  const skills = Array.isArray(arcanist.skills) ? arcanist.skills.filter(isRecord) : []
  const portray = Array.isArray(arcanist.portray) ? arcanist.portray.filter(isRecord) : []
  const relatedStatusEffects = statusEffects.filter((effect) =>
    arcanist.relatedStatusEffects?.includes(effect.id)
  )

  function scrollToSection(id: SectionId): void {
    const container = scrollRef.current
    const target = container?.querySelector<HTMLElement>(`#${id}`)
    if (!container || !target) return

    const top =
      container.scrollTop +
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      8

    setActiveSection(id)
    container.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    })
  }

  function updateActiveSection(): void {
    const container = scrollRef.current
    if (!container) return

    const topEdge = container.getBoundingClientRect().top + 48
    let current: SectionId = 'skills-section'

    for (const section of sections) {
      const element = container.querySelector<HTMLElement>(`#${section.id}`)
      if (element && element.getBoundingClientRect().top <= topEdge) current = section.id
    }

    setActiveSection(current)
  }

  return (
    <section
      className="arcanists-book arcanists-dossier"
      aria-label={`Dossier of ${arcanist.name}`}
    >
      <div className="arcanists-book__desk">
        <div className="arcanists-book__spread arcanists-dossier__spread">
          <div className="arcanists-book__leaf arcanists-book__leaf--left arcanists-dossier__leaf">
            <div className="arcanists-dossier__topline">
              <button type="button" className="arcanists-dossier__back" onClick={onBack}>
                ← Arcanist Index
              </button>
              <span className="arcanists-dossier__seal" aria-hidden="true">
                ✧
              </span>
            </div>

            <div className="arcanists-dossier__identity">
              <span className="arcanists-book__kicker">VOL. I · PERSONNEL DOSSIER</span>
              <div className="arcanists-dossier__portrait-frame">
                <DossierPortrait key={arcanist.id} arcanist={arcanist} />
              </div>
              <span className="arcanists-dossier__record-number">
                ARCHIVE RECORD / {arcanist.id.slice(0, 8).toUpperCase()}
              </span>
              <h1>{arcanist.name}</h1>

              <div className="arcanists-dossier__metadata">
                <div>
                  <span>AFFLATUS</span>
                  <strong>{arcanist.afflatus || 'Unknown'}</strong>
                </div>
                <div>
                  <span>DAMAGE TYPE</span>
                  <strong>{arcanist.damageType || 'Unknown'}</strong>
                </div>
              </div>

              <div className="arcanists-dossier__roles">
                {arcanist.roles?.length ? (
                  arcanist.roles.map((role, index) => <span key={`${role}-${index}`}>{role}</span>)
                ) : (
                  <span>Unclassified Role</span>
                )}
              </div>
            </div>

            <div className="arcanists-dossier__left-footer">
              <button type="button" className="arcanists-dossier__edit" onClick={onEdit}>
                Edit Dossier ↗
              </button>
              <span className="arcanists-book__page-number">— 3 —</span>
            </div>
          </div>

          <div className="arcanists-book__leaf arcanists-book__leaf--right arcanists-dossier__leaf arcanists-dossier__leaf--research">
            <span className="arcanists-dossier__turn-sheet" aria-hidden="true" />

            <div className="arcanists-dossier__research-header">
              <span className="arcanists-book__kicker">FIELD NOTES · OBSERVATION RECORD</span>
              <h2>Research &amp; Records</h2>
              <p>Select a chapter, or scroll through the notes below.</p>
            </div>

            <nav className="arcanists-dossier__tabs" aria-label="Dossier chapters">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={activeSection === id ? 'is-active' : ''}
                  onClick={(): void => scrollToSection(id)}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div
              className="arcanists-dossier__scroll"
              ref={scrollRef}
              onScroll={updateActiveSection}
              tabIndex={0}
              role="region"
              aria-label="Scrollable Arcanist research notes"
            >
              <section className="arcanists-dossier__chapter" id="skills-section">
                <h3>
                  <span>01</span> Skills
                </h3>
                {skills.length ? (
                  <div className="arcanists-dossier__records">
                    {skills.map((skill, index) => (
                      <article className="arcanists-dossier__record" key={index}>
                        <div className="arcanists-dossier__record-heading">
                          <h4>{toText(skill.name) || 'Unnamed Skill'}</h4>
                          {toText(skill.type) && <span>{toText(skill.type)}</span>}
                        </div>
                        <DetailText value={skill.description} />
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="arcanists-dossier__empty">No skills available.</p>
                )}
              </section>

              <section className="arcanists-dossier__chapter" id="mechanics-section">
                <h3>
                  <span>02</span> Mechanics
                </h3>
                <DetailText value={arcanist.mechanics} />
              </section>

              <section className="arcanists-dossier__chapter" id="status-effects-section">
                <h3>
                  <span>03</span> Related Status Effects
                </h3>
                {relatedStatusEffects.length ? (
                  <div className="arcanists-dossier__records">
                    {relatedStatusEffects.map((effect) => (
                      <article className="arcanists-dossier__record" key={effect.id}>
                        <h4>{effect.name}</h4>
                        {effect.description && <DetailText value={effect.description} />}
                        {effect.tags?.length ? (
                          <div className="arcanists-dossier__tags">
                            {effect.tags.slice(0, 3).map((tag, index) => (
                              <span key={`${tag}-${index}`}>{tag}</span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="arcanists-dossier__empty">No related Status Effects.</p>
                )}
              </section>

              <section className="arcanists-dossier__chapter" id="portray-section">
                <h3>
                  <span>04</span> Portray
                </h3>
                {portray.length ? (
                  <div className="arcanists-dossier__records">
                    {portray.map((item, index) => {
                      const level = toText(item.level) || String(index + 1)
                      return (
                        <article className="arcanists-dossier__record" key={index}>
                          <div className="arcanists-dossier__record-heading">
                            <h4>Portray {level}</h4>
                            <span>P{level}</span>
                          </div>
                          <DetailText value={item.description} />
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <p className="arcanists-dossier__empty">No Portray information available.</p>
                )}
              </section>

              <section className="arcanists-dossier__chapter" id="tags-section">
                <h3>
                  <span>05</span> Tags
                </h3>
                {arcanist.tags?.length ? (
                  <div className="arcanists-dossier__tags">
                    {arcanist.tags.map((tag, index) => (
                      <span key={`${tag}-${index}`}>{tag}</span>
                    ))}
                  </div>
                ) : (
                  <p className="arcanists-dossier__empty">No tags.</p>
                )}
              </section>

              <section className="arcanists-dossier__chapter" id="notes-section">
                <h3>
                  <span>06</span> Notes
                </h3>
                <DetailText value={arcanist.notes} />
              </section>
            </div>

            <div className="arcanists-dossier__right-footer">
              <span>PRIVATE COLLECTION · THE SUITCASE LAB</span>
              <span className="arcanists-book__page-number">— 4 —</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
