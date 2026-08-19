import { getAllStatusEffects } from "./statusEffectService.js";
import { renderStatusEffectForm } from "./statusEffectForm.js";
import { renderStatusEffectDetail } from "./statusEffectDetail.js";

export function renderStatusEffectsPage(
    container
) {
    const statusEffects = getAllStatusEffects();

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Status Effects</h1>
                <p class="page-description">
                    Record and review Reverse: 1999 status effects.
                </p>
            </div>

            <button
                class="primary-button"
                id="add-status-effect-button"
            >
                + Add Status Effect
            </button>
        </div>

        <div class="search-container">
            <input
                type="text"
                id="status-effect-search"
                class="search-input"
                placeholder="Search Status Effects..."
            >
        </div>

        <div
            id="status-effect-list"
            class="status-effect-list"
        >
        </div>
    `;

    renderStatusEffectList(
        statusEffects,
        container
    );

    const searchInput =
        document.getElementById(
            "status-effect-search"
        );

    const addButton =
        document.getElementById(
            "add-status-effect-button"
        );

    addButton.addEventListener(
        "click",
        () => {
            renderStatusEffectForm(
                container,
                () => {
                    renderStatusEffectsPage(
                        container
                    );
                },

                () => {
                    renderStatusEffectsPage(
                        container
                    );
                }
            );
        }
    );

    searchInput.addEventListener(
        "input",
        () => {
            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const filteredStatusEffects =
                statusEffects.filter(
                    statusEffect =>
                        statusEffect.name
                            .toLowerCase()
                            .includes(keyword)
                );

            renderStatusEffectList(
                filteredStatusEffects,
                container
            );
        }
    );
}

function renderStatusEffectList(
    statusEffects,
    container
) {
    const listContainer =
        document.getElementById(
            "status-effect-list"
        );

    if (!listContainer) {
        return;
    }

    if (statusEffects.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <h2>
                    No Status Effects Found
                </h2>
                <p>
                    There are no Status Effects to display.
                </p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = statusEffects.map(statusEffect => `
            <article class="status-effect-card">
                <div class="status-effect-card-content">
                    <div class="status-effect-card-header">
                        <div>
                            <h2>
                                <button
                                    class="status-effect-name-button"
                                    data-id="${statusEffect.id}"
                                >
                                    ${escapeHtml(statusEffect.name)}
                                </button>
                            </h2>
                        </div>
                    </div>

                    <p class="status-effect-summary">
                        ${escapeHtml(statusEffect.description)}
                    </p>

                    <div class="status-effect-tags">
                        ${(statusEffect.tags || []).map(tag => `
                                <span class="tag">
                                    ${escapeHtml(tag)}
                                </span>
                            `).join("")}
                    </div>
                </div>
            </article>
        `).join("");

    const nameButtons = listContainer.querySelectorAll(".status-effect-name-button");

    nameButtons.forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const id = button.dataset.id;
                const statusEffect =
                    getAllStatusEffects().find(
                        item => item.id === id
                    );

                if (!statusEffect) {
                    return;
                }

                renderStatusEffectDetail(
                    container,
                    statusEffect,
                    () => {
                        renderStatusEffectsPage(
                            container
                        );
                    }
                );
            }
        );
    });
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