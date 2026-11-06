import { useState, type JSX, type FormEvent } from 'react'

import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'

import type { ArcanistPayload } from './arcanistStorage'
import { getImageUrl } from './arcanistImage'

interface ArcanistFormProps {
  initialArcanist?: DashboardArcanist
  statusEffects: DashboardStatusEffect[]
  onSave: (payload: ArcanistPayload) => void
  onCancel: () => void
}

interface SkillRow {
  id: string
  name: string
  type: string
  description: string
}

interface PortrayRow {
  id: string
  level: string
  description: string
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>
  }

  return {}
}

function text(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function ArcanistForm({
  initialArcanist,
  statusEffects,
  onSave,
  onCancel
}: ArcanistFormProps): JSX.Element {
  const isEditing = Boolean(initialArcanist)

  const [fields, setFields] = useState({
    name: initialArcanist?.name ?? '',
    image: initialArcanist?.image ?? '',
    afflatus: initialArcanist?.afflatus ?? '',
    damageType: initialArcanist?.damageType ?? '',
    roles: (initialArcanist?.roles ?? []).join(', '),
    mechanics: initialArcanist?.mechanics ?? '',
    tags: (initialArcanist?.tags ?? []).join(', '),
    notes: initialArcanist?.notes ?? ''
  })

  const [skills, setSkills] = useState<SkillRow[]>(() =>
    (initialArcanist?.skills ?? []).map((item) => {
      const skill = toRecord(item)

      return {
        id: crypto.randomUUID(),
        name: text(skill.name),
        type: text(skill.type),
        description: text(skill.description)
      }
    })
  )

  const [portray, setPortray] = useState<PortrayRow[]>(() =>
    (initialArcanist?.portray ?? []).map((item) => {
      const entry = toRecord(item)

      return {
        id: crypto.randomUUID(),
        level: text(entry.level),
        description: text(entry.description)
      }
    })
  )

  const [relatedStatusEffects, setRelatedStatusEffects] = useState<string[]>(
    initialArcanist?.relatedStatusEffects ?? []
  )

  const [error, setError] = useState('')

  function updateField(key: keyof typeof fields, value: string): void {
    setFields((previous) => ({
      ...previous,
      [key]: value
    }))
  }

  function addSkill(): void {
    setSkills((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: '',
        type: '',
        description: ''
      }
    ])
  }

  function updateSkill(id: string, key: 'name' | 'type' | 'description', value: string): void {
    setSkills((previous) =>
      previous.map((skill) => (skill.id === id ? { ...skill, [key]: value } : skill))
    )
  }

  function removeSkill(id: string): void {
    setSkills((previous) => previous.filter((skill) => skill.id !== id))
  }

  function addPortray(): void {
    setPortray((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        level: '',
        description: ''
      }
    ])
  }

  function updatePortray(id: string, key: 'level' | 'description', value: string): void {
    setPortray((previous) =>
      previous.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry))
    )
  }

  function removePortray(id: string): void {
    setPortray((previous) => previous.filter((entry) => entry.id !== id))
  }

  function toggleStatusEffect(id: string): void {
    setRelatedStatusEffects((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setError('')

    if (!fields.name.trim()) {
      setError('Arcanist name is required.')
      return
    }

    const payload: ArcanistPayload = {
      name: fields.name.trim(),
      image: fields.image.trim(),
      afflatus: fields.afflatus.trim(),
      damageType: fields.damageType.trim(),
      roles: parseList(fields.roles),
      mechanics: fields.mechanics.trim(),
      tags: parseList(fields.tags),
      notes: fields.notes.trim(),
      relatedStatusEffects,
      skills: skills
        .map(({ name, type, description }) => ({
          name: name.trim(),
          type: type.trim(),
          description: description.trim()
        }))
        .filter((skill) => skill.name || skill.type || skill.description),
      portray: portray
        .map(({ level, description }) => ({
          level: level.trim() ? Number(level) : null,
          description: description.trim()
        }))
        .filter((entry) => entry.level !== null || entry.description)
    }

    try {
      onSave(payload)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save Arcanist.')
    }
  }

  const previewUrl = getImageUrl(fields.image)

  return (
    <div className="form-page">
      <div className="form-intro">
        <div className="form-eyebrow">ARCANIST NOTES</div>

        <h1>{isEditing ? 'Edit Arcanist' : 'Add Arcanist'}</h1>

        <p>
          {isEditing
            ? "Update this Arcanist's information and notes."
            : 'Record information about a Reverse: 1999 Arcanist.'}
        </p>
      </div>

      <form className="app-form" onSubmit={handleSubmit}>
        {/* BASIC INFORMATION */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Basic Information</h2>
            <p>Core information about this Arcanist.</p>
          </div>

          <div className="form-group">
            <label htmlFor="arcanist-name">Name</label>
            <input
              id="arcanist-name"
              type="text"
              placeholder="e.g. Lucy"
              required
              value={fields.name}
              onChange={(event): void => updateField('name', event.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="arcanist-afflatus">Afflatus</label>
              <input
                id="arcanist-afflatus"
                type="text"
                placeholder="e.g. Star"
                value={fields.afflatus}
                onChange={(event): void => updateField('afflatus', event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="arcanist-damage">Damage Type</label>
              <input
                id="arcanist-damage"
                type="text"
                placeholder="e.g. Reality"
                value={fields.damageType}
                onChange={(event): void => updateField('damageType', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="arcanist-roles">Roles</label>
            <input
              id="arcanist-roles"
              type="text"
              placeholder="e.g. DPS, Support, Control"
              value={fields.roles}
              onChange={(event): void => updateField('roles', event.target.value)}
            />
            <small>Separate multiple roles with commas.</small>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Appearance</h2>
            <p>Add the character image used in the Arcanist gallery and detail page.</p>
          </div>

          <div className="form-group">
            <label htmlFor="arcanist-image">Image Path</label>
            <input
              id="arcanist-image"
              type="text"
              placeholder="e.g. assets/arcanist/lucy_card.webp"
              value={fields.image}
              onChange={(event): void => updateField('image', event.target.value)}
            />
            <small>Use an image already included in src/renderer/src/assets/arcanist.</small>
          </div>

          <div className="arcanist-form-image-preview">
            {previewUrl ? (
              <img
                className="arcanist-form-preview-image"
                src={previewUrl}
                alt={fields.name || 'Arcanist preview'}
              />
            ) : (
              <div className="arcanist-form-preview-empty">
                <span>No image preview</span>
              </div>
            )}
          </div>
        </section>

        {/* SKILLS */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Skills</h2>
            <p>Record the Arcanist&apos;s skills and abilities.</p>
          </div>

          <div className="repeatable-list">
            {skills.map((skill, index) => (
              <div className="repeatable-item skill-form-item" key={skill.id}>
                <div className="repeatable-item-header">
                  <div className="repeatable-item-title">
                    <span className="repeatable-item-index">{index + 1}</span>
                    <strong>Skill</strong>
                  </div>

                  <button
                    type="button"
                    className="danger-button remove-item-button"
                    onClick={(): void => removeSkill(skill.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`skill-name-${skill.id}`}>Name</label>
                    <input
                      id={`skill-name-${skill.id}`}
                      type="text"
                      placeholder="e.g. Reality Storm"
                      value={skill.name}
                      onChange={(event): void => updateSkill(skill.id, 'name', event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`skill-type-${skill.id}`}>Type</label>
                    <input
                      id={`skill-type-${skill.id}`}
                      type="text"
                      placeholder="e.g. Attack"
                      value={skill.type}
                      onChange={(event): void => updateSkill(skill.id, 'type', event.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`skill-desc-${skill.id}`}>Description</label>
                  <textarea
                    id={`skill-desc-${skill.id}`}
                    rows={5}
                    placeholder="Describe what the skill does..."
                    value={skill.description}
                    onChange={(event): void =>
                      updateSkill(skill.id, 'description', event.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="secondary-button add-item-button" onClick={addSkill}>
            + Add Skill
          </button>
        </section>

        {/* PORTRAY */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Portray</h2>
            <p>Record each Portray effect individually.</p>
          </div>

          <div className="repeatable-list">
            {portray.map((entry, index) => (
              <div className="repeatable-item portray-form-item" key={entry.id}>
                <div className="repeatable-item-header">
                  <div className="repeatable-item-title">
                    <span className="repeatable-item-index">{index + 1}</span>
                    <strong>Portray</strong>
                  </div>

                  <button
                    type="button"
                    className="danger-button remove-item-button"
                    onClick={(): void => removePortray(entry.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor={`portray-level-${entry.id}`}>Level</label>
                  <input
                    id={`portray-level-${entry.id}`}
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    value={entry.level}
                    onChange={(event): void => updatePortray(entry.id, 'level', event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`portray-desc-${entry.id}`}>Description</label>
                  <textarea
                    id={`portray-desc-${entry.id}`}
                    rows={5}
                    placeholder="Describe the Portray effect..."
                    value={entry.description}
                    onChange={(event): void =>
                      updatePortray(entry.id, 'description', event.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="secondary-button add-item-button" onClick={addPortray}>
            + Add Portray
          </button>
        </section>

        {/* MECHANICS */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Mechanics</h2>
            <p>Record important mechanics specific to this Arcanist.</p>
          </div>

          <div className="form-group">
            <label htmlFor="arcanist-mechanics">Mechanics Notes</label>
            <textarea
              id="arcanist-mechanics"
              rows={8}
              placeholder="Record mechanics, interactions, and behavior..."
              value={fields.mechanics}
              onChange={(event): void => updateField('mechanics', event.target.value)}
            />
          </div>
        </section>

        {/* RELATED STATUS EFFECTS */}
        <section className="form-section">
          <div className="form-section-heading">
            <h2>Related Status Effects</h2>
            <p>Select status effects associated with this Arcanist.</p>
          </div>

          <div className="relationship-list">
            {statusEffects.length === 0 ? (
              <p className="detail-empty">No Status Effects available.</p>
            ) : (
              statusEffects.map((effect) => (
                <label className="relationship-item" key={effect.id}>
                  <input
                    type="checkbox"
                    className="relationship-checkbox"
                    checked={relatedStatusEffects.includes(effect.id)}
                    onChange={(): void => toggleStatusEffect(effect.id)}
                  />
                  <span>{effect.name}</span>
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

          <div className="form-group">
            <label htmlFor="arcanist-tags">Tags</label>
            <input
              id="arcanist-tags"
              type="text"
              placeholder="e.g. Follow-up, Burn, Control"
              value={fields.tags}
              onChange={(event): void => updateField('tags', event.target.value)}
            />
            <small>Separate multiple tags with commas.</small>
          </div>

          <div className="form-group">
            <label htmlFor="arcanist-notes">Notes</label>
            <textarea
              id="arcanist-notes"
              rows={8}
              placeholder="Add your personal notes..."
              value={fields.notes}
              onChange={(event): void => updateField('notes', event.target.value)}
            />
          </div>
        </section>

        {error && (
          <p role="alert" style={{ color: '#E6A0A0' }}>
            {error}
          </p>
        )}

        {/* FORM ACTIONS */}
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit" className="primary-button">
            {isEditing ? 'Save Changes' : 'Save Arcanist'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ArcanistForm
