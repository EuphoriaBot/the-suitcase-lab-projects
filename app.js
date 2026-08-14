const pageContent = document.getElementById("page-content");
const navItems = document.querySelectorAll(".nav-item");


const pages = {

    dashboard: {
        title: "Dashboard",
        content: `
            <div class="welcome-card">
                <h3>Welcome to Reverse: 1999 Notes</h3>

                <p>
                    Your personal knowledge base for
                    Reverse: 1999 mechanics, Arcanists,
                    enemies, and game systems.
                </p>
            </div>
        `
    },

    arcanists: {
        title: "Arcanists",
        content: `
            <div class="welcome-card">
                <h3>Arcanists</h3>

                <p>
                    Information about Reverse: 1999 Arcanists
                    will appear here.
                </p>
            </div>
        `
    },

    mechanics: {
        title: "Mechanics",
        content: `
            <div class="welcome-card">
                <h3>Mechanics</h3>

                <p>
                    Game mechanics and rules will appear here.
                </p>
            </div>
        `
    },

    "status-effects": {
        title: "Status Effects",
        content: `
            <div class="welcome-card">
                <h3>Status Effects</h3>

                <p>
                    Status effects and their mechanics
                    will appear here.
                </p>
            </div>
        `
    },

    favorites: {
        title: "Favorites",
        content: `
            <div class="welcome-card">
                <h3>Favorites</h3>

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
                <h3>Settings</h3>

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

    pageContent.innerHTML = page.content;

    updatePageTitle(page.title);

    updateActiveNavigation(pageName);
}


function updatePageTitle(title) {

    const topbarTitle = document.querySelector(".topbar h2");

    topbarTitle.textContent = title;
}


function updateActiveNavigation(pageName) {

    navItems.forEach((item) => {

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


navItems.forEach((item) => {

    item.addEventListener("click", () => {

        const pageName = item.dataset.page;

        navigateTo(pageName);

    });

});


window.addEventListener("hashchange", () => {

    navigateTo(getCurrentPage());

});


navigateTo(getCurrentPage());

console.log("Reverse: 1999 Notes application loaded.");