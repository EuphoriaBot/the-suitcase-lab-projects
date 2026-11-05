import { useEffect, useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'
import { saveArcanist, deleteArcanist, type ArcanistPayload } from './arcanistStorage'
import { matchesArcanistSearch } from './arcanistSearch'

import ArcanistsBookList from './ArcanistsBookList'
import ArcanistDetail from './ArcanistDetail'
import ArcanistForm from './ArcanistForm'
import DeleteArcanistDialog from './DeleteArcanistDialog'

interface ArcanistsPageProps {
  onRefresh: () => Promise<void>
}

type PageMode = 'list' | 'detail' | 'create' | 'edit'

function ArcanistsPage({ onRefresh }: ArcanistsPageProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<PageMode>('list')
  const [selectedArcanistId, setSelectedArcanistId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const { arcanists, statusEffects } = getDashboardData()

  const keyword = searchQuery.trim().toLowerCase()

  const filteredArcanists = keyword
    ? arcanists.filter((arcanist) => matchesArcanistSearch(arcanist, keyword))
    : arcanists

  const selectedArcanist = arcanists.find((arcanist) => arcanist.id === selectedArcanistId)

  const arcanistToDelete = arcanists.find((arcanist) => arcanist.id === deleteTargetId)

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
    setSelectedArcanistId(id)
    setMode('detail')
  }

  function openCreate(): void {
    setFormError('')
    setSelectedArcanistId(null)
    setMode('create')
  }

  function openEdit(id: string): void {
    setFormError('')
    setSelectedArcanistId(id)
    setMode('edit')
  }

  function backToList(): void {
    setMode('list')
  }

  function handleCancel(): void {
    if (busy) {
      return
    }

    setFormError('')

    if (mode === 'edit' && selectedArcanist) {
      setMode('detail')
    } else {
      setMode('list')
    }
  }

  function handleSave(payload: ArcanistPayload): void {
    if (busy) {
      return
    }

    const wasEditing = mode === 'edit'

    if (wasEditing && !selectedArcanist) {
      setFormError('Arcanist could not be found.')
      return
    }

    setBusy(true)
    setFormError('')

    void saveArcanist(payload, wasEditing ? selectedArcanist?.id : undefined)
      .then(async (savedId): Promise<void> => {
        await onRefresh()

        setSelectedArcanistId(savedId)
        setMode('detail')

        setNotice(wasEditing ? 'Arcanist updated successfully.' : 'Arcanist added successfully.')
      })
      .catch((error: unknown): void => {
        setFormError(error instanceof Error ? error.message : 'Unable to save Arcanist.')
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
    if (!arcanistToDelete || busy) {
      return
    }

    setBusy(true)
    setDeleteError('')

    void deleteArcanist(arcanistToDelete.id)
      .then(async (): Promise<void> => {
        await onRefresh()

        setDeleteTargetId(null)
        setSelectedArcanistId(null)
        setMode('list')
        setNotice('Arcanist deleted successfully.')
      })
      .catch((error: unknown): void => {
        setDeleteError(error instanceof Error ? error.message : 'Unable to delete Arcanist.')
      })
      .finally((): void => {
        setBusy(false)
      })
  }

  let content: JSX.Element

  if (mode === 'create' || (mode === 'edit' && selectedArcanist)) {
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
          <ArcanistForm
            initialArcanist={mode === 'edit' ? selectedArcanist : undefined}
            statusEffects={statusEffects}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </fieldset>
      </>
    )
  } else if (mode === 'detail' && selectedArcanist) {
    content = (
      <ArcanistDetail
        arcanist={selectedArcanist}
        statusEffects={statusEffects}
        onBack={backToList}
        onEdit={(): void => openEdit(selectedArcanist.id)}
      />
    )
  } else {
    content = (
      <ArcanistsBookList
        arcanists={filteredArcanists}
        totalCount={arcanists.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpen={openDetail}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={requestDelete}
        busy={busy}
      />
    )
  }

  return (
    <>
      {content}

      {arcanistToDelete && (
        <DeleteArcanistDialog
          arcanistName={arcanistToDelete.name}
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

export default ArcanistsPage
