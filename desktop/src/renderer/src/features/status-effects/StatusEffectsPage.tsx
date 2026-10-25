import { useEffect, useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'

import StatusEffectCard from './StatusEffectCard'
import StatusEffectDetail from './StatusEffectDetail'
import StatusEffectForm from './StatusEffectForm'

import { matchesStatusEffectSearch } from './statusEffectSearch'

import { saveStatusEffect, type StatusEffectPayload } from './statusEffectStorage'

type PageMode = 'list' | 'detail' | 'create' | 'edit'

function StatusEffectsPage(): JSX.Element {
  const [data, setData] = useState(getDashboardData)

  const [searchQuery, setSearchQuery] = useState('')

  const [mode, setMode] = useState<PageMode>('list')

  const [selectedStatusEffectId, setSelectedStatusEffectId] = useState<string | null>(null)

  const [notice, setNotice] = useState('')

  const { arcanists, statusEffects } = data

  const keyword = searchQuery.trim()

  const filteredStatusEffects = keyword
    ? statusEffects.filter((statusEffect) => matchesStatusEffectSearch(statusEffect, keyword))
    : statusEffects

  const selectedStatusEffect = statusEffects.find(
    (statusEffect) => statusEffect.id === selectedStatusEffectId
  )

  // HIDE SUCCESS NOTIFICATION AFTER 3 SECONDS
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
    setSelectedStatusEffectId(id)
    setMode('detail')
  }

  // OPEN ADD FORM
  function openCreate(): void {
    setSelectedStatusEffectId(null)
    setMode('create')
  }

  // OPEN EDIT FORM
  function openEdit(): void {
    if (selectedStatusEffect) {
      setMode('edit')
    }
  }

  // SAVE STATUS EFFECT
  function handleSave(payload: StatusEffectPayload): void {
    if (mode === 'edit' && !selectedStatusEffect) {
      throw new Error('Status Effect could not be found.')
    }

    const wasEditing = mode === 'edit'

    const savedStatusEffect = saveStatusEffect(
      payload,
      wasEditing ? selectedStatusEffect?.id : undefined
    )

    // Refresh data after saving.
    setData(getDashboardData())

    setSelectedStatusEffectId(savedStatusEffect.id)

    setMode('detail')

    setNotice(
      wasEditing ? 'Status Effect updated successfully.' : 'Status Effect added successfully.'
    )
  }

  // CANCEL ADD OR EDIT
  function handleCancel(): void {
    if (mode === 'edit' && selectedStatusEffect) {
      setMode('detail')
    } else {
      setMode('list')
    }
  }

  function backToList(): void {
    setMode('list')
  }

  let content: JSX.Element

  // CREATE FORM
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
