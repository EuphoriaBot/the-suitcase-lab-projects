import { useState, type FormEvent, type JSX } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

import type { StatusEffectPayload } from './statusEffectStorage'

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

function StatusEffectForm({
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

  function toggleArcanist(id: string): void {
    setRelatedArcanists((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    )
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
    <div className="form-page">
      {/* FORM INTRO */}
      <div className="form-intro">
        <div className="form-eyebrow">STATUS EFFECT NOTES</div>

        <h1>{isEditing ? 'Edit Status Effect' : 'Add Status Effect'}</h1>

        <p>
          {isEditing
            ? 'Update this status effect information.'
            : 'Record a Reverse: 1999 status effect.'}
        </p>
      </div>

      <form className="app-form" onSubmit={handleSubmit}>
        {/* BASIC INFORMATION */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Basic Information</h2>

            <p>Core information about this status effect.</p>
          </div>

          {/* NAME */}
          <div className="form-group">
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

          {/* DESCRIPTION */}
          <div className="form-group">
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

          {/* EFFECT */}
          <div className="form-group">
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

          {/* DURATION AND STACKING */}
          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="status-effect-stackable">Stacking</label>

              <label className="checkbox-label">
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
          </div>
        </section>

        {/* RELATED ARCANISTS */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Related Arcanists</h2>

            <p>Select the Arcanists associated with this status effect.</p>
          </div>

          <div className="relationship-list">
            {arcanists.length === 0 ? (
              <p className="detail-empty">No Arcanists available.</p>
            ) : (
              arcanists.map((arcanist) => (
                <label className="relationship-item" key={arcanist.id}>
                  <input
                    type="checkbox"
                    className="relationship-checkbox"
                    name="related-arcanist"
                    value={arcanist.id}
                    checked={relatedArcanists.includes(arcanist.id)}
                    onChange={(): void => toggleArcanist(arcanist.id)}
                  />

                  <span>{arcanist.name}</span>
                </label>
              ))
            )}
          </div>
        </section>

        {/* ADDITIONAL INFORMATION */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Additional Information</h2>

            <p>Add tags and personal notes.</p>
          </div>

          {/* TAGS */}
          <div className="form-group">
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

          {/* NOTES */}
          <div className="form-group">
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

        {/* ERROR MESSAGE */}
        {error && (
          <p
            role="alert"
            style={{
              color: '#C98688',
              marginBottom: '12px'
            }}
          >
            {error}
          </p>
        )}

        {/* FORM ACTIONS */}
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit" className="primary-button">
            {isEditing ? 'Save Changes' : 'Save Status Effect'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StatusEffectForm
