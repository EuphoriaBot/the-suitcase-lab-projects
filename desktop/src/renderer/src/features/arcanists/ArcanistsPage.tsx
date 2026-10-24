import { useEffect, useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'

import ArcanistCard from './ArcanistCard'
import ArcanistDetail from './ArcanistDetail'
import ArcanistForm from './ArcanistForm'
import DeleteArcanistDialog from './DeleteArcanistDialog'

import { matchesArcanistSearch } from './arcanistSearch'

import { saveArcanist, deleteArcanist, type ArcanistPayload } from './arcanistStorage'

type PageMode = 'list' | 'detail' | 'create' | 'edit'

function ArcanistsPage(): JSX.Element {
  const [data, setData] = useState(getDashboardData)

  const [searchQuery, setSearchQuery] = useState('')

  const [mode, setMode] = useState<PageMode>('list')

  const [selectedArcanistId, setSelectedArcanistId] = useState<string | null>(null)

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [notice, setNotice] = useState('')

  const { arcanists, statusEffects } = data

  const keyword = searchQuery.trim().toLowerCase()

  const filteredArcanists = keyword
    ? arcanists.filter((arcanist) => matchesArcanistSearch(arcanist, keyword))
    : arcanists

  const selectedArcanist = arcanists.find((arcanist) => arcanist.id === selectedArcanistId)

  const arcanistToDelete = arcanists.find((arcanist) => arcanist.id === deleteTargetId)

  // REMOVE SUCCESS NOTIFICATION AFTER 3 SECONDS
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

  // OPEN DETAIL
  function openDetail(id: string): void {
    setSelectedArcanistId(id)
    setMode('detail')
  }

  // OPEN ADD FORM
  function openCreate(): void {
    setSelectedArcanistId(null)
    setMode('create')
  }

  // OPEN EDIT FORM
  function openEdit(id: string): void {
    setSelectedArcanistId(id)
    setMode('edit')
  }

  // SAVE ADD OR EDIT
  function handleSave(payload: ArcanistPayload): void {
    if (mode === 'edit' && !selectedArcanist) {
      throw new Error('Arcanist could not be found.')
    }

    const savedArcanist = saveArcanist(payload, mode === 'edit' ? selectedArcanist?.id : undefined)

    setData(getDashboardData())
    setSelectedArcanistId(savedArcanist.id)
    setMode('detail')
  }

  // CANCEL ADD OR EDIT
  function handleCancel(): void {
    if (mode === 'edit' && selectedArcanist) {
      setMode('detail')
    } else {
      setMode('list')
    }
  }

  function backToList(): void {
    setMode('list')
  }

  // OPEN DELETE CONFIRMATION
  function requestDelete(id: string): void {
    setDeleteError(null)
    setDeleteTargetId(id)
  }

  // CANCEL DELETE
  function cancelDelete(): void {
    setDeleteTargetId(null)
    setDeleteError(null)
  }

  // CONFIRM AND DELETE ARCANIST
  function confirmDelete(): void {
    if (!arcanistToDelete) {
      return
    }

    try {
      deleteArcanist(arcanistToDelete.id)

      // Refresh Arcanists and Status Effects
      setData(getDashboardData())

      setDeleteTargetId(null)
      setDeleteError(null)

      setNotice('Arcanist deleted successfully.')
    } catch (error) {
      console.error('Failed to delete Arcanist:', error)

      setDeleteError(error instanceof Error ? error.message : 'Unable to delete Arcanist.')
    }
  }

  // ADD ARCANIST FORM
  if (mode === 'create') {
    return (
      <ArcanistForm statusEffects={statusEffects} onSave={handleSave} onCancel={handleCancel} />
    )
  }

  // EDIT ARCANIST FORM
  if (mode === 'edit' && selectedArcanist) {
    return (
      <ArcanistForm
        initialArcanist={selectedArcanist}
        statusEffects={statusEffects}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  // DETAIL ARCANIST
  if (mode === 'detail' && selectedArcanist) {
    return (
      <ArcanistDetail
        arcanist={selectedArcanist}
        statusEffects={statusEffects}
        onBack={backToList}
        onEdit={(): void => openEdit(selectedArcanist.id)}
      />
    )
  }

  // ARCANISTS GALLERY
  return (
    <>
      <div className="arcanists-page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">DATABASE</div>

            <h1>Arcanists</h1>

            <p className="page-description">Browse and manage your Reverse: 1999 Arcanist notes.</p>
          </div>

          <button type="button" className="primary-button" onClick={openCreate}>
            + Add Arcanist
          </button>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Arcanists..."
            aria-label="Search Arcanists"
            value={searchQuery}
            onChange={(event): void => setSearchQuery(event.target.value)}
          />
        </div>

        {/* EMPTY STATE OR ARCANIST GALLERY */}
        {filteredArcanists.length === 0 ? (
          <div className="empty-state">
            <h2>No Arcanists Found</h2>

            <p>
              {keyword
                ? 'There are no Arcanists matching your search.'
                : 'No Arcanists have been recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="arcanist-grid">
            {filteredArcanists.map((arcanist) => (
              <ArcanistCard
                key={arcanist.id}
                arcanist={arcanist}
                onOpen={openDetail}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      {arcanistToDelete && (
        <DeleteArcanistDialog
          arcanistName={arcanistToDelete.name}
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

export default ArcanistsPage
