import { renderArcanistForm } from "./arcanistForm.js";
import { getAllStatusEffects } from "./statusEffectService.js";
import { getAllArcanists } from "./arcanistService.js";

export function renderArcanistDetail(
    container,
    arcanist,
    onBack
) {

    const statusEffects =
        getAllStatusEffects();

    const relatedStatusEffects =
        statusEffects.filter(
            statusEffect =>
                (
                    arcanist.relatedStatusEffects || []
                ).includes(statusEffect.id)
        );


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


            <div class="detail-hero">
                <div class="detail-hero-image">
                    ${arcanist.image
            ? `
                                <img
                                    src="${escapeHtml(
                arcanist.image
            )}"
                                    alt="${escapeHtml(
                arcanist.name
            )}"
                                    class="detail-character-image"
                                >
                            `
            : `
                                <div class="detail-character-placeholder">

                                    <span>
                                        ${escapeHtml(
                getInitials(
                    arcanist.name
                )
            )}
                                    </span>

                                </div>
                            `
        }

                </div>

                <div class="detail-hero-content">

                    <div class="detail-eyebrow">
                        ARCANIST
                    </div>


                    <h1>
                        ${escapeHtml(
            arcanist.name
        )}
                    </h1>


                    <div class="detail-meta-row">

                        <span class="detail-meta-badge">
                            ${escapeHtml(
            arcanist.afflatus ||
            "Unknown Afflatus"
        )}
                        </span>


                        <span class="detail-meta-badge">
                            ${escapeHtml(
            arcanist.damageType ||
            "Unknown Damage"
        )}
                        </span>

                    </div>


                    <div class="detail-tags detail-hero-tags">

                        ${renderTags(
            arcanist.roles,
            "No roles."
        )}

                    </div>


                    <div class="detail-hero-actions">

                        <button
                            type="button"
                            class="secondary-button"
                            id="edit-detail-arcanist-button"
                        >
                            Edit Arcanist
                        </button>
                    </div>
                </div>
            </div>

            <nav
                class="detail-section-nav"
                aria-label="Arcanist sections"
                >

                <button
                    type="button"
                    class="detail-section-nav-item active"
                    data-target="skills-section"
                >
                    Skills
                </button>


                <button
                    type="button"
                    class="detail-section-nav-item"
                    data-target="mechanics-section"
                >
                    Mechanics
                </button>


                <button
                    type="button"
                    class="detail-section-nav-item"
                    data-target="status-effects-section"
                >
                    Status Effects
                </button>


                <button
                    type="button"
                    class="detail-section-nav-item"
                    data-target="portray-section"
                >
                    Portray
                </button>


                <button
                    type="button"
                    class="detail-section-nav-item"
                    data-target="tags-section"
                >
                    Tags
                </button>


                <button
                    type="button"
                    class="detail-section-nav-item"
                    data-target="notes-section"
                >
                    Notes
                </button>

            </nav>

            <section
                class="detail-section"
                id="skills-section"
            >
                <div class="detail-section-heading">

                    <div>
                        <h2>Skills</h2>

                        <p>
                            Skills and abilities of this Arcanist.
                        </p>
                    </div>

                </div>

                ${renderSkills(arcanist.skills)}

            </section>

            <section
                class="detail-section"
                id="portray-section"
            >

                <div class="detail-section-heading">

                    <div>
                        <h2>Portray</h2>

                        <p>
                            Portray effects and upgrades.
                        </p>
                    </div>

                </div>

                ${renderPortray(arcanist.portray)}

            </section>

            <section
                class="detail-section"
                id="mechanics-section"
            >

                <div class="detail-section-heading">

                    <div>
                        <h2>Mechanics</h2>

                        <p>
                            Important mechanics and behavior.
                        </p>
                    </div>

                </div>

                <div class="detail-note">

                    ${formatText(arcanist.mechanics)}

                </div>

            </section>


            <section
                class="detail-section"
                id="status-effects-section"
            >

                <div class="detail-section-heading">

                    <div>
                        <h2>Related Status Effects</h2>

                        <p>
                            Status effects associated with this Arcanist.
                        </p>
                    </div>

                </div>

                ${renderRelatedStatusEffects(
            relatedStatusEffects
        )}

            </section>

            <section
                class="detail-section"
                id="tags-section"
            >
                <div class="detail-section-heading">

                    <div>
                        <h2>Tags</h2>

                        <p>
                            Useful keywords for this Arcanist.
                        </p>
                    </div>

                </div>

                <div class="detail-tags">

                    ${renderTags(
            arcanist.tags,
            "No tags."
        )}

                </div>

            </section>


            <section
                class="detail-section"
                id="notes-section"
            >
                <div class="detail-section-heading">

                    <div>
                        <h2>Notes</h2>

                        <p>
                            Personal notes and additional information.
                        </p>
                    </div>

                </div>

                <div class="detail-note">

                    ${formatText(arcanist.notes)}

                </div>

            </section>

        </div>
    `;


    const backButton =
        document.getElementById(
            "back-arcanist-button"
        );

    const editButton =
        document.getElementById(
            "edit-detail-arcanist-button"
        );


    const relatedStatusEffectButtons =
        document.querySelectorAll(
            ".related-status-effect-button"
        );


    relatedStatusEffectButtons.forEach(
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
                        onBack
                    );

                }
            );

        }
    );

    backButton.addEventListener(
        "click",
        () => onBack()
    );


    editButton.addEventListener(
        "click",
        () => {

            renderArcanistForm(

                container,

                () => {

                    const updatedArcanist =
                        getAllArcanists().find(
                            item =>
                                item.id === arcanist.id
                        );


                    if (!updatedArcanist) {
                        onBack();
                        return;
                    }


                    renderArcanistDetail(
                        container,
                        updatedArcanist,
                        onBack
                    );

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

        }
    );

    const sectionNavItems =
        document.querySelectorAll(
            ".detail-section-nav-item"
        );


    const detailSections =
        document.querySelectorAll(
            ".detail-section"
        );

    sectionNavItems.forEach(
        navItem => {

            navItem.addEventListener(
                "click",
                () => {

                    const targetId =
                        navItem.dataset.target;


                    const targetSection =
                        document.getElementById(
                            targetId
                        );


                    if (!targetSection) {
                        return;
                    }


                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        sectionNavItems.forEach(
                            item => {

                                item.classList.toggle(
                                    "active",
                                    item.dataset.target ===
                                    entry.target.id
                                );

                            }
                        );

                    }
                );

            },
            {
                threshold: 0.25,
                rootMargin:
                    "-120px 0px -55% 0px"
            }
        );


    detailSections.forEach(
        section => {

            sectionObserver.observe(
                section
            );

        }
    );

}


function renderSkills(skills) {

    if (
        !Array.isArray(skills) ||
        skills.length === 0
    ) {

        return `
            <div class="detail-empty-block">

                <p class="detail-empty">
                    No skills available.
                </p>

            </div>
        `;

    }


    return `
        <div class="detail-repeatable-list skill-list">

            ${skills
            .map(
                (skill, index) => `

                        <article
                            class="detail-repeatable-item skill-detail-card"
                        >

                            <div class="skill-detail-header">

                                <div class="detail-item-title">

                                    <span
                                        class="detail-item-number"
                                    >
                                        ${index + 1}
                                    </span>


                                    <div class="skill-detail-heading">

                                        <h3>
                                            ${escapeHtml(
                    skill.name ||
                    "Unnamed Skill"
                )}
                                        </h3>

                                    </div>

                                </div>


                                ${skill.type
                        ? `
                                            <span
                                                class="skill-type-badge"
                                            >
                                                ${escapeHtml(
                            skill.type
                        )}
                                            </span>
                                        `
                        : ""
                    }

                            </div>


                            <div class="skill-detail-description">

                                ${formatText(
                        skill.description
                    )}

                            </div>

                        </article>

                    `
            )
            .join("")
        }

        </div>
    `;

}


function renderPortray(portray) {

    if (
        !Array.isArray(portray) ||
        portray.length === 0
    ) {

        return `
            <p class="detail-empty">
                No Portray information available.
            </p>
        `;

    }


    return `
        <div class="detail-repeatable-list">

            ${portray
            .map(item => `

                    <article
                        class="detail-repeatable-item portray-detail-card"
                    >

                        <div class="detail-repeatable-header">

                            <div class="detail-item-title">

                                <span class="portray-level">
                                    P${escapeHtml(
                item.level
            )}
                                </span>

                                <h3>
                                    Portray ${escapeHtml(
                item.level
            )}
                                </h3>

                            </div>

                        </div>


                        <div class="detail-text">

                            ${formatText(
                item.description
            )}

                        </div>

                    </article>

                `)
            .join("")
        }

        </div>
    `;

}


function renderRelatedStatusEffects(
    statusEffects
) {

    if (
        !statusEffects ||
        statusEffects.length === 0
    ) {

        return `
            <p class="detail-empty">
                No related Status Effects.
            </p>
        `;

    }


    return `
        <div class="related-item-list">

            ${statusEffects
            .map(statusEffect => `

                    <button
                        type="button"
                        class="related-item-button related-status-effect-button"
                        data-id="${escapeHtml(
                statusEffect.id
            )}"
                    >

                        <span>
                            ${escapeHtml(
                statusEffect.name
            )}
                        </span>

                        <span class="related-item-arrow">
                            →
                        </span>

                    </button>

                `)
            .join("")
        }

        </div>
    `;

}


function renderTags(
    tags,
    emptyMessage
) {

    if (
        !Array.isArray(tags) ||
        tags.length === 0
    ) {

        return `
            <p class="detail-empty">
                ${escapeHtml(
            emptyMessage
        )}
            </p>
        `;

    }


    return tags
        .map(tag => `
            <span class="tag">
                ${escapeHtml(tag)}
            </span>
        `)
        .join("");

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