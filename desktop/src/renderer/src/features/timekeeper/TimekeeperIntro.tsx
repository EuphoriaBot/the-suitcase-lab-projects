import { useEffect, type JSX } from 'react'
import './timekeeper-intro.css'

interface TimekeeperIntroProps {
  onComplete: () => void
}

const INTRO_DURATION = 6400

export default function TimekeeperIntro({ onComplete }: TimekeeperIntroProps): JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, INTRO_DURATION)

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onComplete()
    }

    window.addEventListener('keydown', handleKeyDown)

    return (): void => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onComplete])

  return (
    <section className="timekeeper-intro" aria-label="Entering The Suitcase Lab">
      <div className="timekeeper-intro__scene" aria-hidden="true">
        <div className="timekeeper-intro__portal">
          <div className="timekeeper-intro__portal-light" />
          <div className="timekeeper-intro__door timekeeper-intro__door--left" />
          <div className="timekeeper-intro__door timekeeper-intro__door--right" />
        </div>
      </div>

      <div className="timekeeper-intro__rain" aria-hidden="true" />
      <div className="timekeeper-intro__curtain" aria-hidden="true" />

      <button className="timekeeper-intro__skip" type="button" onClick={onComplete}>
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
