import { arcanists } from "./data/arcanists.js";
import { statusEffects } from "./data/statusEffects.js";
import { renderArcanistsPage } from "./js/arcanistPage.js";
import { renderStatusEffectsPage } from "./js/statusEffectsPage.js";

const pageContent = document.getElementById("page-content");
const navItems = document.querySelectorAll(".nav-item");

const pages = {
    dashboard: {
        title: "Dashboard",
        content: `
            <div class="welcome-card">
                <h3>
                    Welcome to Reverse: 1999 Notes
                </h3>
                <p>
                    Your personal knowledge base for
                    Reverse: 1999 Arcanists,
                    Status Effects, and game information.
                </p>
            </div>
        `
    },

    arcanists: {
        title: "Arcanists",
        content: ""
    },

    "status-effects": {
        title: "Status Effects",
        content: ""
    },

    favorites: {
        title: "Favorites",
        content: `
            <div class="welcome-card">
                <h3>
                    Favorites
                </h3>
                <p>
                    Your favorite notes will appear here.
                </p>
            </div>
        `
    },

    settings: {
        title: "Settings",
        content: `
            <div class="welcome-card">
                <h3>
                    Settings
                </h3>

                <p>
                    Application settings will appear here.
                </p>
            </div>
        `
    }
};

function navigateTo(pageName) {
    const page = pages[pageName];
    if (!page) {
        navigateTo("dashboard");
        return;
    }

    updatePageTitle(page.title);
    updateActiveNavigation(pageName);

    if (pageName === "arcanists") {
        renderArcanistsPage(pageContent);
        return;
    }

    if (pageName === "status-effects") {
        renderStatusEffectsPage(pageContent);
        return;
    }
    pageContent.innerHTML = page.content;
}

function updatePageTitle(title) {
    const topbarTitle = document.querySelector(".topbar h2");
    topbarTitle.textContent = title;
}

function updateActiveNavigation(
    pageName
) {
    navItems.forEach(item => {
        const itemPage = item.dataset.page;
        item.classList.toggle(
            "active",
            itemPage === pageName
        );
    });
}

function getCurrentPage() {
    const hash = window.location.hash.substring(1);
    return hash || "dashboard";

}

navItems.forEach(item => {
    item.addEventListener(
        "click",
        () => {
            const pageName = item.dataset.page;
            navigateTo(pageName);
        }
    );
});

window.addEventListener(
    "hashchange",
    () => {
        navigateTo(
            getCurrentPage()
        );
    }
);

navigateTo(
    getCurrentPage()
);

console.log(
    "Reverse: 1999 Notes application loaded."
);

console.log(
    "Arcanists:",
    arcanists
);

console.log(
    "Status Effects:",
    statusEffects
);

console.log(
    "Total Arcanists:",
    arcanists.length
);

console.log(
    "Total Status Effects:",
    statusEffects.length
);