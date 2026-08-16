import {
    createArcanist,
    updateArcanist
} from "./arcanistService.js";


export function renderArcanistForm(
    container,
    onSaved,
    onCancel,
    existingArcanist = null
) {
    container.innerHTML = `
        <div class="form-page">

            <div class="page-header">
                <div>
                    <h1>
                        ${existingArcanist ? "Edit Arcanist" : "Add Arcanist"}
                    </h1>

                    <p class="page-description">
                        ${existingArcanist ? "Update this Arcanist's information" : "Add a new Reverse: 1999 Arcanist to your notes"}
                    </p>
                </div>
            </div>


            <form id="arcanist-form" class="arcanist-form">

                <div class="form-section">

                    <h2>Basic Information</h2>

                    <div class="form-group">
                        <label for="arcanist-name">
                            Name
                        </label>

                        <input
                            type="text"
                            id="arcanist-name"
                            name="name"
                            placeholder="e.g. Lucy"
                            value="${escapeHtml(existingArcanist?.name ?? "")}"
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
                                value="${escapeHtml(existingArcanist?.afflatus ?? "")}"
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
                                value="${escapeHtml(existingArcanist?.damageType ?? "")}"
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
                            placeholder="e.g. DPS, Support"
                            value="${escapeHtml((existingArcanist?.roles ?? []).join(", "))}"
                        >

                        <small>
                            Separate multiple roles with commas.
                        </small>
                    </div>

                </div>


                <div class="form-section">

                    <h2>Skills</h2>

                    <div class="form-group">
                        <label for="arcanist-skills">
                            Skills
                        </label>

                        <textarea
                            id="arcanist-skills"
                            name="skills"
                            rows="5"
                            placeholder="Record the Arcanist's skills..."
                        >${escapeHtml(existingArcanist?.skills ?? "")}</textarea>
                    </div>

                </div>


                <div class="form-section">

                    <h2>Portray</h2>

                    <div class="form-group">
                        <label for="arcanist-portray">
                            Portray
                        </label>

                        <textarea
                            id="arcanist-portray"
                            name="portray"
                            rows="5"
                            placeholder="Record Portray effects..."
                        >${escapeHtml(existingArcanist?.portray ?? "")}</textarea>
                    </div>

                </div>


                <div class="form-section">

                    <h2>Mechanics</h2>

                    <div class="form-group">
                        <label for="arcanist-mechanics">
                            Mechanics
                        </label>

                        <textarea
                            id="arcanist-mechanics"
                            name="mechanics"
                            rows="5"
                            placeholder="Record important mechanics..."
                        >${escapeHtml(existingArcanist?.mechanics ?? "")}</textarea>
                    </div>

                </div>


                <div class="form-section">

                    <h2>Additional Information</h2>

                    <div class="form-group">
                        <label for="arcanist-tags">
                            Tags
                        </label>

                        <input
                            type="text"
                            id="arcanist-tags"
                            name="tags"
                            placeholder="e.g. Follow-up, Burn, Control"
                            value="${escapeHtml((existingArcanist?.tags ?? []).join(", "))}"
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
                            rows="6"
                            placeholder="Additional notes..."
                        >${escapeHtml(existingArcanist?.notes ?? "")}</textarea>
                    </div>

                </div>


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
                        ${existingArcanist ? "Save Changes" : "Save Arcanist"}
                    </button>

                </div>

            </form>

        </div>
    `;


    const form =
        document.getElementById("arcanist-form");

    const cancelButton =
        document.getElementById("cancel-arcanist-button");


    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const formData = new FormData(form);


        const arcanistData = {

            name: formData.get("name").trim(),

            afflatus: formData.get("afflatus").trim(),

            damageType: formData.get("damageType").trim(),

            roles: parseList(formData.get("roles")),

            skills: formData.get("skills").trim(),

            portray: formData.get("portray").trim(),

            mechanics: formData.get("mechanics").trim(),

            tags: parseList(formData.get("tags")),

            notes: formData.get("notes").trim()

        };


        if (existingArcanist) {

            updateArcanist(
                existingArcanist.id,
                arcanistData
            );

        } else {

            createArcanist(arcanistData);

        }


        onSaved();
    });


    cancelButton.addEventListener("click", () => {

        onCancel();

    });

}


function parseList(value) {

    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map(item => item.trim())
        .filter(item => item.length > 0);
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