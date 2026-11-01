import { useEffect, type JSX } from 'react'
import './timekeeper-intro.css'

interface TimekeeperIntroProps {
  onComplete: () => void
}

export default function TimekeeperIntro({ onComplete }: TimekeeperIntroProps): JSX.Element {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 5600)

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onComplete()
    }

    window.addEventListener('keydown', handleKeyDown)

    return (): void => {
      window.clearTimeout(timeout)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onComplete])

  return (
    <section className="timekeeper-intro" aria-label="Entering the Timekeeper's archive">
      <div className="timekeeper-intro__world" aria-hidden="true">
        <div className="timekeeper-intro__sky" />
        <div className="timekeeper-intro__rain" />

        <div className="timekeeper-intro__building">
          <div className="timekeeper-intro__roof" />

          <div className="timekeeper-intro__facade">
            <div className="timekeeper-intro__wing timekeeper-intro__wing--left">
              <div className="timekeeper-intro__window" />
              <div className="timekeeper-intro__sconce" />
            </div>

            <div className="timekeeper-intro__wing timekeeper-intro__wing--right">
              <div className="timekeeper-intro__window" />
              <div className="timekeeper-intro__sconce" />
            </div>

            <div className="timekeeper-intro__entrance">
              <div className="timekeeper-intro__crest">✧</div>

              <div className="timekeeper-intro__name">THE SUITCASE LAB</div>

              <div className="timekeeper-intro__arch">
                <div className="timekeeper-intro__inside" />

                <div className="timekeeper-intro__door timekeeper-intro__door--left">
                  <span className="timekeeper-intro__door-inset" />
                  <span className="timekeeper-intro__handle" />
                </div>

                <div className="timekeeper-intro__door timekeeper-intro__door--right">
                  <span className="timekeeper-intro__door-inset" />
                  <span className="timekeeper-intro__handle" />
                </div>
              </div>

              <div className="timekeeper-intro__steps" />
            </div>
          </div>
        </div>

        <div className="timekeeper-intro__street" />
      </div>

      <div className="timekeeper-intro__caption" aria-hidden="true">
        <span>THE TIMEKEEPER&apos;S ARCHIVE</span>
        <strong>A room beyond the Storm</strong>
        <span className="timekeeper-intro__caption-rule" />
      </div>

      <div className="timekeeper-intro__fade" aria-hidden="true" />

      <button type="button" className="timekeeper-intro__skip" onClick={onComplete}>
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
