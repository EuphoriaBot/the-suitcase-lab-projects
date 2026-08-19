import { renderArcanistForm } from "./arcanistForm.js";
import { getAllStatusEffects } from "./statusEffectService.js";

export function renderArcanistDetail(
    container,
    arcanist,
    onBack
) {
    const statusEffects = getAllStatusEffects();
    const relatedStatusEffects =
        statusEffects.filter(
            statusEffect =>
                (arcanist.relatedStatusEffects || []).includes(statusEffect.id));

    container.innerHTML = `
        <div class="detail-page">
            <div class="detail-topbar">
                <button
                    class="secondary-button back-arcanist-button"
                    id="back-arcanist-button"
                >
                    ← Back to Arcanists
                </button>
            </div>

            <div class="detail-header">
                <div>
                    <h1>
                        ${escapeHtml(arcanist.name)}
                    </h1>
                    <p class="detail-meta">
                        ${escapeHtml(arcanist.afflatus)}
                        •
                        ${escapeHtml(arcanist.damageType)}
                    </p>
                </div>

                <button
                    class="primary-button"
                    id="edit-detail-arcanist-button"
                >
                    Edit Arcanist
                </button>
            </div>

            <section class="detail-section">
                <h2>Roles</h2>
                <div class="detail-tags">
                    ${renderTags(arcanist.roles, "No roles.")}
                </div>
            </section>

            <section class="detail-section">
                <h2>Skills</h2>
                ${renderSkills(arcanist.skills)}
            </section>

            <section class="detail-section">
                <h2>Portray</h2>
                ${renderPortray(arcanist.portray)}
            </section>

            <section class="detail-section">
                <h2>Mechanics</h2>
                <div class="detail-text">
                    ${formatText(arcanist.mechanics)}
                </div>
            </section>

            <section class="detail-section">
                <h2>Related Status Effects</h2>
                ${renderRelatedStatusEffects(relatedStatusEffects)}
            </section>

            <section class="detail-section">
                <h2>Tags</h2>
                <div class="detail-tags">
                    ${renderTags(arcanist.tags, "No tags.")}
                </div>
            </section>

            <section class="detail-section">
                <h2>Notes</h2>
                <div class="detail-text">
                    ${formatText(arcanist.notes)}
                </div>
            </section>
        </div>
    `;

    const backButton = document.getElementById("back-arcanist-button");

    backButton.addEventListener(
        "click",
        () => onBack()
    );

    const editButton = document.getElementById("edit-detail-arcanist-button");

    editButton.addEventListener(
        "click",
        () => {
            renderArcanistForm(
                container,
                () => {
                    onBack();
                },
                () => {
                    renderArcanistDetail(
                        container,
                        arcanist,
                        onBack
                    );
                },
                arcanist
            );
        }
    );
}


function renderSkills(skills) {
    if (!Array.isArray(skills) || skills.length === 0) {
        return `
            <p class="detail-empty">
                No skills available.
            </p>
        `;
    }

    return `
        <div class="detail-repeatable-list">
            ${skills.map(skill => `
                <div class="detail-repeatable-item">
                    <div class="detail-repeatable-header">
                        <h3>
                            ${escapeHtml(skill.name)}
                        </h3>

                        ${skill.type ? `
                                    <span class="tag">
                                        ${escapeHtml(skill.type)}
                                    </span>
                                `: ""}
                    </div>

                    <div class="detail-text">
                        ${formatText(skill.description)}
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function renderPortray(portray) {
    if (!Array.isArray(portray) || portray.length === 0) {
        return `
            <p class="detail-empty">
                No Portray information available.
            </p>
        `;
    }


    return `
        <div class="detail-repeatable-list">
            ${portray.map(item => `
                <div class="detail-repeatable-item">
                    <div class="detail-repeatable-header">
                        <h3>
                            P${escapeHtml(item.level)}
                        </h3>
                    </div>

                    <div class="detail-text">
                        ${formatText(
        item.description
    )}
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}


function renderRelatedStatusEffects(
    statusEffects
) {
    if (
        !statusEffects ||
        statusEffects.length === 0
    ) {
        return `
            <p class="detail-empty">
                No related Status Effects.
            </p>
        `;
    }


    return `
        <ul class="detail-list-items">
            ${statusEffects
            .map(statusEffect => `
                    <li>
                        ${escapeHtml(
                statusEffect.name
            )}
                    </li>
                `)
            .join("")
        }
        </ul>
    `;
}

function renderTags(
    tags,
    emptyMessage
) {
    if (
        !Array.isArray(tags) || tags.length === 0
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