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
                    Manage and record your Reverse: 1999 Arcanist notes.
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
                placeholder="Search by name, role, tag, mechanic..."
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


            if (!keyword) {

                renderArcanistList(
                    arcanists,
                    container
                );

                return;
            }


            const filteredArcanists =
                arcanists.filter(
                    arcanist =>
                        matchesArcanistSearch(
                            arcanist,
                            keyword
                        )
                );


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
                        class="arcanist-card"
                    >

                        <div class="arcanist-card-content">

                            <div class="arcanist-card-header">

                                <div>

                                    <h2>

                                        <button
                                            class="arcanist-name-button"
                                            data-id="${escapeHtml(
                    arcanist.id
                )}"
                                        >
                                            ${escapeHtml(
                    arcanist.name
                )}
                                        </button>

                                    </h2>


                                    <p class="arcanist-meta">

                                        ${escapeHtml(
                    arcanist.afflatus ||
                    "Unknown Afflatus"
                )}

                                        <span>
                                            •
                                        </span>

                                        ${escapeHtml(
                    arcanist.damageType ||
                    "Unknown Damage Type"
                )}

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


                            <div class="arcanist-card-stats">

                                <span>
                                    ${skillCount}
                                    ${skillCount === 1
                        ? "Skill"
                        : "Skills"
                    }
                                </span>

                                <span>
                                    ${portrayCount}
                                    ${portrayCount === 1
                        ? "Portray"
                        : "Portray"
                    }
                                </span>

                                <span>
                                    ${statusEffectCount}
                                    ${statusEffectCount === 1
                        ? "Status Effect"
                        : "Status Effects"
                    }
                                </span>

                            </div>

                        </div>


                        <div class="arcanist-card-actions">

                            <button
                                class="secondary-button edit-arcanist-button"
                                data-id="${escapeHtml(
                        arcanist.id
                    )}"
                            >
                                Edit
                            </button>


                            <button
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


    nameButtons.forEach(
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