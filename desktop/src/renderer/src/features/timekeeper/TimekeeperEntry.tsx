import { useCallback, useState, type JSX } from 'react'
import App from '../../App'
import TimekeeperIntro from './TimekeeperIntro'
import TimekeeperRoom, { type RoomDestination } from './TimekeeperRoom'
import './timekeeper-room.css'

const isReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let introHasPlayed = false

type Scene = 'intro' | 'room' | 'archive'

export default function TimekeeperEntry(): JSX.Element {
  const [scene, setScene] = useState<Scene>(() =>
    introHasPlayed || isReducedMotion() ? 'room' : 'intro'
  )

  const openRoom = useCallback((): void => {
    introHasPlayed = true
    setScene('room')
  }, [])

  const enterArchive = (destination: RoomDestination): void => {
    window.location.hash = destination
    setScene('archive')
  }

  if (scene === 'intro') {
    return <TimekeeperIntro onComplete={openRoom} />
  }

  if (scene === 'room') {
    return (
      <div className="timekeeper-entry__room">
        <TimekeeperRoom onNavigate={enterArchive} />
      </div>
    )
  }

  return (
    <div className="timekeeper-legacy-app">
      <App />

      <button
        className="timekeeper-return"
        type="button"
        onClick={openRoom}
        title="Return to the Timekeeper's Room"
      >
        <span aria-hidden="true">✦</span>
        <span>The Room</span>
      </button>
    </div>
  )
}
