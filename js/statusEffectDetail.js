import { renderStatusEffectForm } from "./statusEffectForm.js";
import { getAllArcanists } from "./arcanistService.js";

export function renderStatusEffectDetail(
    container,
    statusEffect,
    onBack
) {

    const arcanists =
        getAllArcanists();


    const relatedArcanists =
        arcanists.filter(
            arcanist =>
                (
                    statusEffect.relatedArcanists || []
                ).includes(arcanist.id)
        );


    container.innerHTML = `
        <div class="detail-page">

            <div class="detail-topbar">

                <button
                    class="secondary-button"
                    id="back-status-effect-button"
                >
                    ← Back to Status Effects
                </button>

            </div>


            <div class="detail-hero">

                <div class="detail-hero-content">

                    <div class="detail-eyebrow">
                        STATUS EFFECT
                    </div>

                    <h1>
                        ${escapeHtml(
        statusEffect.name
    )}
                    </h1>

                    <div class="status-effect-summary-badges">

                        <span class="detail-info-badge">

                            Duration:
                            ${escapeHtml(
        statusEffect.duration ||
        "Not specified"
    )}

                        </span>


                        <span
                            class="detail-info-badge ${statusEffect.stackable
            ? "detail-info-badge-active"
            : ""
        }"
                        >

                            ${statusEffect.stackable
            ? "Stackable"
            : "Not Stackable"
        }

                        </span>

                    </div>

                </div>


                <button
                    class="primary-button"
                    id="edit-detail-status-effect-button"
                >
                    Edit Status Effect
                </button>

            </div>


            <section class="detail-section">

                <div class="detail-section-heading">

                    <div>

                        <h2>Description</h2>

                        <p>
                            What this status effect represents.
                        </p>

                    </div>

                </div>


                <div class="detail-note">

                    ${formatText(
            statusEffect.description
        )}

                </div>

            </section>


            <section class="detail-section">

                <div class="detail-section-heading">

                    <div>

                        <h2>Effect</h2>

                        <p>
                            How this status effect affects gameplay.
                        </p>

                    </div>

                </div>


                <div class="detail-note">

                    ${formatText(
            statusEffect.effect
        )}

                </div>

            </section>


            <section class="detail-section">

                <div class="detail-section-heading">

                    <div>

                        <h2>Related Arcanists</h2>

                        <p>
                            Arcanists associated with this status effect.
                        </p>

                    </div>

                </div>


                ${renderRelatedNames(
            relatedArcanists,
            "No related Arcanists."
        )}

            </section>


            <section class="detail-section">

                <div class="detail-section-heading">

                    <div>

                        <h2>Tags</h2>

                        <p>
                            Useful keywords for this status effect.
                        </p>

                    </div>

                </div>


                <div class="detail-tags">

                    ${renderTags(
            statusEffect.tags,
            "No tags."
        )}

                </div>

            </section>


            <section class="detail-section">

                <div class="detail-section-heading">

                    <div>

                        <h2>Notes</h2>

                        <p>
                            Personal notes and additional information.
                        </p>

                    </div>

                </div>


                <div class="detail-note">

                    ${formatText(
            statusEffect.notes
        )}

                </div>

            </section>

        </div>
    `;


    const backButton =
        document.getElementById(
            "back-status-effect-button"
        );


    backButton.addEventListener(
        "click",
        () => onBack()
    );


    const editButton =
        document.getElementById(
            "edit-detail-status-effect-button"
        );


    editButton.addEventListener(
        "click",
        () => {

            renderStatusEffectForm(

                container,

                () => {
                    onBack();
                },

                () => {

                    renderStatusEffectDetail(
                        container,
                        statusEffect,
                        onBack
                    );

                },

                statusEffect

            );

        }
    );


    const relatedArcanistButtons =
        document.querySelectorAll(
            ".related-arcanist-button"
        );


    relatedArcanistButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.dataset.id;


                    const arcanist =
                        getAllArcanists().find(
                            item =>
                                item.id === id
                        );


                    if (!arcanist) {
                        return;
                    }


                    const {
                        renderArcanistDetail
                    } = await import(
                        "./arcanistDetail.js"
                    );


                    renderArcanistDetail(
                        container,
                        arcanist,
                        onBack
                    );

                }
            );

        }
    );

}


function renderRelatedNames(
    items,
    emptyMessage
) {

    if (
        !items ||
        items.length === 0
    ) {

        return `
            <p class="detail-empty">
                ${escapeHtml(
            emptyMessage
        )}
            </p>
        `;

    }


    return `
        <div class="related-item-list">

            ${items
            .map(item => `

                    <button
                        type="button"
                        class="related-item-button related-arcanist-button"
                        data-id="${escapeHtml(
                item.id
            )}"
                    >

                        <span>
                            ${escapeHtml(
                item.name
            )}
                        </span>

                        <span class="related-item-arrow">
                            →
                        </span>

                    </button>

                `)
            .join("")
        }

        </div>
    `;

}


function renderTags(
    tags,
    emptyMessage
) {

    if (
        !Array.isArray(tags) ||
        tags.length === 0
    ) {

        return `
            <p class="detail-empty">
                ${escapeHtml(
            emptyMessage
        )}
            </p>
        `;

    }


    return tags
        .map(tag => `
            <span class="tag">
                ${escapeHtml(tag)}
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