import { getAllArcanists } from "./arcanistService.js";
import { getAllStatusEffects } from "./statusEffectService.js";


export function renderDashboard(
    container,
) {

    const arcanists =
        getAllArcanists();


    const statusEffects =
        getAllStatusEffects();


    const recentArcanists =
        arcanists
            .slice(-5)
            .reverse();


    const recentStatusEffects =
        statusEffects
            .slice(-5)
            .reverse();


    container.innerHTML = `

        <div class="dashboard-page">

            <section class="dashboard-hero">

                <div>

                    <div class="dashboard-eyebrow">
                        REVERSE: 1999 NOTES
                    </div>

                    <h1>
                        Your Knowledge Base
                    </h1>

                    <p>
                        Keep track of Arcanists and Status Effects
                        in one organized place.
                    </p>

                </div>

            </section>


            <section class="dashboard-stats">

                <button
                    type="button"
                    class="dashboard-stat-card"
                    id="dashboard-arcanists-card"
                >

                    <div class="dashboard-stat-icon">
                        ♙
                    </div>

                    <div class="dashboard-stat-content">

                        <span class="dashboard-stat-label">
                            Arcanists
                        </span>

                        <strong>
                            ${arcanists.length}
                        </strong>

                    </div>

                    <span class="dashboard-stat-arrow">
                        →
                    </span>

                </button>


                <button
                    type="button"
                    class="dashboard-stat-card"
                    id="dashboard-status-effects-card"
                >

                    <div class="dashboard-stat-icon">
                        ◇
                    </div>

                    <div class="dashboard-stat-content">

                        <span class="dashboard-stat-label">
                            Status Effects
                        </span>

                        <strong>
                            ${statusEffects.length}
                        </strong>

                    </div>

                    <span class="dashboard-stat-arrow">
                        →
                    </span>

                </button>


                <div class="dashboard-stat-card dashboard-stat-card-static">

                    <div class="dashboard-stat-icon">
                        ✦
                    </div>

                    <div class="dashboard-stat-content">

                        <span class="dashboard-stat-label">
                            Skills Recorded
                        </span>

                        <strong>
                            ${countSkills(arcanists)}
                        </strong>

                    </div>

                </div>


                <div class="dashboard-stat-card dashboard-stat-card-static">

                    <div class="dashboard-stat-icon">
                        P
                    </div>

                    <div class="dashboard-stat-content">

                        <span class="dashboard-stat-label">
                            Portray Entries
                        </span>

                        <strong>
                            ${countPortray(arcanists)}
                        </strong>

                    </div>

                </div>

            </section>


            <section class="dashboard-grid">

                <div class="dashboard-panel">

                    <div class="dashboard-panel-header">

                        <div>

                            <h2>
                                Recent Arcanists
                            </h2>

                            <p>
                                Recently added Arcanist notes.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="secondary-button dashboard-view-button"
                            id="dashboard-view-arcanists"
                        >
                            View All
                        </button>

                    </div>


                    <div class="dashboard-recent-list">

                        ${renderRecentArcanists(
        recentArcanists
    )}

                    </div>

                </div>


                <div class="dashboard-panel">

                    <div class="dashboard-panel-header">

                        <div>

                            <h2>
                                Recent Status Effects
                            </h2>

                            <p>
                                Recently added Status Effects.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="secondary-button dashboard-view-button"
                            id="dashboard-view-status-effects"
                        >
                            View All
                        </button>

                    </div>


                    <div class="dashboard-recent-list">

                        ${renderRecentStatusEffects(
        recentStatusEffects
    )}

                    </div>

                </div>

            </section>

        </div>

    `;


    const arcanistsCard =
        container.querySelector(
            "#dashboard-arcanists-card"
        );


    const statusEffectsCard =
        container.querySelector(
            "#dashboard-status-effects-card"
        );


    const viewArcanistsButton =
        container.querySelector(
            "#dashboard-view-arcanists"
        );


    const viewStatusEffectsButton =
        container.querySelector(
            "#dashboard-view-status-effects"
        );


    const recentArcanistButtons =
        container.querySelectorAll(
            ".dashboard-recent-arcanist"
        );


    const recentStatusEffectButtons =
        container.querySelectorAll(
            ".dashboard-recent-status-effect"
        );


    arcanistsCard.addEventListener(
        "click",
        () => {

            window.location.hash =
                "arcanists";

        }
    );


    statusEffectsCard.addEventListener(
        "click",
        () => {

            window.location.hash =
                "status-effects";

        }
    );


    viewArcanistsButton.addEventListener(
        "click",
        () => {

            window.location.hash =
                "arcanists";

        }
    );


    viewStatusEffectsButton.addEventListener(
        "click",
        () => {

            window.location.hash =
                "status-effects";

        }
    );

    recentArcanistButtons.forEach(
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
                        () => {
                            renderDashboard(
                                container
                            );
                        }
                    );

                }
            );

        }
    );

    recentStatusEffectButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

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


                    const {
                        renderStatusEffectDetail
                    } = await import(
                        "./statusEffectDetail.js"
                    );


                    renderStatusEffectDetail(
                        container,
                        statusEffect,
                        () => {
                            renderDashboard(
                                container
                            );
                        }
                    );

                }
            );

        }
    );

}


function renderRecentArcanists(
    arcanists
) {

    if (
        arcanists.length === 0
    ) {

        return `
            <div class="dashboard-empty">

                <span>
                    ♙
                </span>

                <p>
                    No Arcanists recorded yet.
                </p>

            </div>
        `;

    }


    return arcanists
        .map(arcanist => `

            <button
                type="button"
                class="dashboard-recent-item dashboard-recent-button dashboard-recent-arcanist"
                data-id="${escapeHtml(
            arcanist.id
        )}"
            >

                <div class="dashboard-recent-main">

                    <strong>
                        ${escapeHtml(
            arcanist.name
        )}
                    </strong>


                    <span>

                        ${escapeHtml(
            arcanist.afflatus ||
            "No Afflatus"
        )}

                        •

                        ${escapeHtml(
            arcanist.damageType ||
            "No Damage Type"
        )}

                    </span>

                </div>


                <span class="dashboard-recent-arrow">
                    →
                </span>

            </button>

        `)
        .join("");
}


function renderRecentStatusEffects(
    statusEffects
) {

    if (
        statusEffects.length === 0
    ) {

        return `
            <div class="dashboard-empty">

                <span>
                    ◇
                </span>

                <p>
                    No Status Effects recorded yet.
                </p>

            </div>
        `;

    }


    return statusEffects
        .map(statusEffect => `

            <button
                type="button"
                class="dashboard-recent-item dashboard-recent-button dashboard-recent-status-effect"
                data-id="${escapeHtml(
            statusEffect.id
        )}"
            >

                <div class="dashboard-recent-main">

                    <strong>
                        ${escapeHtml(
            statusEffect.name
        )}
                    </strong>


                    <span>

                        ${statusEffect.duration
                ? escapeHtml(
                    statusEffect.duration
                )
                : "No duration specified"
            }

                    </span>

                </div>


                <span class="dashboard-recent-arrow">
                    →
                </span>

            </button>

        `)
        .join("");
}

function countSkills(
    arcanists
) {

    return arcanists.reduce(
        (
            total,
            arcanist
        ) => {

            if (
                !Array.isArray(
                    arcanist.skills
                )
            ) {
                return total;
            }

            return (
                total +
                arcanist.skills.length
            );

        },
        0
    );
}

function countPortray(
    arcanists
) {

    return arcanists.reduce(
        (
            total,
            arcanist
        ) => {

            if (
                !Array.isArray(
                    arcanist.portray
                )
            ) {
                return total;
            }

            return (
                total +
                arcanist.portray.length
            );

        },
        0
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