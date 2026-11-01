import type { JSX } from 'react'

export type RoomDestination = 'arcanists' | 'status-effects' | 'database' | 'dashboard'

interface TimekeeperRoomProps {
  onNavigate: (destination: RoomDestination) => void
}

interface RoomObject {
  id: RoomDestination
  label: string
  position: string
}

const roomObjects: RoomObject[] = [
  {
    id: 'arcanists',
    label: 'Open Arcanists',
    position: 'arcanists'
  },
  {
    id: 'status-effects',
    label: 'Open Status Effects',
    position: 'effects'
  },
  {
    id: 'database',
    label: 'Open Database',
    position: 'database'
  },
  {
    id: 'dashboard',
    label: 'Open The Chronicle',
    position: 'chronicle'
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
              aria-label={object.label}
              title={object.label}
            />
          ))}
        </nav>
      </div>
    </main>
  )
}
