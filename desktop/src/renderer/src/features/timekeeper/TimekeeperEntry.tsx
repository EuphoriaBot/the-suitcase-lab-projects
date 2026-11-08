import { useCallback, useState, type CSSProperties, type JSX } from 'react'
import App from '../../App'
import BookOpeningTransition, { type BookOpeningPhase } from './BookOpeningTransition'
import TimekeeperIntro from './TimekeeperIntro'
import TimekeeperRoom, { type RoomDestination } from './TimekeeperRoom'
import './timekeeper-room.css'

type BookDestination = 'arcanists' | 'status-effects'
type Scene = 'intro' | 'room' | 'archive'

interface OpeningBook {
  destination: BookDestination
  phase: BookOpeningPhase
  shiftX: number
  shiftY: number
  scale: number
}

const BOOK_FOCUS: Record<BookDestination, { x: number; y: number; scale: number }> = {
  arcanists: { x: 0.39, y: 0.86, scale: 2.65 },
  'status-effects': { x: 0.37, y: 0.32, scale: 2.75 }
}

const isReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let introHasPlayed = false

function calculateBookFocus(destination: BookDestination): OpeningBook {
  const focus = BOOK_FOCUS[destination]
  const rect = document
    .querySelector<HTMLElement>('.timekeeper-room__canvas')
    ?.getBoundingClientRect()

  if (!rect) {
    return { destination, phase: 'zoom', shiftX: 0, shiftY: 0, scale: focus.scale }
  }

  const canvasCenterX = rect.left + rect.width / 2
  const canvasCenterY = rect.top + rect.height / 2
  const bookX = rect.left + rect.width * focus.x
  const bookY = rect.top + rect.height * focus.y

  return {
    destination,
    phase: 'zoom',
    shiftX: window.innerWidth / 2 - canvasCenterX - (bookX - canvasCenterX) * focus.scale,
    shiftY: window.innerHeight / 2 - canvasCenterY - (bookY - canvasCenterY) * focus.scale,
    scale: focus.scale
  }
}

export default function TimekeeperEntry(): JSX.Element {
  const [scene, setScene] = useState<Scene>(() =>
    introHasPlayed || isReducedMotion() ? 'room' : 'intro'
  )
  const [openingBook, setOpeningBook] = useState<OpeningBook | null>(null)

  const openRoom = useCallback((): void => {
    introHasPlayed = true
    setOpeningBook(null)
    setScene('room')
  }, [])

  const openArchive = useCallback((destination: RoomDestination): void => {
    window.location.hash = destination
    setScene('archive')
  }, [])

  const enterArchive = (destination: RoomDestination): void => {
    if (openingBook) return

    if ((destination === 'arcanists' || destination === 'status-effects') && !isReducedMotion()) {
      setOpeningBook(calculateBookFocus(destination))
      return
    }

    openArchive(destination)
  }

  const finishZoom = useCallback((): void => {
    setOpeningBook((current) =>
      current?.phase === 'zoom' ? { ...current, phase: 'seal' } : current
    )
  }, [])

  const finishSeal = useCallback((): void => {
    setOpeningBook((current) =>
      current?.phase === 'seal' ? { ...current, phase: 'opening' } : current
    )
  }, [])

  const finishOpening = useCallback((): void => {
    if (!openingBook || openingBook.phase !== 'opening') return

    openArchive(openingBook.destination)
    setOpeningBook((current) => (current ? { ...current, phase: 'arriving' } : current))
  }, [openingBook, openArchive])

  const finishArrival = useCallback((): void => {
    setOpeningBook(null)
  }, [])

  if (scene === 'intro') {
    return <TimekeeperIntro onComplete={openRoom} />
  }

  const roomStyle = openingBook
    ? ({
        '--book-zoom-shift-x': `${openingBook.shiftX}px`,
        '--book-zoom-shift-y': `${openingBook.shiftY}px`,
        '--book-zoom-scale': openingBook.scale
      } as CSSProperties)
    : undefined

  return (
    <>
      {scene === 'room' ? (
        <div
          className={`timekeeper-entry__room${openingBook ? ' timekeeper-entry__room--book-zooming' : ''}`}
          style={roomStyle}
        >
          <TimekeeperRoom onNavigate={enterArchive} />
        </div>
      ) : (
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
      )}

      {openingBook && (
        <BookOpeningTransition
          destination={openingBook.destination}
          phase={openingBook.phase}
          onZoomed={finishZoom}
          onSealed={finishSeal}
          onOpened={finishOpening}
          onFinished={finishArrival}
        />
      )}
    </>
  )
}
