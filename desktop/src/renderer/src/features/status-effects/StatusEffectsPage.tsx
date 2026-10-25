import { useEffect, useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'

import StatusEffectCard from './StatusEffectCard'
import StatusEffectDetail from './StatusEffectDetail'
import StatusEffectForm from './StatusEffectForm'
import DeleteStatusEffectDialog from './DeleteStatusEffectDialog'

import { matchesStatusEffectSearch } from './statusEffectSearch'

import {
  saveStatusEffect,
  deleteStatusEffect,
  type StatusEffectPayload
} from './statusEffectStorage'

type PageMode = 'list' | 'detail' | 'create' | 'edit'

function StatusEffectsPage(): JSX.Element {
  const [data, setData] = useState(getDashboardData)

  const [searchQuery, setSearchQuery] = useState('')

  const [mode, setMode] = useState<PageMode>('list')

  const [selectedStatusEffectId, setSelectedStatusEffectId] = useState<string | null>(null)

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [notice, setNotice] = useState('')

  const { arcanists, statusEffects } = data

  const keyword = searchQuery.trim()

  const filteredStatusEffects = keyword
    ? statusEffects.filter((statusEffect) => matchesStatusEffectSearch(statusEffect, keyword))
    : statusEffects

  const selectedStatusEffect = statusEffects.find(
    (statusEffect) => statusEffect.id === selectedStatusEffectId
  )

  const statusEffectToDelete = statusEffects.find(
    (statusEffect) => statusEffect.id === deleteTargetId
  )

  // ==========================================
  // SUCCESS NOTIFICATION
  // ==========================================

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

  // ==========================================
  // NAVIGATION
  // ==========================================

  function openDetail(id: string): void {
    setSelectedStatusEffectId(id)
    setMode('detail')
  }

  function openCreate(): void {
    setSelectedStatusEffectId(null)
    setMode('create')
  }

  function openEdit(): void {
    if (selectedStatusEffect) {
      setMode('edit')
    }
  }

  function backToList(): void {
    setMode('list')
  }

  // ==========================================
  // ADD AND EDIT
  // ==========================================

  function handleSave(payload: StatusEffectPayload): void {
    if (mode === 'edit' && !selectedStatusEffect) {
      throw new Error('Status Effect could not be found.')
    }

    const wasEditing = mode === 'edit'

    const savedStatusEffect = saveStatusEffect(
      payload,
      wasEditing ? selectedStatusEffect?.id : undefined
    )

    setData(getDashboardData())

    setSelectedStatusEffectId(savedStatusEffect.id)

    setMode('detail')

    setNotice(
      wasEditing ? 'Status Effect updated successfully.' : 'Status Effect added successfully.'
    )
  }

  function handleCancel(): void {
    if (mode === 'edit' && selectedStatusEffect) {
      setMode('detail')
    } else {
      setMode('list')
    }
  }

  // ==========================================
  // DELETE STATUS EFFECT
  // ==========================================

  function requestDelete(id: string): void {
    setDeleteError(null)
    setDeleteTargetId(id)
  }

  function cancelDelete(): void {
    setDeleteTargetId(null)
    setDeleteError(null)
  }

  function confirmDelete(): void {
    if (!statusEffectToDelete) {
      return
    }

    const deletedId = statusEffectToDelete.id

    try {
      // Delete Status Effect and clean related Arcanists.
      deleteStatusEffect(deletedId)

      // Refresh data after deletion.
      setData(getDashboardData())

      // Clear selection if it references the deleted item.
      if (selectedStatusEffectId === deletedId) {
        setSelectedStatusEffectId(null)
      }

      // Close the confirmation dialog.
      setDeleteTargetId(null)
      setDeleteError(null)

      // Return to the list.
      setMode('list')

      // Display success message.
      setNotice('Status Effect deleted successfully.')
    } catch (error) {
      console.error('Failed to delete Status Effect:', error)

      setDeleteError(error instanceof Error ? error.message : 'Unable to delete Status Effect.')
    }
  }

  // ==========================================
  // PAGE CONTENT
  // ==========================================

  let content: JSX.Element

  // ADD FORM
  if (mode === 'create') {
    content = <StatusEffectForm arcanists={arcanists} onSave={handleSave} onCancel={handleCancel} />
  }

  // EDIT FORM
  else if (mode === 'edit' && selectedStatusEffect) {
    content = (
      <StatusEffectForm
        initialStatusEffect={selectedStatusEffect}
        arcanists={arcanists}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  // DETAIL PAGE
  else if (mode === 'detail' && selectedStatusEffect) {
    content = (
      <StatusEffectDetail
        statusEffect={selectedStatusEffect}
        arcanists={arcanists}
        onBack={backToList}
        onEdit={openEdit}
      />
    )
  }

  // STATUS EFFECT LIST
  else {
    content = (
      <div className="status-effects-page">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div>
            <div className="page-eyebrow">DATABASE</div>

            <h1>Status Effects</h1>

            <p className="page-description">Record and review your Reverse: 1999 Status Effects.</p>
          </div>

          <button type="button" className="primary-button" onClick={openCreate}>
            + Add Status Effect
          </button>
        </div>

        {/* SEARCH */}
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

        {/* STATUS EFFECT LIST */}
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

  // ==========================================
  // FINAL RENDER
  // ==========================================

  return (
    <>
      {content}

      {/* DELETE CONFIRMATION */}
      {statusEffectToDelete && (
        <DeleteStatusEffectDialog
          statusEffectName={statusEffectToDelete.name}
          error={deleteError}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      {/* SUCCESS NOTIFICATION */}
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
