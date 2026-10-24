import { useState, type JSX } from 'react'

import { getDashboardData } from '../dashboard/dashboardData'

import ArcanistCard from './ArcanistCard'
import ArcanistDetail from './ArcanistDetail'
import ArcanistForm from './ArcanistForm'

import { matchesArcanistSearch } from './arcanistSearch'

import { saveArcanist, type ArcanistPayload } from './arcanistStorage'

type PageMode = 'list' | 'detail' | 'create' | 'edit'

function ArcanistsPage(): JSX.Element {
  const [data, setData] = useState(getDashboardData)

  const [searchQuery, setSearchQuery] = useState('')

  const [mode, setMode] = useState<PageMode>('list')

  const [selectedArcanistId, setSelectedArcanistId] = useState<string | null>(null)

  const { arcanists, statusEffects } = data

  const keyword = searchQuery.trim().toLowerCase()

  const filteredArcanists = keyword
    ? arcanists.filter((arcanist) => matchesArcanistSearch(arcanist, keyword))
    : arcanists

  const selectedArcanist = arcanists.find((arcanist) => arcanist.id === selectedArcanistId)

  function openDetail(id: string): void {
    setSelectedArcanistId(id)
    setMode('detail')
  }

  function openCreate(): void {
    setSelectedArcanistId(null)
    setMode('create')
  }

  function openEdit(id: string): void {
    setSelectedArcanistId(id)
    setMode('edit')
  }

  function handleSave(payload: ArcanistPayload): void {
    if (mode === 'edit' && !selectedArcanist) {
      throw new Error('Arcanist could not be found.')
    }

    const savedArcanist = saveArcanist(payload, mode === 'edit' ? selectedArcanist?.id : undefined)

    setData(getDashboardData())
    setSelectedArcanistId(savedArcanist.id)
    setMode('detail')
  }

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
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ArcanistsPage
