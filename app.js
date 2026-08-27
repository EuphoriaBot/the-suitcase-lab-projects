import { renderArcanistsPage } from "./js/arcanistPage.js";
import { renderStatusEffectsPage } from "./js/statusEffectsPage.js";

import {
    getAllArcanists
} from "./js/arcanistService.js";

import {
    getAllStatusEffects
} from "./js/statusEffectService.js";


const pageContent =
    document.getElementById("page-content");

const navItems =
    document.querySelectorAll(".nav-item");


const pages = {

    dashboard: {
        title: "Dashboard",
        content: ""
    },


    arcanists: {
        title: "Arcanists",
        content: ""
    },


    "status-effects": {
        title: "Status Effects",
        content: ""
    }
};


function navigateTo(pageName) {

    const page =
        pages[pageName];


    if (!page) {

        navigateTo("dashboard");

        return;
    }


    updatePageTitle(
        page.title
    );


    updateActiveNavigation(
        pageName
    );


    if (pageName === "dashboard") {

        renderDashboard(
            pageContent
        );

        return;
    }


    if (pageName === "arcanists") {

        renderArcanistsPage(
            pageContent
        );

        return;
    }


    if (pageName === "status-effects") {

        renderStatusEffectsPage(
            pageContent
        );

        return;
    }


    pageContent.innerHTML =
        page.content;

}


function renderDashboard(
    container
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


    document
        .getElementById(
            "dashboard-arcanists-card"
        )
        .addEventListener(
            "click",
            () => {
                navigateTo("arcanists");
                window.location.hash =
                    "arcanists";
            }
        );


    document
        .getElementById(
            "dashboard-status-effects-card"
        )
        .addEventListener(
            "click",
            () => {
                navigateTo("status-effects");
                window.location.hash =
                    "status-effects";
            }
        );


    document
        .getElementById(
            "dashboard-view-arcanists"
        )
        .addEventListener(
            "click",
            () => {
                window.location.hash =
                    "arcanists";
            }
        );


    document
        .getElementById(
            "dashboard-view-status-effects"
        )
        .addEventListener(
            "click",
            () => {
                window.location.hash =
                    "status-effects";
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
                <span>♙</span>

                <p>
                    No Arcanists recorded yet.
                </p>
            </div>
        `;

    }


    return arcanists
        .map(arcanist => `

            <div class="dashboard-recent-item">

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

            </div>

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
                <span>◇</span>

                <p>
                    No Status Effects recorded yet.
                </p>
            </div>
        `;

    }


    return statusEffects
        .map(statusEffect => `

            <div class="dashboard-recent-item">

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

            </div>

        `)
        .join("");

}


function updatePageTitle(
    title
) {

    const topbarTitle =
        document.querySelector(
            ".topbar h2"
        );


    topbarTitle.textContent =
        title;

}


function updateActiveNavigation(
    pageName
) {

    navItems.forEach(
        item => {

            const itemPage =
                item.dataset.page;


            item.classList.toggle(
                "active",
                itemPage === pageName
            );

        }
    );

}


function getCurrentPage() {

    const hash =
        window.location.hash.substring(1);


    return hash || "dashboard";

}


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const pageName =
                    item.dataset.page;


                navigateTo(
                    pageName
                );

            }
        );

    }
);


window.addEventListener(
    "hashchange",
    () => {

        navigateTo(
            getCurrentPage()
        );

    }
);


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


navigateTo(
    getCurrentPage()
);