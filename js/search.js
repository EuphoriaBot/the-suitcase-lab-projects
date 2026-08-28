import {
    getAllArcanists
} from "./arcanistService.js";

import {
    getAllStatusEffects
} from "./statusEffectService.js";


export function setupGlobalSearch(
    input,
    container
) {

    if (!input) {
        return;
    }


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                const keyword =
                    input.value
                        .trim();


                if (!keyword) {
                    return;
                }


                renderSearchResults(
                    container,
                    keyword
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                document.activeElement !== input &&
                !isTypingInField()
            ) {

                event.preventDefault();

                input.focus();

            }

        }
    );

}


function renderSearchResults(
    container,
    keyword
) {

    const normalizedKeyword =
        keyword.toLowerCase();


    const arcanists =
        getAllArcanists()
            .filter(
                arcanist =>
                    matchesArcanist(
                        arcanist,
                        normalizedKeyword
                    )
            );


    const statusEffects =
        getAllStatusEffects()
            .filter(
                statusEffect =>
                    matchesStatusEffect(
                        statusEffect,
                        normalizedKeyword
                    )
            );


    container.innerHTML = `

        <div class="search-results-page">

            <div class="page-header">

                <div>

                    <div class="page-eyebrow">
                        SEARCH
                    </div>

                    <h1>
                        Search Results
                    </h1>

                    <p class="page-description">
                        Results for "${escapeHtml(
        keyword
    )}"
                    </p>

                </div>

            </div>


            ${renderArcanistResults(
        arcanists
    )
        }


            ${renderStatusEffectResults(
            statusEffects
        )
        }


            ${arcanists.length === 0 &&
            statusEffects.length === 0
            ? `
                        <div class="empty-state">

                            <h2>
                                No Results Found
                            </h2>

                            <p>
                                Try a different search term.
                            </p>

                        </div>
                    `
            : ""
        }

        </div>

    `;


    bindSearchResultEvents(
        container
    );

}


function renderArcanistResults(
    arcanists
) {

    if (
        arcanists.length === 0
    ) {
        return "";
    }


    return `

        <section class="search-results-section">

            <div class="search-results-section-heading">

                <div>

                    <h2>
                        Arcanists
                    </h2>

                    <p>
                        ${arcanists.length}
                        result${arcanists.length === 1
            ? ""
            : "s"
        }
                    </p>

                </div>

            </div>


            <div class="search-results-list">

                ${arcanists
            .map(
                arcanist => `
                                <button
                                    type="button"
                                    class="search-result-card"
                                    data-type="arcanist"
                                    data-id="${escapeHtml(
                    arcanist.id
                )}"
                                >

                                    <div>

                                        <strong>
                                            ${escapeHtml(
                    arcanist.name
                )}
                                        </strong>

                                        <span>
                                            ${escapeHtml(
                    arcanist.afflatus ||
                    "Unknown"
                )}

                                            •

                                            ${escapeHtml(
                    arcanist.damageType ||
                    "Unknown"
                )}
                                        </span>

                                    </div>

                                    <span>
                                        →
                                    </span>

                                </button>
                            `
            )
            .join("")
        }

            </div>

        </section>

    `;

}


function renderStatusEffectResults(
    statusEffects
) {

    if (
        statusEffects.length === 0
    ) {
        return "";
    }


    return `

        <section class="search-results-section">

            <div class="search-results-section-heading">

                <div>

                    <h2>
                        Status Effects
                    </h2>

                    <p>
                        ${statusEffects.length}
                        result${statusEffects.length === 1
            ? ""
            : "s"
        }
                    </p>

                </div>

            </div>


            <div class="search-results-list">

                ${statusEffects
            .map(
                statusEffect => `
                                <button
                                    type="button"
                                    class="search-result-card"
                                    data-type="status-effect"
                                    data-id="${escapeHtml(
                    statusEffect.id
                )}"
                                >

                                    <div>

                                        <strong>
                                            ${escapeHtml(
                    statusEffect.name
                )}
                                        </strong>

                                        <span>
                                            ${escapeHtml(
                    statusEffect.duration ||
                    "Duration not specified"
                )}
                                        </span>

                                    </div>

                                    <span>
                                        →
                                    </span>

                                </button>
                            `
            )
            .join("")
        }

            </div>

        </section>

    `;

}


function bindSearchResultEvents(
    container
) {

    const resultButtons =
        container.querySelectorAll(
            ".search-result-card"
        );


    resultButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.dataset.id;

                    const type =
                        button.dataset.type;


                    if (
                        type === "arcanist"
                    ) {

                        const arcanist =
                            getAllArcanists()
                                .find(
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
                            () => {
                                renderSearchResults(
                                    container,
                                    document
                                        .getElementById(
                                            "global-search"
                                        )
                                        ?.value
                                        .trim() || ""
                                );
                            }
                        );

                        return;

                    }


                    if (
                        type === "status-effect"
                    ) {

                        const statusEffect =
                            getAllStatusEffects()
                                .find(
                                    item =>
                                        item.id === id
                                );


                        if (!statusEffect) {
                            return;
                        }


                        const {
                            renderStatusEffectDetail
                        } = await import(
                            "./statusEffectDetail.js"
                        );


                        renderStatusEffectDetail(
                            container,
                            statusEffect,
                            () => {
                                renderSearchResults(
                                    container,
                                    document
                                        .getElementById(
                                            "global-search"
                                        )
                                        ?.value
                                        .trim() || ""
                                );
                            }
                        );

                    }

                }
            );

        }
    );

}


function matchesArcanist(
    arcanist,
    keyword
) {

    const searchableText = [

        arcanist.name,

        arcanist.afflatus,

        arcanist.damageType,

        arcanist.mechanics,

        arcanist.notes,

        ...(arcanist.roles || []),

        ...(arcanist.tags || []),

        ...(arcanist.relatedStatusEffects || []),

        ...(Array.isArray(arcanist.skills)
            ? arcanist.skills.flatMap(
                skill => [
                    skill.name,
                    skill.type,
                    skill.description
                ]
            )
            : []
        ),

        ...(Array.isArray(arcanist.portray)
            ? arcanist.portray.flatMap(
                item => [
                    item.description
                ]
            )
            : []
        )

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


function matchesStatusEffect(
    statusEffect,
    keyword
) {

    const searchableText = [

        statusEffect.name,

        statusEffect.description,

        statusEffect.effect,

        statusEffect.duration,

        statusEffect.notes,

        ...(statusEffect.tags || []),

        ...(statusEffect.relatedArcanists || [])

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


function isTypingInField() {

    const activeElement =
        document.activeElement;


    if (!activeElement) {
        return false;
    }


    const tagName =
        activeElement.tagName.toLowerCase();


    return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
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