import { useEffect, useState, type JSX } from 'react'
import bookAnimation from '../../assets/timekeeper/book-opening-animated.webp'
import bookFallback from '../../assets/timekeeper/book-open-fallback.png'
import './book-opening-transition.css'

export type BookOpeningPhase = 'zoom' | 'seal' | 'opening' | 'arriving'

type BookDestination = 'arcanists' | 'status-effects'

interface BookOpeningTransitionProps {
  destination: BookDestination
  phase: BookOpeningPhase
  onZoomed: () => void
  onSealed: () => void
  onOpened: () => void
  onFinished: () => void
}

const PHASE_DURATION: Record<BookOpeningPhase, number> = {
  zoom: 1700,
  seal: 240,
  opening: 2800,
  arriving: 380
}

export default function BookOpeningTransition({
  destination,
  phase,
  onZoomed,
  onSealed,
  onOpened,
  onFinished
}: BookOpeningTransitionProps): JSX.Element {
  const [animationFailed, setAnimationFailed] = useState(false)

  useEffect(() => {
    const next =
      phase === 'zoom'
        ? onZoomed
        : phase === 'seal'
          ? onSealed
          : phase === 'opening'
            ? onOpened
            : onFinished

    const timer = window.setTimeout(next, PHASE_DURATION[phase])

    return (): void => window.clearTimeout(timer)
  }, [phase, onZoomed, onSealed, onOpened, onFinished])

  const label = destination === 'arcanists' ? 'Arcanists' : 'Status Effects'
  const showBook = phase === 'opening' || phase === 'arriving'

  return (
    <div
      className={`book-opening-video book-opening-video--${destination === 'arcanists' ? 'arcanists' : 'effects'} book-opening-video--${phase}`}
      role="status"
      aria-label={`Opening ${label} archive`}
    >
      <div className="book-opening-video__shade" aria-hidden="true" />

      {showBook && (
        <div className="book-opening-video__footage" aria-hidden="true">
          {animationFailed ? (
            <img
              className="book-opening-video__book"
              src={bookFallback}
              alt=""
              draggable={false}
            />
          ) : (
            <img
              className="book-opening-video__book"
              src={bookAnimation}
              alt=""
              draggable={false}
              onError={(): void => setAnimationFailed(true)}
            />
          )}
        </div>
      )}

      <div className="book-opening-video__glow" aria-hidden="true" />
      <div className="book-opening-video__fade" aria-hidden="true" />
    </div>
  )
}
