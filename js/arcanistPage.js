import { renderArcanistForm } from "./arcanistForm.js";
import { renderArcanistDetail } from "./arcanistDetail.js";

import {
    getAllArcanists,
    deleteArcanist
} from "./arcanistService.js";


export function renderArcanistsPage(
    container
) {

    const arcanists =
        getAllArcanists();


    container.innerHTML = `
        <div class="page-header">

            <div>

                <div class="page-eyebrow">
                    DATABASE
                </div>

                <h1>
                    Arcanists
                </h1>

                <p class="page-description">
                    Browse and manage your Reverse: 1999 Arcanist notes.
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
            class="arcanist-grid"
        >
        </div>
    `;


    renderArcanistList(
        arcanists,
        container
    );


    const searchInput =
        document.getElementById(
            "arcanist-search"
        );


    const addButton =
        document.getElementById(
            "add-arcanist-button"
        );


    addButton.addEventListener(
        "click",
        () => {

            renderArcanistForm(

                container,

                () => {
                    renderArcanistsPage(
                        container
                    );
                },

                () => {
                    renderArcanistsPage(
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


            const filteredArcanists =
                keyword
                    ? arcanists.filter(
                        arcanist =>
                            matchesArcanistSearch(
                                arcanist,
                                keyword
                            )
                    )
                    : arcanists;


            renderArcanistList(
                filteredArcanists,
                container
            );

        }
    );

}


function renderArcanistList(
    arcanists,
    container
) {

    const listContainer =
        document.getElementById(
            "arcanist-list"
        );


    if (!listContainer) {
        return;
    }


    if (arcanists.length === 0) {

        listContainer.innerHTML = `
            <div class="empty-state">

                <h2>
                    No Arcanists Found
                </h2>

                <p>
                    There are no Arcanists matching your search.
                </p>

            </div>
        `;

        return;
    }


    listContainer.innerHTML =
        arcanists
            .map(arcanist => {

                const skillCount =
                    Array.isArray(
                        arcanist.skills
                    )
                        ? arcanist.skills.length
                        : 0;


                const portrayCount =
                    Array.isArray(
                        arcanist.portray
                    )
                        ? arcanist.portray.length
                        : 0;


                const statusEffectCount =
                    Array.isArray(
                        arcanist.relatedStatusEffects
                    )
                        ? arcanist.relatedStatusEffects.length
                        : 0;


                return `

                    <article
                        class="arcanist-gallery-card"
                        data-id="${escapeHtml(
                    arcanist.id
                )}"
                    >

                        <button
                            type="button"
                            class="arcanist-card-main"
                            data-id="${escapeHtml(
                    arcanist.id
                )}"
                        >

                            <div class="arcanist-image-container">
                                ${arcanist.image
                        ? `
                                            <img
                                                src="${escapeHtml(arcanist.image)}"
                                                alt="${escapeHtml(arcanist.name)}"
                                                class="arcanist-card-image"
                                            >
                                        `
                        : `
                                            <div class="arcanist-image-placeholder">
                                                <span>
                                                    ${escapeHtml(
                            getInitials(arcanist.name)
                        )}
                                                </span>
                                            </div>
                                        `
                    }
                            </div>


                            <div class="arcanist-gallery-info">

                                <h2>
                                    ${escapeHtml(
                        arcanist.name
                    )}
                                </h2>


                                <p class="arcanist-gallery-meta">

                                    ${escapeHtml(
                        arcanist.afflatus ||
                        "Unknown"
                    )}

                                    <span>
                                        •
                                    </span>

                                    ${escapeHtml(
                        arcanist.damageType ||
                        "Unknown"
                    )}

                                </p>


                                <div class="arcanist-gallery-tags">

                                    ${(arcanist.roles || [])
                        .map(role => `
                                            <span class="tag">
                                                ${escapeHtml(
                            role
                        )}
                                            </span>
                                        `)
                        .join("")
                    }

                                </div>


                                <div class="arcanist-gallery-stats">

                                    <span>
                                        ${skillCount}
                                        Skills
                                    </span>

                                    <span>
                                        ${portrayCount}
                                        Portray
                                    </span>

                                    <span>
                                        ${statusEffectCount}
                                        Effects
                                    </span>

                                </div>

                            </div>

                        </button>


                        <div
                            class="arcanist-gallery-actions"
                        >

                            <button
                                type="button"
                                class="secondary-button edit-arcanist-button"
                                data-id="${escapeHtml(
                        arcanist.id
                    )}"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="danger-button delete-arcanist-button"
                                data-id="${escapeHtml(
                        arcanist.id
                    )}"
                            >
                                Delete
                            </button>

                        </div>

                    </article>

                `;

            })
            .join("");


    const cardButtons =
        listContainer.querySelectorAll(
            ".arcanist-card-main"
        );


    const editButtons =
        listContainer.querySelectorAll(
            ".edit-arcanist-button"
        );


    const deleteButtons =
        listContainer.querySelectorAll(
            ".delete-arcanist-button"
        );


    cardButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

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


                    renderArcanistDetail(
                        container,
                        arcanist,
                        () => {
                            renderArcanistsPage(
                                container
                            );
                        }
                    );

                }
            );

        }
    );


    editButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

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


                    renderArcanistForm(

                        container,

                        () => {
                            renderArcanistsPage(
                                container
                            );
                        },

                        () => {
                            renderArcanistsPage(
                                container
                            );
                        },

                        arcanist

                    );

                }
            );

        }
    );


    deleteButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

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


                    const confirmed =
                        window.confirm(
                            `Delete "${arcanist.name}"?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    deleteArcanist(id);


                    renderArcanistsPage(
                        container
                    );

                }
            );

        }
    );

}


function matchesArcanistSearch(
    arcanist,
    keyword
) {

    const searchableText = [

        arcanist.name,

        arcanist.afflatus,

        arcanist.damageType,

        ...(arcanist.roles || []),

        arcanist.mechanics,

        arcanist.notes,

        ...(arcanist.tags || []),

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


function getInitials(name) {

    if (!name) {
        return "?";
    }


    const parts =
        String(name)
            .trim()
            .split(/\s+/);


    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

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