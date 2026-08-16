import {
    getAllMechanics
} from "./mechanicService.js";


export function renderMechanicsPage(container) {

    const mechanics = getAllMechanics();


    container.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Mechanics</h1>

                <p class="page-description">
                    Record and review Reverse: 1999 game mechanics.
                </p>
            </div>


            <button
                class="primary-button"
                id="add-mechanic-button"
            >
                + Add Mechanic
            </button>

        </div>


        <div class="search-container">

            <input
                type="text"
                id="mechanic-search"
                class="search-input"
                placeholder="Search Mechanics..."
            >

        </div>


        <div
            id="mechanic-list"
            class="mechanic-list"
        >
        </div>
    `;


    renderMechanicList(
        mechanics,
        container
    );


    const searchInput =
        document.getElementById("mechanic-search");


    const addButton =
        document.getElementById("add-mechanic-button");


    addButton.addEventListener(
        "click",
        () => {
            console.log(
                "Add Mechanic clicked."
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


            const filteredMechanics =
                mechanics.filter(mechanic =>
                    mechanic.name
                        .toLowerCase()
                        .includes(keyword)
                );


            renderMechanicList(
                filteredMechanics,
                container
            );

        }
    );

}


function renderMechanicList(
    mechanics,
    container
) {

    const listContainer =
        document.getElementById("mechanic-list");


    if (!listContainer) {
        return;
    }


    if (mechanics.length === 0) {

        listContainer.innerHTML = `
            <div class="empty-state">

                <h2>No Mechanics Found</h2>

                <p>
                    There are no Mechanics to display.
                </p>

            </div>
        `;

        return;
    }


    listContainer.innerHTML =
        mechanics.map(mechanic => `

            <article class="mechanic-card">

                <div class="mechanic-card-content">

                    <div class="mechanic-card-header">

                        <div>

                            <h2>
                                <button
                                    class="mechanic-name-button"
                                    data-id="${mechanic.id}"
                                >
                                    ${escapeHtml(mechanic.name)}
                                </button>
                            </h2>


                            <p class="mechanic-meta">
                                ${escapeHtml(mechanic.category)}
                            </p>

                        </div>

                    </div>


                    <p class="mechanic-summary">
                        ${escapeHtml(
            mechanic.shortDescription
        )}
                    </p>


                    <div class="mechanic-tags">

                        ${(mechanic.tags || [])
                .map(tag => `
                                <span class="tag">
                                    ${escapeHtml(tag)}
                                </span>
                            `)
                .join("")
            }

                    </div>

                </div>

            </article>

        `).join("");

}


function escapeHtml(value) {

    if (value === undefined || value === null) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}