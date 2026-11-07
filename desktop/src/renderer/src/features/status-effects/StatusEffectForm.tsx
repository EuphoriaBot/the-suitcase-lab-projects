import { useRef, useState, type FormEvent, type JSX } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'
import type { StatusEffectPayload } from './statusEffectStorage'

import './status-effects-book.css'
import './status-effect-form-book.css'

interface StatusEffectFormProps {
  initialStatusEffect?: DashboardStatusEffect
  arcanists: DashboardArcanist[]
  onSave: (payload: StatusEffectPayload) => void
  onCancel: () => void
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getInitialRelationships(
  statusEffect: DashboardStatusEffect | undefined,
  arcanists: DashboardArcanist[]
): string[] {
  if (!statusEffect) {
    return []
  }

  const directIds = Array.isArray(statusEffect.relatedArcanists)
    ? statusEffect.relatedArcanists
    : []
  const reverseIds = arcanists
    .filter((arcanist) => arcanist.relatedStatusEffects?.includes(statusEffect.id))
    .map((arcanist) => arcanist.id)

  return [...new Set([...directIds, ...reverseIds])]
}

export default function StatusEffectForm({
  initialStatusEffect,
  arcanists,
  onSave,
  onCancel
}: StatusEffectFormProps): JSX.Element {
  const isEditing = Boolean(initialStatusEffect)

  const [name, setName] = useState(initialStatusEffect?.name ?? '')
  const [description, setDescription] = useState(initialStatusEffect?.description ?? '')
  const [effect, setEffect] = useState(initialStatusEffect?.effect ?? '')
  const [duration, setDuration] = useState(initialStatusEffect?.duration ?? '')
  const [stackable, setStackable] = useState(initialStatusEffect?.stackable ?? false)
  const [tags, setTags] = useState((initialStatusEffect?.tags ?? []).join(', '))
  const [notes, setNotes] = useState(initialStatusEffect?.notes ?? '')
  const [relatedArcanists, setRelatedArcanists] = useState<string[]>(() =>
    getInitialRelationships(initialStatusEffect, arcanists)
  )
  const [error, setError] = useState('')

  const rightScrollRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLElement>(null)
  const effectRef = useRef<HTMLElement>(null)
  const relationshipsRef = useRef<HTMLElement>(null)
  const notesRef = useRef<HTMLElement>(null)

  function toggleArcanist(id: string): void {
    setRelatedArcanists((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    )
  }

  function scrollToSection(section: HTMLElement | null): void {
    const container = rightScrollRef.current
    if (!container || !section) {
      return
    }

    const offset = section.getBoundingClientRect().top - container.getBoundingClientRect().top
    container.scrollTo({ top: container.scrollTop + offset - 6, behavior: 'smooth' })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Status Effect name is required.')
      return
    }

    const payload: StatusEffectPayload = {
      name: name.trim(),
      description: description.trim(),
      effect: effect.trim(),
      duration: duration.trim(),
      stackable,
      relatedArcanists,
      tags: parseList(tags),
      notes: notes.trim()
    }

    try {
      onSave(payload)
    } catch (cause) {
      console.error('Unable to save Status Effect:', cause)
      setError(cause instanceof Error ? cause.message : 'Unable to save Status Effect.')
    }
  }

  return (
    <section
      className="status-effects-book status-effect-editor"
      aria-label="Status Effect record editor"
    >
      <form
        className="status-effect-editor__form status-effects-book__desk"
        onSubmit={handleSubmit}
      >
        <div className="status-effects-book__spread">
          <div className="status-effects-book__leaf status-effects-book__leaf--left status-effect-editor__leaf">
            <div className="status-effect-editor__topline">
              <span className="status-effects-book__kicker">VOL. II · RESEARCH CODEX</span>
              <button type="button" className="status-effect-editor__back" onClick={onCancel}>
                ← Back
              </button>
            </div>

            <header className="status-effect-editor__heading">
              <span className="status-effect-editor__eyebrow">STATUS EFFECT / RESEARCH RECORD</span>
              <h1>{isEditing ? 'Edit Status Effect' : 'Register Status Effect'}</h1>
              <p>
                {isEditing
                  ? 'Revise an existing record in the archive.'
                  : 'Document a newly observed status effect.'}
              </p>
            </header>

            <div className="status-effect-editor__scroll status-effect-editor__scroll--left">
              <section
                className="status-effect-editor__section"
                aria-labelledby="effect-identity-heading"
              >
                <div className="status-effect-editor__section-title">
                  <span>01</span>
                  <div>
                    <h2 id="effect-identity-heading">Effect Identity</h2>
                    <p>Basic classification of the observed phenomenon.</p>
                  </div>
                </div>

                <div className="status-effect-editor__field">
                  <label htmlFor="status-effect-name">Name</label>
                  <input
                    type="text"
                    id="status-effect-name"
                    name="name"
                    placeholder="e.g. Burn"
                    value={name}
                    required
                    onChange={(event): void => setName(event.target.value)}
                  />
                </div>

                <div className="status-effect-editor__field">
                  <label htmlFor="status-effect-duration">Duration</label>
                  <input
                    type="text"
                    id="status-effect-duration"
                    name="duration"
                    placeholder="e.g. 2 rounds"
                    value={duration}
                    onChange={(event): void => setDuration(event.target.value)}
                  />
                </div>

                <div className="status-effect-editor__field">
                  <span className="status-effect-editor__label">Stacking</span>
                  <label
                    className="status-effect-editor__checkbox"
                    htmlFor="status-effect-stackable"
                  >
                    <input
                      type="checkbox"
                      id="status-effect-stackable"
                      name="stackable"
                      checked={stackable}
                      onChange={(event): void => setStackable(event.target.checked)}
                    />
                    <span>This status effect can stack.</span>
                  </label>
                </div>
              </section>

              <section
                className="status-effect-editor__section"
                aria-labelledby="effect-classification-heading"
              >
                <div className="status-effect-editor__section-title">
                  <span>02</span>
                  <div>
                    <h2 id="effect-classification-heading">Classification</h2>
                    <p>Keywords used to organize the codex.</p>
                  </div>
                </div>

                <div className="status-effect-editor__field">
                  <label htmlFor="status-effect-tags">Tags</label>
                  <input
                    type="text"
                    id="status-effect-tags"
                    name="tags"
                    placeholder="e.g. Debuff, Damage, Control"
                    value={tags}
                    onChange={(event): void => setTags(event.target.value)}
                  />
                  <small>Separate multiple tags with commas.</small>
                </div>
              </section>
            </div>

            {error && (
              <p className="status-effect-editor__error" role="alert">
                {error}
              </p>
            )}

            <div className="status-effect-editor__actions">
              <button type="button" className="status-effect-editor__cancel" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="status-effect-editor__save">
                {isEditing ? 'Save Changes' : 'Save Status Effect'}
              </button>
            </div>

            <span className="status-effects-book__page-number">— 5 —</span>
          </div>

          <div className="status-effects-book__leaf status-effects-book__leaf--right status-effect-editor__leaf">
            <div className="status-effect-editor__research-heading">
              <div>
                <span className="status-effects-book__kicker">FIELD OBSERVATIONS</span>
                <h2>Research Notes</h2>
                <p>Record the effects, connections, and your own observations.</p>
              </div>
              <span className="status-effect-editor__seal" aria-hidden="true">
                ✧
              </span>
            </div>

            <nav className="status-effect-editor__tabs" aria-label="Research sections">
              <button type="button" onClick={(): void => scrollToSection(descriptionRef.current)}>
                Description
              </button>
              <button type="button" onClick={(): void => scrollToSection(effectRef.current)}>
                Effect
              </button>
              <button type="button" onClick={(): void => scrollToSection(relationshipsRef.current)}>
                Arcanists
              </button>
              <button type="button" onClick={(): void => scrollToSection(notesRef.current)}>
                Notes
              </button>
            </nav>

            <div
              className="status-effect-editor__scroll status-effect-editor__scroll--right"
              ref={rightScrollRef}
            >
              <section
                ref={descriptionRef}
                className="status-effect-editor__section"
                aria-labelledby="effect-description-heading"
              >
                <div className="status-effect-editor__section-title">
                  <span>03</span>
                  <div>
                    <h2 id="effect-description-heading">Description</h2>
                    <p>What is known about this status effect?</p>
                  </div>
                </div>

                <div className="status-effect-editor__field">
                  <label htmlFor="status-effect-description">Description</label>
                  <textarea
                    id="status-effect-description"
                    name="description"
                    rows={6}
                    placeholder="Explain what this status effect is..."
                    value={description}
                    onChange={(event): void => setDescription(event.target.value)}
                  />
                </div>
              </section>

              <section
                ref={effectRef}
                className="status-effect-editor__section"
                aria-labelledby="effect-mechanics-heading"
              >
                <div className="status-effect-editor__section-title">
                  <span>04</span>
                  <div>
                    <h2 id="effect-mechanics-heading">Effect</h2>
                    <p>Describe the exact gameplay behavior.</p>
                  </div>
                </div>

                <div className="status-effect-editor__field">
                  <label htmlFor="status-effect-effect">Effect</label>
                  <textarea
                    id="status-effect-effect"
                    name="effect"
                    rows={7}
                    placeholder="Explain what this status effect does..."
                    value={effect}
                    onChange={(event): void => setEffect(event.target.value)}
                  />
                </div>
              </section>

              <section
                ref={relationshipsRef}
                className="status-effect-editor__section"
                aria-labelledby="effect-relations-heading"
              >
                <div className="status-effect-editor__section-title">
                  <span>05</span>
                  <div>
                    <h2 id="effect-relations-heading">Related Arcanists</h2>
                    <p>Select the Arcanists associated with this status effect.</p>
                  </div>
                </div>

                <div className="status-effect-editor__relation-count">
                  {relatedArcanists.length} selected
                </div>

                {arcanists.length === 0 ? (
                  <p className="status-effect-editor__empty">No Arcanists available.</p>
                ) : (
                  <div className="status-effect-editor__relationships">
                    {arcanists.map((arcanist) => (
                      <label className="status-effect-editor__relationship" key={arcanist.id}>
                        <input
                          type="checkbox"
                          name="related-arcanist"
                          value={arcanist.id}
                          checked={relatedArcanists.includes(arcanist.id)}
                          onChange={(): void => toggleArcanist(arcanist.id)}
                        />
                        <span>{arcanist.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              <section
                ref={notesRef}
                className="status-effect-editor__section"
                aria-labelledby="effect-notes-heading"
              >
                <div className="status-effect-editor__section-title">
                  <span>06</span>
                  <div>
                    <h2 id="effect-notes-heading">Personal Notes</h2>
                    <p>Observations, references, and additional findings.</p>
                  </div>
                </div>

                <div className="status-effect-editor__field">
                  <label htmlFor="status-effect-notes">Notes</label>
                  <textarea
                    id="status-effect-notes"
                    name="notes"
                    rows={8}
                    placeholder="Add your personal notes..."
                    value={notes}
                    onChange={(event): void => setNotes(event.target.value)}
                  />
                </div>
              </section>
            </div>

            <span className="status-effects-book__page-number">— 6 —</span>
          </div>
        </div>
      </form>
    </section>
  )
}
