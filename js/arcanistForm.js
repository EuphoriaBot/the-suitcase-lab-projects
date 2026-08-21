import {
    createArcanist,
    updateArcanist
} from "./arcanistService.js";

import {
    getAllStatusEffects
} from "./statusEffectService.js";


export function renderArcanistForm(
    container,
    onSaved,
    onCancel,
    existingArcanist = null
) {

    const statusEffects =
        getAllStatusEffects();


    container.innerHTML = `
        <div class="form-page">

            <div class="form-intro">

                <div>

                    <div class="form-eyebrow">
                        ARCANIST NOTES
                    </div>

                    <h1>
                        ${existingArcanist
            ? "Edit Arcanist"
            : "Add Arcanist"
        }
                    </h1>

                    <p>
                        ${existingArcanist
            ? "Update this Arcanist's information and notes."
            : "Record information about a Reverse: 1999 Arcanist."
        }
                    </p>

                </div>

            </div>


            <form
                id="arcanist-form"
                class="arcanist-form"
            >

                <!-- Basic Information -->

                <section class="form-section">

                    <div class="form-section-heading">

                        <div>

                            <h2>Basic Information</h2>

                            <p>
                                Core information about this Arcanist.
                            </p>

                        </div>

                    </div>


                    <div class="form-group">

                        <label for="arcanist-name">
                            Name
                        </label>

                        <input
                            type="text"
                            id="arcanist-name"
                            name="name"
                            placeholder="e.g. Lucy"
                            value="${escapeHtml(
            existingArcanist?.name ?? ""
        )}"
                            required
                        >

                    </div>


                    <div class="form-row">

                        <div class="form-group">

                            <label for="arcanist-afflatus">
                                Afflatus
                            </label>

                            <input
                                type="text"
                                id="arcanist-afflatus"
                                name="afflatus"
                                placeholder="e.g. Star"
                                value="${escapeHtml(
            existingArcanist?.afflatus ?? ""
        )}"
                            >

                        </div>


                        <div class="form-group">

                            <label for="arcanist-damage-type">
                                Damage Type
                            </label>

                            <input
                                type="text"
                                id="arcanist-damage-type"
                                name="damageType"
                                placeholder="e.g. Reality"
                                value="${escapeHtml(
            existingArcanist?.damageType ?? ""
        )}"
                            >

                        </div>

                    </div>


                    <div class="form-group">

                        <label for="arcanist-roles">
                            Roles
                        </label>

                        <input
                            type="text"
                            id="arcanist-roles"
                            name="roles"
                            placeholder="e.g. DPS, Support, Control"
                            value="${escapeHtml(
            (
                existingArcanist?.roles ?? []
            ).join(", ")
        )}"
                        >

                        <small>
                            Separate multiple roles with commas.
                        </small>

                    </div>

                </section>


                <!-- Skills -->

                <section class="form-section">

                    <div class="form-section-heading">

                        <div>

                            <h2>Skills</h2>

                            <p>
                                Record the Arcanist's skills and abilities.
                            </p>

                        </div>

                    </div>


                    <div
                        id="skills-list"
                        class="repeatable-list"
                    >
                    </div>


                    <button
                        type="button"
                        class="secondary-button add-item-button"
                        id="add-skill-button"
                    >
                        + Add Skill
                    </button>

                </section>


                <!-- Portray -->

                <section class="form-section">

                    <div class="form-section-heading">

                        <div>

                            <h2>Portray</h2>

                            <p>
                                Record each Portray effect individually.
                            </p>

                        </div>

                    </div>


                    <div
                        id="portray-list"
                        class="repeatable-list"
                    >
                    </div>


                    <button
                        type="button"
                        class="secondary-button add-item-button"
                        id="add-portray-button"
                    >
                        + Add Portray
                    </button>

                </section>


                <!-- Mechanics -->

                <section class="form-section">

                    <div class="form-section-heading">

                        <div>

                            <h2>Mechanics</h2>

                            <p>
                                Record important mechanics specific to this Arcanist.
                            </p>

                        </div>

                    </div>


                    <div class="form-group">

                        <label for="arcanist-mechanics">
                            Mechanics Notes
                        </label>

                        <textarea
                            id="arcanist-mechanics"
                            name="mechanics"
                            rows="8"
                            placeholder="Record important mechanics, interactions, conditions, or behavior..."
                        >${escapeHtml(
            existingArcanist?.mechanics ?? ""
        )}</textarea>

                    </div>

                </section>


                <!-- Related Status Effects -->

                <section class="form-section">

                    <div class="form-section-heading">

                        <div>

                            <h2>Related Status Effects</h2>

                            <p>
                                Select status effects associated with this Arcanist.
                            </p>

                        </div>

                    </div>


                    <div class="relationship-list">

                        ${renderStatusEffectOptions(
            statusEffects,
            existingArcanist?.relatedStatusEffects ?? []
        )}

                    </div>

                </section>


                <!-- Additional Information -->

                <section class="form-section">

                    <div class="form-section-heading">

                        <div>

                            <h2>Additional Information</h2>

                            <p>
                                Add tags and personal notes.
                            </p>

                        </div>

                    </div>


                    <div class="form-group">

                        <label for="arcanist-tags">
                            Tags
                        </label>

                        <input
                            type="text"
                            id="arcanist-tags"
                            name="tags"
                            placeholder="e.g. Follow-up, Burn, Control"
                            value="${escapeHtml(
            (
                existingArcanist?.tags ?? []
            ).join(", ")
        )}"
                        >

                        <small>
                            Separate multiple tags with commas.
                        </small>

                    </div>


                    <div class="form-group">

                        <label for="arcanist-notes">
                            Notes
                        </label>

                        <textarea
                            id="arcanist-notes"
                            name="notes"
                            rows="8"
                            placeholder="Add your personal notes..."
                        >${escapeHtml(
            existingArcanist?.notes ?? ""
        )}</textarea>

                    </div>

                </section>


                <div class="form-actions">

                    <button
                        type="button"
                        id="cancel-arcanist-button"
                        class="secondary-button"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        class="primary-button"
                    >
                        ${existingArcanist
            ? "Save Changes"
            : "Save Arcanist"
        }
                    </button>

                </div>

            </form>

        </div>
    `;


    const skillsList =
        document.getElementById(
            "skills-list"
        );

    const portrayList =
        document.getElementById(
            "portray-list"
        );

    const addSkillButton =
        document.getElementById(
            "add-skill-button"
        );

    const addPortrayButton =
        document.getElementById(
            "add-portray-button"
        );

    const form =
        document.getElementById(
            "arcanist-form"
        );

    const cancelButton =
        document.getElementById(
            "cancel-arcanist-button"
        );


    renderSkills(
        skillsList,
        existingArcanist?.skills ?? []
    );


    renderPortray(
        portrayList,
        existingArcanist?.portray ?? []
    );


    addSkillButton.addEventListener(
        "click",
        () => {

            addSkill(
                skillsList
            );

            renumberSkills(
                skillsList
            );

        }
    );


    addPortrayButton.addEventListener(
        "click",
        () => {

            addPortray(
                portrayList
            );

            renumberPortray(
                portrayList
            );

        }
    );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(form);


            const arcanistData = {

                name:
                    formData
                        .get("name")
                        .trim(),

                afflatus:
                    formData
                        .get("afflatus")
                        .trim(),

                damageType:
                    formData
                        .get("damageType")
                        .trim(),

                roles:
                    parseList(
                        formData.get("roles")
                    ),

                skills:
                    collectSkills(
                        skillsList
                    ),

                portray:
                    collectPortray(
                        portrayList
                    ),

                mechanics:
                    formData
                        .get("mechanics")
                        .trim(),

                tags:
                    parseList(
                        formData.get("tags")
                    ),

                relatedStatusEffects:
                    getCheckedValues(
                        form,
                        "related-status-effect"
                    ),

                notes:
                    formData
                        .get("notes")
                        .trim()

            };


            if (existingArcanist) {

                const updatedArcanist =
                    updateArcanist(
                        existingArcanist.id,
                        arcanistData
                    );


                if (!updatedArcanist) {
                    return;
                }

            } else {

                createArcanist(
                    arcanistData
                );

            }


            onSaved();

        }
    );


    cancelButton.addEventListener(
        "click",
        () => onCancel()
    );

}


function renderSkills(
    container,
    skills
) {

    if (
        !Array.isArray(skills) ||
        skills.length === 0
    ) {

        addSkill(container);

        return;
    }


    skills.forEach(
        skill => addSkill(
            container,
            skill
        )
    );


    renumberSkills(container);

}


function addSkill(
    container,
    skill = {}
) {

    const item =
        document.createElement("div");


    item.className =
        "repeatable-item skill-form-item";


    item.innerHTML = `

        <div class="repeatable-item-header">

            <div class="repeatable-item-title">

                <span class="repeatable-item-index">
                    1
                </span>

                <strong>
                    Skill
                </strong>

            </div>


            <button
                type="button"
                class="danger-button remove-item-button"
            >
                Remove
            </button>

        </div>


        <div class="form-row">

            <div class="form-group">

                <label>
                    Name
                </label>

                <input
                    type="text"
                    class="skill-name"
                    placeholder="e.g. Reality Storm"
                    value="${escapeHtml(
        skill.name ?? ""
    )}"
                >

            </div>


            <div class="form-group">

                <label>
                    Type
                </label>

                <input
                    type="text"
                    class="skill-type"
                    placeholder="e.g. Attack"
                    value="${escapeHtml(
        skill.type ?? ""
    )}"
                >

            </div>

        </div>


        <div class="form-group">

            <label>
                Description
            </label>

            <textarea
                class="skill-description"
                rows="5"
                placeholder="Describe what the skill does..."
            >${escapeHtml(
        skill.description ?? ""
    )}</textarea>

        </div>

    `;


    item
        .querySelector(
            ".remove-item-button"
        )
        .addEventListener(
            "click",
            () => {

                item.remove();

                renumberSkills(
                    container
                );

            }
        );


    container.appendChild(item);

}


function renumberSkills(
    container
) {

    container
        .querySelectorAll(
            ".skill-form-item"
        )
        .forEach(
            (item, index) => {

                const number =
                    item.querySelector(
                        ".repeatable-item-index"
                    );


                if (number) {
                    number.textContent =
                        index + 1;
                }

            }
        );

}


function collectSkills(
    container
) {

    return Array.from(
        container.querySelectorAll(
            ".skill-form-item"
        )
    )
        .map(item => {

            const name =
                item
                    .querySelector(
                        ".skill-name"
                    )
                    ?.value
                    .trim() ?? "";

            const type =
                item
                    .querySelector(
                        ".skill-type"
                    )
                    ?.value
                    .trim() ?? "";

            const description =
                item
                    .querySelector(
                        ".skill-description"
                    )
                    ?.value
                    .trim() ?? "";


            return {
                name,
                type,
                description
            };

        })
        .filter(
            skill =>
                skill.name ||
                skill.type ||
                skill.description
        );

}


function renderPortray(
    container,
    portray
) {

    if (
        !Array.isArray(portray) ||
        portray.length === 0
    ) {

        addPortray(container);

        return;
    }


    portray.forEach(
        item =>
            addPortray(
                container,
                item
            )
    );


    renumberPortray(container);

}


function addPortray(
    container,
    portray = {}
) {

    const item =
        document.createElement("div");


    item.className =
        "repeatable-item portray-form-item";


    item.innerHTML = `

        <div class="repeatable-item-header">

            <div class="repeatable-item-title">

                <span class="repeatable-item-index">
                    1
                </span>

                <strong>
                    Portray
                </strong>

            </div>


            <button
                type="button"
                class="danger-button remove-item-button"
            >
                Remove
            </button>

        </div>


        <div class="form-group">

            <label>
                Level
            </label>

            <input
                type="number"
                class="portray-level"
                min="1"
                placeholder="e.g. 1"
                value="${escapeHtml(
        portray.level ?? ""
    )}"
            >

        </div>


        <div class="form-group">

            <label>
                Description
            </label>

            <textarea
                class="portray-description"
                rows="5"
                placeholder="Describe the Portray effect..."
            >${escapeHtml(
        portray.description ?? ""
    )}</textarea>

        </div>

    `;


    item
        .querySelector(
            ".remove-item-button"
        )
        .addEventListener(
            "click",
            () => {

                item.remove();

                renumberPortray(
                    container
                );

            }
        );


    container.appendChild(item);

}


function renumberPortray(
    container
) {

    container
        .querySelectorAll(
            ".portray-form-item"
        )
        .forEach(
            (item, index) => {

                const number =
                    item.querySelector(
                        ".repeatable-item-index"
                    );


                if (number) {
                    number.textContent =
                        index + 1;
                }

            }
        );

}


function collectPortray(
    container
) {

    return Array.from(
        container.querySelectorAll(
            ".portray-form-item"
        )
    )
        .map(item => {

            const levelValue =
                item
                    .querySelector(
                        ".portray-level"
                    )
                    ?.value
                    .trim() ?? "";

            const description =
                item
                    .querySelector(
                        ".portray-description"
                    )
                    ?.value
                    .trim() ?? "";


            return {

                level:
                    levelValue
                        ? Number(levelValue)
                        : null,

                description

            };

        })
        .filter(
            portray =>
                portray.level !== null ||
                portray.description
        );

}


function renderStatusEffectOptions(
    statusEffects,
    selectedIds
) {

    if (
        statusEffects.length === 0
    ) {

        return `
            <p class="detail-empty">
                No Status Effects available.
            </p>
        `;

    }


    return statusEffects
        .map(statusEffect => `

            <label class="relationship-item">

                <input
                    type="checkbox"
                    class="relationship-checkbox"
                    name="related-status-effect"
                    value="${escapeHtml(
            statusEffect.id
        )}"
                    ${selectedIds.includes(
            statusEffect.id
        )
                ? "checked"
                : ""
            }
                >

                <span>
                    ${escapeHtml(
                statusEffect.name
            )}
                </span>

            </label>

        `)
        .join("");

}


function getCheckedValues(
    form,
    name
) {

    return Array.from(
        form.querySelectorAll(
            `input[name="${name}"]:checked`
        )
    ).map(
        checkbox =>
            checkbox.value
    );

}


function parseList(value) {

    if (!value) {
        return [];
    }


    return value
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(
            item =>
                item.length > 0
        );

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