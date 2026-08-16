import { renderArcanistForm } from "./arcanistForm.js";


export function renderArcanistDetail(
    container,
    arcanist,
    onBack
) {

    container.innerHTML = `
        <div class="detail-page">

            <div class="detail-topbar">

                <button
                    class="secondary-button back-arcanist-button"
                    id="back-arcanist-button"
                >
                    ← Back to Arcanists
                </button>

            </div>


            <div class="detail-header">

                <div>

                    <h1>
                        ${escapeHtml(arcanist.name)}
                    </h1>

                    <p class="detail-meta">
                        ${escapeHtml(arcanist.afflatus)}
                        •
                        ${escapeHtml(arcanist.damageType)}
                    </p>

                </div>


                <button
                    class="primary-button"
                    id="edit-detail-arcanist-button"
                >
                    Edit Arcanist
                </button>

            </div>


            <section class="detail-section">

                <h2>Roles</h2>

                <div class="detail-tags">

                    ${(arcanist.roles || [])
            .map(role => `
                            <span class="tag">
                                ${escapeHtml(role)}
                            </span>
                        `)
            .join("")
        }

                </div>

            </section>


            <section class="detail-section">

                <h2>Skills</h2>

                <div class="detail-text">
                    ${formatText(arcanist.skills)}
                </div>

            </section>


            <section class="detail-section">

                <h2>Portray</h2>

                <div class="detail-text">
                    ${formatText(arcanist.portray)}
                </div>

            </section>


            <section class="detail-section">

                <h2>Mechanics</h2>

                <div class="detail-text">
                    ${formatText(arcanist.mechanics)}
                </div>

            </section>


            <section class="detail-section">

                <h2>Tags</h2>

                <div class="detail-tags">

                    ${(arcanist.tags || [])
            .map(tag => `
                            <span class="tag">
                                ${escapeHtml(tag)}
                            </span>
                        `)
            .join("")
        }

                </div>

            </section>


            <section class="detail-section">

                <h2>Notes</h2>

                <div class="detail-text">
                    ${formatText(arcanist.notes)}
                </div>

            </section>

        </div>
    `;


    const backButton =
        document.getElementById("back-arcanist-button");


    backButton.addEventListener(
        "click",
        () => onBack()
    );


    const editButton =
        document.getElementById(
            "edit-detail-arcanist-button"
        );


    editButton.addEventListener("click", () => {

        renderArcanistForm(
            container,

            () => {
                onBack();
            },

            () => {
                renderArcanistDetail(
                    container,
                    arcanist,
                    onBack
                );
            },

            arcanist
        );

    });

}


function formatText(value) {

    if (!value) {
        return `
            <p class="detail-empty">
                No information available.
            </p>
        `;
    }


    return escapeHtml(value)
        .replace(/\n/g, "<br>");
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