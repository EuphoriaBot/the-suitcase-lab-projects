import { renderStatusEffectForm } from "./statusEffectForm.js";
import { getAllArcanists } from "./arcanistService.js";

export function renderStatusEffectDetail(
    container,
    statusEffect,
    onBack
) {

    const arcanists = getAllArcanists();
    const relatedArcanists = arcanists.filter(
        arcanist =>
            (statusEffect.relatedArcanists || []).includes(arcanist.id)
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

            <div class="detail-header">
                <div>
                    <h1>
                        ${escapeHtml(statusEffect.name)}
                    </h1>
                </div>

                <button
                    class="primary-button"
                    id="edit-detail-status-effect-button"
                >
                    Edit Status Effect
                </button>
            </div>


            <section class="detail-section">
                <h2>Description</h2>
                <div class="detail-text">
                    ${formatText(statusEffect.description)}
                </div>
            </section>


            <section class="detail-section">
                <h2>Effect</h2>
                <div class="detail-text">
                    ${formatText(statusEffect.effect)}
                </div>
            </section>

            <section class="detail-section">
                <h2>Duration</h2>
                <div class="detail-text">
                    ${formatText(statusEffect.duration)}
                </div>
            </section>

            <section class="detail-section">
                <h2>Stackable</h2>
                <div class="detail-text">
                    ${statusEffect.stackable ? "Yes" : "No"}
                </div>
            </section>

            <section class="detail-section">
                <h2>Related Arcanists</h2>
                ${renderRelatedNames(relatedArcanists, "No related Arcanists.")}
            </section>

            <section class="detail-section">
                <h2>Tags</h2>
                <div class="detail-tags">
                    ${renderTags(statusEffect.tags, "No tags.")}
                </div>
            </section>

            <section class="detail-section">
                <h2>Notes</h2>
                <div class="detail-text">
                    ${formatText(statusEffect.notes)}
                </div>
            </section>
        </div>
    `;

    const backButton = document.getElementById("back-status-effect-button");
    backButton.addEventListener("click", () => onBack());
    const editButton = document.getElementById("edit-detail-status-effect-button");

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
}

function renderRelatedNames(
    items,
    emptyMessage
) {
    if (
        !items || items.length === 0
    ) {
        return `
            <p class="detail-empty">
                ${escapeHtml(emptyMessage)}
            </p>
        `;
    }

    return `
        <div class="related-item-list">
            ${items.map(item => `
                <button
                    type="button"
                    class="related-item-button"
                    data-id="${escapeHtml(item.id)}"
                    >
                        ${escapeHtml(item.name)}
                    </button>
                `)
            .join("")
        }
        </div>
    `;
}

const relatedArcanistButtons =
    document.querySelectorAll(
        ".related-item-button"
    );


relatedArcanistButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                const id = button.dataset.id;
                const arcanists = getAllArcanists();
                const arcanist =
                    arcanists.find(
                        item => item.id === id
                    );
                if (!arcanist) {
                    return;
                }
                renderArcanistDetail(
                    container,
                    arcanist,
                    onBack
                );
            }
        );
    }
);

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
                ${escapeHtml(emptyMessage)}
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
    return escapeHtml(value).replace(/\n/g, "<br>");

}


function escapeHtml(value) {
    if (
        value === undefined || value === null
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