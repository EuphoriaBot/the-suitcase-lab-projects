import { renderArcanistsPage } from "./js/arcanistPage.js";
import { renderStatusEffectsPage } from "./js/statusEffectsPage.js";
import { renderDashboard } from "./js/dashboardPage.js";

const pageContent =
    document.getElementById("page-content");

const navItems =
    document.querySelectorAll(".nav-item");

const pages = {

    dashboard: {
        title: "Dashboard"
    },


    arcanists: {
        title: "Arcanists"
    },


    "status-effects": {
        title: "Status Effects"
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