import { renderMechanicForm } from "./mechanicForm.js";


export function renderMechanicDetail(
    container,
    mechanic,
    onBack
) {

    container.innerHTML = `
        <div class="detail-page">

            <div class="detail-topbar">

                <button
                    class="secondary-button"
                    id="back-mechanic-button"
                >
                    ← Back to Mechanics
                </button>

            </div>


            <div class="detail-header">

                <div>

                    <h1>
                        ${escapeHtml(mechanic.name)}
                    </h1>

                    <p class="detail-meta">
                        ${escapeHtml(mechanic.category)}
                    </p>

                </div>


                <button
                    class="primary-button"
                    id="edit-detail-mechanic-button"
                >
                    Edit Mechanic
                </button>

            </div>


            <section class="detail-section">

                <h2>Short Description</h2>

                <div class="detail-text">
                    ${formatText(mechanic.shortDescription)}
                </div>

            </section>


            <section class="detail-section">

                <h2>Detailed Description</h2>

                <div class="detail-text">
                    ${formatText(mechanic.detailedDescription)}
                </div>

            </section>


            <section class="detail-section">

                <h2>Examples</h2>

                <div class="detail-list">

                    ${renderList(
        mechanic.examples,
        "No examples available."
    )
        }

                </div>

            </section>


            <section class="detail-section">

                <h2>Related Arcanists</h2>

                <div class="detail-tags">

                    ${renderTags(
            mechanic.relatedArcanists,
            "No related Arcanists."
        )
        }

                </div>

            </section>


            <section class="detail-section">

                <h2>Related Status Effects</h2>

                <div class="detail-tags">

                    ${renderTags(
            mechanic.relatedStatusEffects,
            "No related Status Effects."
        )
        }

                </div>

            </section>


            <section class="detail-section">

                <h2>Tags</h2>

                <div class="detail-tags">

                    ${renderTags(
            mechanic.tags,
            "No tags."
        )
        }

                </div>

            </section>


            <section class="detail-section">

                <h2>Notes</h2>

                <div class="detail-text">
                    ${formatText(mechanic.notes)}
                </div>

            </section>

        </div>
    `;


    const backButton =
        document.getElementById(
            "back-mechanic-button"
        );


    backButton.addEventListener(
        "click",
        () => onBack()
    );


    const editButton =
        document.getElementById(
            "edit-detail-mechanic-button"
        );


    editButton.addEventListener(
        "click",
        () => {

            renderMechanicForm(

                container,

                () => {
                    onBack();
                },

                () => {
                    renderMechanicDetail(
                        container,
                        mechanic,
                        onBack
                    );
                },

                mechanic

            );

        }
    );

}


function renderList(
    items,
    emptyMessage
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <p class="detail-empty">
                ${escapeHtml(emptyMessage)}
            </p>
        `;

    }


    return `
        <ul class="detail-list-items">

            ${items
            .map(item => `
                    <li>
                        ${escapeHtml(item)}
                    </li>
                `)
            .join("")
        }

        </ul>
    `;

}


function renderTags(
    items,
    emptyMessage
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <p class="detail-empty">
                ${escapeHtml(emptyMessage)}
            </p>
        `;

    }


    return items
        .map(item => `
            <span class="tag">
                ${escapeHtml(item)}
            </span>
        `)
        .join("");

}


function formatText(value) {

    if (!value) {

        return `
            <p class="detail-empty">
                No information available.
            </p>
        `;

    }


    return escapeHtml(value)
        .replace(/\n/g, "<br>");

}


function escapeHtml(value) {

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