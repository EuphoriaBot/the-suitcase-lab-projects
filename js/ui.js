export function showDeleteConfirmation(
    title,
    name,
    onConfirm
) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "confirmation-overlay";

    overlay.innerHTML = `

        <div
            class="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
        >

            <h2 id="confirmation-title">
                ${escapeHtml(title)}
            </h2>

            <p>
                Are you sure you want to delete
                <strong>${escapeHtml(name)}</strong>?
                This action cannot be undone.
            </p>


            <div class="confirmation-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-action="cancel"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="danger-button"
                    data-action="confirm"
                >
                    Delete
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const cancelButton =
        overlay.querySelector(
            '[data-action="cancel"]'
        );


    const confirmButton =
        overlay.querySelector(
            '[data-action="confirm"]'
        );


    const close =
        () => {

            overlay.remove();

            document.removeEventListener(
                "keydown",
                handleKeydown
            );

        };


    const handleKeydown =
        event => {

            if (
                event.key === "Escape"
            ) {

                close();

            }

        };


    cancelButton.addEventListener(
        "click",
        close
    );


    confirmButton.addEventListener(
        "click",
        () => {

            close();

            onConfirm();

        }
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                close();

            }

        }
    );


    document.addEventListener(
        "keydown",
        handleKeydown
    );


    confirmButton.focus();

}


function escapeHtml(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}