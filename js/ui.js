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

export function showToast(
    message,
    type = "success"
) {

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.setAttribute(
        "role",
        "status"
    );

    toast.innerHTML = `

        <span class="toast-icon">
            ${type === "success" ? "✓" : "!"}
        </span>

        <span class="toast-message">
            ${escapeHtml(message)}
        </span>

    `;

    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {
            toast.classList.add(
                "show"
            );
        }
    );


    const timeoutId =
        window.setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );


                window.setTimeout(
                    () => {
                        toast.remove();
                    },
                    200
                );

            },
            3000
        );


    toast.addEventListener(
        "click",
        () => {

            window.clearTimeout(
                timeoutId
            );

            toast.classList.remove(
                "show"
            );


            window.setTimeout(
                () => {
                    toast.remove();
                },
                200
            );

        }
    );

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