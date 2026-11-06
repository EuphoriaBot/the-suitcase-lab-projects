import { useState, type JSX } from 'react'
import type { DashboardArcanist, DashboardStatusEffect } from '../dashboard/dashboardData'
import './status-effects-book.css'

interface StatusEffectsBookListProps {
  statusEffects: DashboardStatusEffect[]
  arcanists: DashboardArcanist[]
  totalCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
  onOpen: (id: string) => void
  onCreate: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  busy: boolean
}

export default function StatusEffectsBookList({
  statusEffects,
  arcanists,
  totalCount,
  searchQuery,
  onSearchChange,
  onOpen,
  onCreate,
  onEdit,
  onDelete,
  busy
}: StatusEffectsBookListProps): JSX.Element {
  const [previewId, setPreviewId] = useState<string | null>(null)
  const preview = statusEffects.find((item) => item.id === previewId) ?? statusEffects[0]
  const relatedArcanistCount = preview
    ? arcanists.filter(
        (arcanist) =>
          preview.relatedArcanists?.includes(arcanist.id) ||
          arcanist.relatedStatusEffects?.includes(preview.id)
      ).length
    : 0

  return (
    <section className="status-effects-book" aria-label="Status Effects Research Codex">
      <div className="status-effects-book__desk">
        <div className="status-effects-book__spread">
          <div className="status-effects-book__leaf status-effects-book__leaf--left">
            <div className="status-effects-book__heading">
              <div className="status-effects-book__heading-top">
                <span className="status-effects-book__kicker">VOL. II · RESEARCH CODEX</span>
                <button
                  type="button"
                  className="status-effects-book__register"
                  onClick={onCreate}
                  disabled={busy}
                >
                  + Register Status Effect
                </button>
              </div>
              <h1>Status Effects</h1>
              <p>Every phenomenon deserves a record.</p>
            </div>

            <label
              className="status-effects-book__search-label"
              htmlFor="status-effect-book-search"
            >
              SEARCH THE STATUS EFFECTS
            </label>
            <input
              id="status-effect-book-search"
              className="status-effects-book__search"
              type="search"
              placeholder="Search by name, effect, tag..."
              value={searchQuery}
              onChange={(event): void => {
                setPreviewId(null)
                onSearchChange(event.target.value)
              }}
            />

            <div className="status-effects-book__index-heading">
              <span>REGISTERED STATUS EFFECTS</span>
              <span>
                {statusEffects.length} / {totalCount}
              </span>
            </div>

            {statusEffects.length === 0 ? (
              <div className="status-effects-book__empty">
                <span aria-hidden="true">✧</span>
                <strong>No entries found</strong>
                <p>
                  {searchQuery ? 'Try another search term.' : 'Register your first Status Effect.'}
                </p>
              </div>
            ) : (
              <ol className="status-effects-book__index">
                {statusEffects.map((statusEffect, index) => (
                  <li key={statusEffect.id}>
                    <button
                      type="button"
                      className={`status-effects-book__entry ${preview?.id === statusEffect.id ? 'is-selected' : ''}`}
                      onMouseEnter={(): void => setPreviewId(statusEffect.id)}
                      onFocus={(): void => setPreviewId(statusEffect.id)}
                      onClick={(): void => onOpen(statusEffect.id)}
                    >
                      <span className="status-effects-book__entry-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="status-effects-book__entry-info">
                        <strong>{statusEffect.name}</strong>
                        <small>{statusEffect.category || 'Unclassified'}</small>
                      </span>
                      <span className="status-effects-book__entry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <span className="status-effects-book__page-number">— 1 —</span>
          </div>

          <div className="status-effects-book__leaf status-effects-book__leaf--right">
            <div className="status-effects-book__right-header">
              <span className="status-effects-book__kicker">RESEARCH PREVIEW</span>
              <span className="status-effects-book__seal" aria-hidden="true">
                ✧
              </span>
            </div>

            {preview ? (
              <div className="status-effects-book__profile" key={preview.id}>
                <div className="status-effects-book__sigil" aria-hidden="true">
                  <span>✧</span>
                </div>
                <span className="status-effects-book__record-label">
                  OBSERVATION RECORD / {preview.id.slice(0, 8).toUpperCase()}
                </span>
                <h2>{preview.name}</h2>

                <div className="status-effects-book__facts">
                  <div>
                    <span>CATEGORY</span>
                    <strong>{preview.category || 'Unclassified'}</strong>
                  </div>
                  <div>
                    <span>DURATION</span>
                    <strong>{preview.duration || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span>STACKING</span>
                    <strong>{preview.stackable ? 'Stackable' : 'Not Stackable'}</strong>
                  </div>
                  <div>
                    <span>RELATED ARCANISTS</span>
                    <strong>{relatedArcanistCount}</strong>
                  </div>
                </div>

                <div className="status-effects-book__preview-scroll">
                  <div className="status-effects-book__excerpt">
                    <h3>Description</h3>
                    <p>{preview.description?.trim() || 'No description available.'}</p>
                  </div>
                  {preview.effect?.trim() && (
                    <div className="status-effects-book__excerpt">
                      <h3>Effect</h3>
                      <p>{preview.effect}</p>
                    </div>
                  )}
                  {Array.isArray(preview.tags) && preview.tags.length > 0 && (
                    <div className="status-effects-book__tags">
                      {preview.tags.map((tag, index) => (
                        <span key={`${tag}-${index}`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="status-effects-book__actions">
                  <button
                    type="button"
                    className="status-effects-book__read"
                    onClick={(): void => onOpen(preview.id)}
                  >
                    Open Entry ↗
                  </button>
                  <button type="button" onClick={(): void => onEdit(preview.id)} disabled={busy}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="status-effects-book__delete"
                    onClick={(): void => onDelete(preview.id)}
                    disabled={busy}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="status-effects-book__blank-page">
                <span aria-hidden="true">✧</span>
                <h2>Unwritten Pages</h2>
                <p>The codex awaits its next observation.</p>
                <button type="button" onClick={onCreate} disabled={busy}>
                  Register an Effect
                </button>
              </div>
            )}

            <span className="status-effects-book__page-number">— 2 —</span>
          </div>
        </div>
      </div>
    </section>
  )
}
