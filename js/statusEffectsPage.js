import {
    getAllStatusEffects
} from "./statusEffectService.js";

import {
    renderStatusEffectForm
} from "./statusEffectForm.js";

import {
    renderStatusEffectDetail
} from "./statusEffectDetail.js";


export function renderStatusEffectsPage(
    container
) {

    const statusEffects =
        getAllStatusEffects();


    container.innerHTML = `
        <div class="page-header">

            <div>

                <div class="page-eyebrow">
                    DATABASE
                </div>

                <h1>
                    Status Effects
                </h1>

                <p class="page-description">
                    Record and review your Reverse: 1999 Status Effects.
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
                placeholder="Search by name, effect, tag..."
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


            if (!keyword) {

                renderStatusEffectList(
                    statusEffects,
                    container
                );

                return;
            }


            const filteredStatusEffects =
                statusEffects.filter(
                    statusEffect =>
                        matchesStatusEffectSearch(
                            statusEffect,
                            keyword
                        )
                );


            renderStatusEffectList(
                filteredStatusEffects,
                container
            );

        }
    );

}


function matchesStatusEffectSearch(
    statusEffect,
    keyword
) {

    const searchableText = [

        statusEffect.name,

        statusEffect.description,

        statusEffect.effect,

        statusEffect.duration,

        statusEffect.notes,

        ...(statusEffect.tags || [])

    ]
        .filter(
            value =>
                value !== undefined &&
                value !== null
        )
        .join(" ")
        .toLowerCase();


    return searchableText.includes(
        keyword
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
                    There are no Status Effects matching your search.
                </p>

            </div>
        `;

        return;
    }


    listContainer.innerHTML =
        statusEffects
            .map(statusEffect => {

                const relatedArcanistCount =
                    Array.isArray(
                        statusEffect.relatedArcanists
                    )
                        ? statusEffect.relatedArcanists.length
                        : 0;


                return `

                    <article
                        class="status-effect-card"
                    >

                        <div class="status-effect-card-content">

                            <div class="status-effect-card-header">

                                <div>

                                    <h2>

                                        <button
                                            class="status-effect-name-button"
                                            data-id="${escapeHtml(
                    statusEffect.id
                )}"
                                        >
                                            ${escapeHtml(
                    statusEffect.name
                )}
                                        </button>

                                    </h2>

                                </div>

                            </div>


                            <p class="status-effect-summary">

                                ${escapeHtml(
                    statusEffect.description ||
                    "No description available."
                )}

                            </p>


                            <div class="status-effect-tags">

                                ${(statusEffect.tags || [])
                        .map(tag => `
                                        <span class="tag">
                                            ${escapeHtml(tag)}
                                        </span>
                                    `)
                        .join("")
                    }

                            </div>


                            <div class="status-effect-card-stats">

                                <span>

                                    ${statusEffect.duration
                        ? escapeHtml(
                            statusEffect.duration
                        )
                        : "No duration"
                    }

                                </span>


                                <span>

                                    ${statusEffect.stackable
                        ? "Stackable"
                        : "Not Stackable"
                    }

                                </span>


                                <span>

                                    ${relatedArcanistCount}

                                    ${relatedArcanistCount === 1
                        ? "Arcanist"
                        : "Arcanists"
                    }

                                </span>

                            </div>

                        </div>

                    </article>

                `;

            })
            .join("");


    const nameButtons =
        listContainer.querySelectorAll(
            ".status-effect-name-button"
        );


    nameButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;


                    const statusEffect =
                        getAllStatusEffects().find(
                            item =>
                                item.id === id
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