import { useEffect, useId, useRef, type JSX } from 'react'

import { createPortal } from 'react-dom'

interface DeleteStatusEffectDialogProps {
  statusEffectName: string
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}

function DeleteStatusEffectDialog({
  statusEffectName,
  error,
  onCancel,
  onConfirm
}: DeleteStatusEffectDialogProps): JSX.Element {
  const titleId = useId()

  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement

    cancelButtonRef.current?.focus()

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const buttons = Array.from(
        dialogRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      )

      if (buttons.length === 0) {
        return
      }

      const first = buttons[0]
      const last = buttons[buttons.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return (): void => {
      document.removeEventListener('keydown', handleKeydown)

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [onCancel])

  return createPortal(
    <div
      className="confirmation-overlay"
      onMouseDown={(event): void => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        ref={dialogRef}
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${titleId}-description`}
      >
        <h2 id={titleId}>Delete Status Effect?</h2>

        <p id={`${titleId}-description`}>
          Are you sure you want to delete <strong>{statusEffectName}</strong>? This action cannot be
          undone.
        </p>

        {error && (
          <p
            role="alert"
            style={{
              color: '#C98688',
              marginTop: '12px'
            }}
          >
            {error}
          </p>
        )}

        <div className="confirmation-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="button" className="danger-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DeleteStatusEffectDialog
