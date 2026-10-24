import { useEffect, useId, useRef, type JSX } from 'react'

import { createPortal } from 'react-dom'

interface DeleteArcanistDialogProps {
  arcanistName: string
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}

function DeleteArcanistDialog({
  arcanistName,
  error,
  onCancel,
  onConfirm
}: DeleteArcanistDialogProps): JSX.Element {
  const titleId = useId()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement

    cancelButtonRef.current?.focus()

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onCancel()
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
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${titleId}-description`}
      >
        <h2 id={titleId}>Delete Arcanist?</h2>

        <p id={`${titleId}-description`}>
          Are you sure you want to delete <strong>{arcanistName}</strong>? This action cannot be
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

export default DeleteArcanistDialog
