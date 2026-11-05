import { useState, type JSX } from 'react'
import type { DashboardArcanist } from '../dashboard/dashboardData'
import { getImageUrl, getInitials } from './arcanistImage'
import './arcanists-book.css'

interface ArcanistsBookListProps {
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

function BookPortrait({ arcanist }: { arcanist: DashboardArcanist }): JSX.Element {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getImageUrl(arcanist.image)

  return (
    <div className="arcanists-book__portrait">
      {imageUrl && !imageError ? (
        <img src={imageUrl} alt={arcanist.name} onError={(): void => setImageError(true)} />
      ) : (
        <span className="arcanists-book__monogram">{getInitials(arcanist.name)}</span>
      )}
    </div>
  )
}

export default function ArcanistsBookList({
  arcanists,
  totalCount,
  searchQuery,
  onSearchChange,
  onOpen,
  onCreate,
  onEdit,
  onDelete,
  busy
}: ArcanistsBookListProps): JSX.Element {
  const [previewId, setPreviewId] = useState<string | null>(null)

  const preview = arcanists.find((arcanist) => arcanist.id === previewId) ?? arcanists[0]

  return (
    <section className="arcanists-book" aria-label="Arcanist Archive">
      <div className="arcanists-book__desk">
        <div className="arcanists-book__spread">
          <div className="arcanists-book__leaf arcanists-book__leaf--left">
            <div className="arcanists-book__heading">
              <div className="arcanists-book__heading-top">
                <span className="arcanists-book__kicker">VOL. I · PERSONNEL REGISTER</span>
                <button
                  type="button"
                  className="arcanists-book__register"
                  onClick={onCreate}
                  disabled={busy}
                >
                  + Register Arcanist
                </button>
              </div>
              <h1>Arcanist</h1>
              <p>Every name leaves a trace in the archive.</p>
            </div>

            <label className="arcanists-book__search-label" htmlFor="arcanist-book-search">
              SEARCH THE ARCANIST
            </label>

            <input
              id="arcanist-book-search"
              className="arcanists-book__search"
              type="search"
              placeholder="Search by name, Afflatus, or role..."
              value={searchQuery}
              onChange={(event): void => {
                setPreviewId(null)
                onSearchChange(event.target.value)
              }}
            />

            <div className="arcanists-book__index-heading">
              <span>REGISTERED ARCANIST</span>
              <span>
                {arcanists.length} / {totalCount}
              </span>
            </div>

            {arcanists.length === 0 ? (
              <div className="arcanists-book__empty">
                <span aria-hidden="true">✧</span>
                <strong>No entries found</strong>
                <p>{searchQuery ? 'Try another search term.' : 'Register your first Arcanist.'}</p>
              </div>
            ) : (
              <ol className="arcanists-book__index">
                {arcanists.map((arcanist, index) => (
                  <li key={arcanist.id}>
                    <button
                      type="button"
                      className={`arcanists-book__entry ${preview?.id === arcanist.id ? 'is-selected' : ''}`}
                      onMouseEnter={(): void => setPreviewId(arcanist.id)}
                      onFocus={(): void => setPreviewId(arcanist.id)}
                      onClick={(): void => onOpen(arcanist.id)}
                    >
                      <span className="arcanists-book__entry-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="arcanists-book__entry-info">
                        <strong>{arcanist.name}</strong>
                        <small>{arcanist.afflatus || 'Unknown Afflatus'}</small>
                      </span>

                      <span className="arcanists-book__entry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <span className="arcanists-book__page-number">— 1 —</span>
          </div>

          <div className="arcanists-book__leaf arcanists-book__leaf--right">
            <div className="arcanists-book__right-header">
              <span className="arcanists-book__kicker">ARCHIVE PREVIEW</span>
              <span className="arcanists-book__seal" aria-hidden="true">
                ✧
              </span>
            </div>

            {preview ? (
              <div className="arcanists-book__profile" key={preview.id}>
                <BookPortrait arcanist={preview} />

                <span className="arcanists-book__record-label">
                  PERSONNEL DOSSIER / {preview.id.slice(0, 8).toUpperCase()}
                </span>

                <h2>{preview.name}</h2>

                <div className="arcanists-book__facts">
                  <div>
                    <span>AFFLATUS</span>
                    <strong>{preview.afflatus || 'Unknown'}</strong>
                  </div>

                  <div>
                    <span>DAMAGE TYPE</span>
                    <strong>{preview.damageType || 'Unknown'}</strong>
                  </div>
                </div>

                {preview.roles && preview.roles.length > 0 && (
                  <div className="arcanists-book__roles">
                    {preview.roles.map((role, index) => (
                      <span key={`${role}-${index}`}>{role}</span>
                    ))}
                  </div>
                )}

                <div className="arcanists-book__actions">
                  <button
                    type="button"
                    className="arcanists-book__read"
                    onClick={(): void => onOpen(preview.id)}
                  >
                    Open Dossier ↗
                  </button>

                  <button type="button" onClick={(): void => onEdit(preview.id)} disabled={busy}>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="arcanists-book__delete"
                    onClick={(): void => onDelete(preview.id)}
                    disabled={busy}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="arcanists-book__blank-page">
                <span aria-hidden="true">✧</span>
                <h2>Unwritten Pages</h2>
                <p>The archive awaits its next story.</p>
                <button type="button" onClick={onCreate} disabled={busy}>
                  Register a Character
                </button>
              </div>
            )}

            <span className="arcanists-book__page-number">— 2 —</span>
          </div>
        </div>
      </div>
    </section>
  )
}
