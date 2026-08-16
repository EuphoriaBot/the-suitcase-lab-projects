import { renderArcanistForm } from "./arcanistForm.js";
import { renderArcanistDetail } from "./arcanistDetail.js";

import {
    getAllArcanists,
    deleteArcanist
} from "./arcanistService.js";


export function renderArcanistsPage(container) {

    const arcanists = getAllArcanists();


    container.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Arcanists</h1>

                <p class="page-description">
                    Manage and record Reverse: 1999 Arcanists.
                </p>
            </div>


            <button
                class="primary-button"
                id="add-arcanist-button"
            >
                + Add Arcanist
            </button>

        </div>


        <div class="search-container">

            <input
                type="text"
                id="arcanist-search"
                class="search-input"
                placeholder="Search Arcanists..."
            >

        </div>


        <div
            id="arcanist-list"
            class="arcanist-list"
        >
        </div>
    `;


    renderArcanistList(
        arcanists,
        container
    );


    const searchInput =
        document.getElementById("arcanist-search");


    const addButton =
        document.getElementById("add-arcanist-button");


    addButton.addEventListener("click", () => {

        renderArcanistForm(

            container,

            () => {
                renderArcanistsPage(container);
            },

            () => {
                renderArcanistsPage(container);
            }

        );

    });


    searchInput.addEventListener("input", () => {

        const keyword =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredArcanists =
            arcanists.filter(arcanist =>
                arcanist.name
                    .toLowerCase()
                    .includes(keyword)
            );


        renderArcanistList(
            filteredArcanists,
            container
        );

    });

}


function renderArcanistList(
    arcanists,
    container
) {

    const listContainer =
        document.getElementById("arcanist-list");


    if (!listContainer) {
        return;
    }


    if (arcanists.length === 0) {

        listContainer.innerHTML = `
            <div class="empty-state">

                <h2>No Arcanists Found</h2>

                <p>
                    There are no Arcanists to display.
                </p>

            </div>
        `;

        return;
    }

    listContainer.innerHTML =
        arcanists.map(arcanist => `

            <article class="arcanist-card">

                <div class="arcanist-card-content">

                    <div class="arcanist-card-header">

                        <div>

                            <h2>
                                <button
                                    class="arcanist-name-button"
                                    data-id="${arcanist.id}"
                                >
                                    ${escapeHtml(arcanist.name)}
                                </button>
                            </h2>

                            <p class="arcanist-meta">
                                ${escapeHtml(arcanist.afflatus)}
                                •
                                ${escapeHtml(arcanist.damageType)}
                            </p>

                        </div>

                    </div>


                    <div class="arcanist-tags">

                        ${(arcanist.roles || [])
                .map(role => `
                                <span class="tag">
                                    ${escapeHtml(role)}
                                </span>
                            `)
                .join("")
            }

                    </div>

                </div>


                <div class="arcanist-card-actions">

                    <button
                        class="secondary-button edit-arcanist-button"
                        data-id="${arcanist.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="danger-button delete-arcanist-button"
                        data-id="${arcanist.id}"
                    >
                        Delete
                    </button>

                </div>

            </article>

        `).join("");

    const editButtons =
        listContainer.querySelectorAll(
            ".edit-arcanist-button"
        );

    const nameButtons =
        listContainer.querySelectorAll(
            ".arcanist-name-button"
        );

    const deleteButtons =
        listContainer.querySelectorAll(
            ".delete-arcanist-button"
        );

    nameButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                button.dataset.id;


            const arcanist =
                getAllArcanists().find(
                    item => item.id === id
                );


            if (!arcanist) {
                return;
            }


            renderArcanistDetail(
                container,
                arcanist,
                () => {
                    renderArcanistsPage(container);
                }
            );

        });

    });

    editButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                button.dataset.id;


            const arcanist =
                getAllArcanists().find(
                    item => item.id === id
                );


            if (!arcanist) {
                return;
            }


            renderArcanistForm(

                container,

                () => {
                    renderArcanistsPage(container);
                },

                () => {
                    renderArcanistsPage(container);
                },

                arcanist

            );

        });

    });


    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                button.dataset.id;


            const arcanist =
                getAllArcanists().find(
                    item => item.id === id
                );


            if (!arcanist) {
                return;
            }


            const confirmed =
                window.confirm(
                    `Delete "${arcanist.name}"?`
                );


            if (!confirmed) {
                return;
            }


            deleteArcanist(id);


            renderArcanistsPage(container);

        });

    });

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