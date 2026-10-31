import { useEffect, useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'
import {
  saveStatusEffect,
  deleteStatusEffect,
  type StatusEffectPayload
} from './statusEffectStorage'
import { matchesStatusEffectSearch } from './statusEffectSearch'

import StatusEffectCard from './StatusEffectCard'
import StatusEffectDetail from './StatusEffectDetail'
import StatusEffectForm from './StatusEffectForm'
import DeleteStatusEffectDialog from './DeleteStatusEffectDialog'

interface StatusEffectsPageProps {
  onRefresh: () => Promise<void>
}

type PageMode = 'list' | 'detail' | 'create' | 'edit'

function StatusEffectsPage({ onRefresh }: StatusEffectsPageProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<PageMode>('list')
  const [selectedStatusEffectId, setSelectedStatusEffectId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const { arcanists, statusEffects } = getDashboardData()

  const keyword = searchQuery.trim()

  const filteredStatusEffects = keyword
    ? statusEffects.filter((item) => matchesStatusEffectSearch(item, keyword))
    : statusEffects

  const selectedStatusEffect = statusEffects.find((item) => item.id === selectedStatusEffectId)

  const statusEffectToDelete = statusEffects.find((item) => item.id === deleteTargetId)

  useEffect(() => {
    if (!notice) {
      return
    }

    const timeoutId = window.setTimeout((): void => {
      setNotice('')
    }, 3000)

    return (): void => {
      window.clearTimeout(timeoutId)
    }
  }, [notice])

  function openDetail(id: string): void {
    setSelectedStatusEffectId(id)
    setMode('detail')
  }

  function openCreate(): void {
    setFormError('')
    setSelectedStatusEffectId(null)
    setMode('create')
  }

  function openEdit(): void {
    if (selectedStatusEffect) {
      setFormError('')
      setMode('edit')
    }
  }

  function backToList(): void {
    setMode('list')
  }

  function handleCancel(): void {
    if (busy) {
      return
    }

    setFormError('')

    if (mode === 'edit' && selectedStatusEffect) {
      setMode('detail')
    } else {
      setMode('list')
    }
  }

  function handleSave(payload: StatusEffectPayload): void {
    if (busy) {
      return
    }

    const wasEditing = mode === 'edit'

    if (wasEditing && !selectedStatusEffect) {
      setFormError('Status Effect could not be found.')
      return
    }

    setBusy(true)
    setFormError('')

    void saveStatusEffect(payload, wasEditing ? selectedStatusEffect?.id : undefined)
      .then(async (savedId): Promise<void> => {
        await onRefresh()

        setSelectedStatusEffectId(savedId)
        setMode('detail')

        setNotice(
          wasEditing ? 'Status Effect updated successfully.' : 'Status Effect added successfully.'
        )
      })
      .catch((error: unknown): void => {
        setFormError(error instanceof Error ? error.message : 'Unable to save Status Effect.')
      })
      .finally((): void => {
        setBusy(false)
      })
  }

  function requestDelete(id: string): void {
    if (busy) {
      return
    }

    setDeleteError('')
    setDeleteTargetId(id)
  }

  function cancelDelete(): void {
    if (busy) {
      return
    }

    setDeleteTargetId(null)
    setDeleteError('')
  }

  function confirmDelete(): void {
    if (!statusEffectToDelete || busy) {
      return
    }

    setBusy(true)
    setDeleteError('')

    void deleteStatusEffect(statusEffectToDelete.id)
      .then(async (): Promise<void> => {
        await onRefresh()

        setDeleteTargetId(null)
        setSelectedStatusEffectId(null)
        setMode('list')

        setNotice('Status Effect deleted successfully.')
      })
      .catch((error: unknown): void => {
        setDeleteError(error instanceof Error ? error.message : 'Unable to delete Status Effect.')
      })
      .finally((): void => {
        setBusy(false)
      })
  }

  let content: JSX.Element

  if (mode === 'create' || (mode === 'edit' && selectedStatusEffect)) {
    content = (
      <>
        {formError && (
          <p role="alert" style={{ color: '#E6A0A0' }}>
            {formError}
          </p>
        )}

        <fieldset
          disabled={busy}
          style={{ border: 0, padding: 0, margin: 0, width: '100%', minWidth: 0 }}
        >
          <StatusEffectForm
            initialStatusEffect={mode === 'edit' ? selectedStatusEffect : undefined}
            arcanists={arcanists}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </fieldset>
      </>
    )
  } else if (mode === 'detail' && selectedStatusEffect) {
    content = (
      <StatusEffectDetail
        statusEffect={selectedStatusEffect}
        arcanists={arcanists}
        onBack={backToList}
        onEdit={openEdit}
      />
    )
  } else {
    content = (
      <div className="status-effects-page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">STATUS EFFECT ARCHIVE</div>

            <p className="page-description">Record and review your Reverse: 1999 Status Effects.</p>
          </div>

          <button type="button" className="primary-button" disabled={busy} onClick={openCreate}>
            + Add Status Effect
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, effect, tag..."
            aria-label="Search Status Effects"
            value={searchQuery}
            onChange={(event): void => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="status-effect-list">
          {filteredStatusEffects.length === 0 ? (
            <div className="empty-state">
              <h2>No Status Effects Found</h2>

              <p>
                {keyword
                  ? 'There are no Status Effects matching your search.'
                  : 'No Status Effects have been recorded yet.'}
              </p>
            </div>
          ) : (
            filteredStatusEffects.map((statusEffect) => (
              <StatusEffectCard
                key={statusEffect.id}
                statusEffect={statusEffect}
                arcanists={arcanists}
                onOpen={openDetail}
                onDelete={requestDelete}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {content}

      {statusEffectToDelete && (
        <DeleteStatusEffectDialog
          statusEffectName={statusEffectToDelete.name}
          error={deleteError || null}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      {notice && (
        <div className="toast toast-success show" role="status" aria-live="polite">
          <span className="toast-icon" aria-hidden="true">
            ✓
          </span>
          <span className="toast-message">{notice}</span>
        </div>
      )}
    </>
  )
}

export default StatusEffectsPage
