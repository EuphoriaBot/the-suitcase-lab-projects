import type { JSX } from 'react'
import './timekeeper-room-navigation.css'

export type RoomDestination = 'arcanists' | 'status-effects' | 'database' | 'dashboard'

interface TimekeeperRoomProps {
  onNavigate: (destination: RoomDestination) => void
}

interface RoomObject {
  id: RoomDestination
  position: string
  title: string
  description: string
}

const roomObjects: RoomObject[] = [
  {
    id: 'arcanists',
    position: 'arcanists',
    title: 'Arcanists',
    description: 'View and manage Arcanist dossiers.'
  },
  {
    id: 'status-effects',
    position: 'effects',
    title: 'Status Effects',
    description: 'Research and record effects observed in battle.'
  },
  {
    id: 'database',
    position: 'database',
    title: 'Database',
    description: 'Manage data, backup, and restore your archive.'
  },
  {
    id: 'dashboard',
    position: 'chronicle',
    title: 'The Chronicle',
    description: 'Review recent records and personal notes.'
  }
]

export default function TimekeeperRoom({ onNavigate }: TimekeeperRoomProps): JSX.Element {
  return (
    <main className="timekeeper-room" aria-label="The Timekeeper's Room">
      <div className="timekeeper-room__canvas">
        <nav className="timekeeper-room__objects" aria-label="Archive navigation">
          {roomObjects.map((object) => (
            <button
              key={object.id}
              type="button"
              className={`timekeeper-room__object timekeeper-room__object--${object.position}`}
              onClick={(): void => onNavigate(object.id)}
              aria-label={`Open ${object.title}`}
              title={`Open ${object.title}`}
            >
              <span className="timekeeper-room__object-copy">
                <span className="timekeeper-room__object-title">{object.title}</span>
                <span className="timekeeper-room__object-description">{object.description}</span>
              </span>
              <span className="timekeeper-room__object-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </nav>
      </div>
    </main>
  )
}
