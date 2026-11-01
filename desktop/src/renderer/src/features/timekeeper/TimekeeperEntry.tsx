import { useState, type JSX } from 'react'
import App from '../../App'
import TimekeeperRoom, { type RoomDestination } from './TimekeeperRoom'
import './timekeeper-room.css'

export default function TimekeeperEntry(): JSX.Element {
  const [inRoom, setInRoom] = useState(true)

  const enterArchive = (destination: RoomDestination): void => {
    window.location.hash = destination
    setInRoom(false)
  }

  if (inRoom) {
    return <TimekeeperRoom onNavigate={enterArchive} />
  }

  return (
    <div className="timekeeper-legacy-app">
      <App />
      <button
        className="timekeeper-return"
        type="button"
        onClick={(): void => setInRoom(true)}
        title="Return to the Timekeeper's Room"
      >
        <span aria-hidden="true">✦</span>
        <span>The Room</span>
      </button>
    </div>
  )
}
