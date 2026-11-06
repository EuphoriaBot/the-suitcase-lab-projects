import { useRef, useState, type JSX } from 'react'
import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'
import './status-effects-book.css'
import './status-effect-detail-book.css'

interface StatusEffectDetailProps {
  statusEffect: DashboardStatusEffect
  arcanists: DashboardArcanist[]
  onBack: () => void
  onEdit: () => void
}

const chapters = [
  { id: 'effect-description', label: 'Description' },
  { id: 'effect-behavior', label: 'Effect' },
  { id: 'effect-notes', label: 'Notes' },
  { id: 'effect-arcanists', label: 'Arcanists' },
  { id: 'effect-tags', label: 'Tags' },
  { id: 'effect-mechanics', label: 'Mechanics' }
] as const

type ChapterId = (typeof chapters)[number]['id']

function DetailText({
  value,
  fallback = 'No information available.'
}: {
  value?: string
  fallback?: string
}): JSX.Element {
  return <p className="status-effect-dossier__text">{value?.trim() || fallback}</p>
}

export default function StatusEffectDetail({
  statusEffect,
  arcanists,
  onBack,
  onEdit
}: StatusEffectDetailProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeChapter, setActiveChapter] = useState<ChapterId>('effect-description')

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

  function scrollToChapter(id: ChapterId): void {
    const container = scrollRef.current
    const target = container?.querySelector<HTMLElement>(`#${id}`)
    if (!container || !target) return

    const offset =
      container.scrollTop +
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      8

    setActiveChapter(id)
    container.scrollTo({
      top: offset,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    })
  }

  function updateActiveChapter(): void {
    const container = scrollRef.current
    if (!container) return

    const topEdge = container.getBoundingClientRect().top + 48
    let current: ChapterId = 'effect-description'

    for (const chapter of chapters) {
      const element = container.querySelector<HTMLElement>(`#${chapter.id}`)
      if (element && element.getBoundingClientRect().top <= topEdge) {
        current = chapter.id
      }
    }

    setActiveChapter(current)
  }

  return (
    <section
      className="status-effects-book status-effect-dossier"
      aria-label={`Status Effect record: ${statusEffect.name}`}
    >
      <div className="status-effects-book__desk">
        <div className="status-effects-book__spread status-effect-dossier__spread">
          <div className="status-effects-book__leaf status-effects-book__leaf--left status-effect-dossier__leaf">
            <div className="status-effect-dossier__topline">
              <button type="button" className="status-effect-dossier__back" onClick={onBack}>
                ← Status Effects Index
              </button>
              <span className="status-effect-dossier__seal" aria-hidden="true">
                ✧
              </span>
            </div>

            <div className="status-effect-dossier__identity">
              <span className="status-effects-book__kicker">VOL. II · OBSERVATION DOSSIER</span>

              <div className="status-effect-dossier__emblem" aria-hidden="true">
                <div className="status-effect-dossier__emblem-inner">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M50 6 83 50 50 94 17 50 50 6Z" />
                    <path d="M50 19 72 50 50 81 28 50 50 19Z" />
                    <path d="M50 27v46M27 50h46" />
                    <circle cx="50" cy="50" r="9" />
                    <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>

              <span className="status-effect-dossier__record-number">
                RESEARCH RECORD / {statusEffect.id.slice(0, 8).toUpperCase()}
              </span>
              <h1>{statusEffect.name}</h1>
              <span className="status-effect-dossier__category">
                {statusEffect.category?.trim() || 'Unclassified Effect'}
              </span>

              <div className="status-effect-dossier__metadata">
                <div>
                  <span>DURATION</span>
                  <strong>{statusEffect.duration?.trim() || 'Not specified'}</strong>
                </div>
                <div>
                  <span>STACKING</span>
                  <strong>{statusEffect.stackable ? 'Stackable' : 'Not Stackable'}</strong>
                </div>
                <div>
                  <span>RELATED ARCANISTS</span>
                  <strong>{relatedArcanists.length}</strong>
                </div>
              </div>

              <p className="status-effect-dossier__motto">Every phenomenon deserves a record.</p>
            </div>

            <div className="status-effect-dossier__left-footer">
              <button type="button" className="status-effect-dossier__edit" onClick={onEdit}>
                Edit Record ↗
              </button>
              <span className="status-effects-book__page-number">— 3 —</span>
            </div>
          </div>

          <div className="status-effects-book__leaf status-effects-book__leaf--right status-effect-dossier__leaf status-effect-dossier__leaf--research">
            <span className="status-effect-dossier__turn-sheet" aria-hidden="true" />

            <div className="status-effect-dossier__research-header">
              <span className="status-effects-book__kicker">
                RESEARCH JOURNAL · FIELD OBSERVATIONS
              </span>
              <h2>Research &amp; Records</h2>
              <p>Choose a chapter or scroll through the observations.</p>
            </div>

            <nav className="status-effect-dossier__tabs" aria-label="Status Effect chapters">
              {chapters.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={activeChapter === id ? 'is-active' : ''}
                  onClick={(): void => scrollToChapter(id)}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div
              className="status-effect-dossier__scroll"
              ref={scrollRef}
              onScroll={updateActiveChapter}
              tabIndex={0}
              role="region"
              aria-label="Scrollable Status Effect research notes"
            >
              <section className="status-effect-dossier__chapter" id="effect-description">
                <h3>
                  <span>01</span> Description
                </h3>
                <DetailText value={statusEffect.description} />
              </section>

              <section className="status-effect-dossier__chapter" id="effect-behavior">
                <h3>
                  <span>02</span> Effect
                </h3>
                <DetailText value={statusEffect.effect} />
              </section>

              <section className="status-effect-dossier__chapter" id="effect-notes">
                <h3>
                  <span>03</span> Personal Notes
                </h3>
                <DetailText
                  value={statusEffect.notes}
                  fallback="No personal notes have been added."
                />
              </section>

              <section className="status-effect-dossier__chapter" id="effect-arcanists">
                <h3>
                  <span>04</span> Related Arcanists
                </h3>
                {relatedArcanists.length ? (
                  <div className="status-effect-dossier__records">
                    {relatedArcanists.map((arcanist) => (
                      <div className="status-effect-dossier__record" key={arcanist.id}>
                        <span className="status-effect-dossier__record-symbol" aria-hidden="true">
                          ✦
                        </span>
                        <div>
                          <strong>{arcanist.name}</strong>
                          <small>{arcanist.afflatus || 'Unknown Afflatus'}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="status-effect-dossier__empty">No related Arcanists.</p>
                )}
              </section>

              <section className="status-effect-dossier__chapter" id="effect-tags">
                <h3>
                  <span>05</span> Tags
                </h3>
                {tags.length ? (
                  <div className="status-effect-dossier__tags">
                    {tags.map((tag, index) => (
                      <span key={`${tag}-${index}`}>{tag}</span>
                    ))}
                  </div>
                ) : (
                  <p className="status-effect-dossier__empty">No tags available.</p>
                )}
              </section>

              <section className="status-effect-dossier__chapter" id="effect-mechanics">
                <h3>
                  <span>06</span> Related Mechanics
                </h3>
                {relatedMechanics.length ? (
                  <div className="status-effect-dossier__tags">
                    {relatedMechanics.map((mechanic, index) => (
                      <span key={`${mechanic}-${index}`}>{mechanic}</span>
                    ))}
                  </div>
                ) : (
                  <p className="status-effect-dossier__empty">No related mechanics.</p>
                )}
              </section>
            </div>

            <div className="status-effect-dossier__right-footer">
              <span>RESEARCH CODEX · PRIVATE ARCHIVE</span>
              <span className="status-effects-book__page-number">— 4 —</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
