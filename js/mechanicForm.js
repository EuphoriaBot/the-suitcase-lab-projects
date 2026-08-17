import {
    createMechanic,
    updateMechanic
} from "./mechanicService.js";


export function renderMechanicForm(
    container,
    onSaved,
    onCancel,
    existingMechanic = null
) {

    container.innerHTML = `
        <div class="form-page">

            <div class="page-header">

                <div>
                    <h1>
                        ${existingMechanic
            ? "Edit Mechanic"
            : "Add Mechanic"
        }
                    </h1>

                    <p class="page-description">
                        ${existingMechanic
            ? "Update this mechanic's information."
            : "Record a Reverse: 1999 game mechanic."
        }
                    </p>
                </div>

            </div>


            <form
                id="mechanic-form"
                class="arcanist-form"
            >

                <!-- Basic Information -->

                <div class="form-section">

                    <h2>Basic Information</h2>


                    <div class="form-group">

                        <label for="mechanic-name">
                            Name
                        </label>

                        <input
                            type="text"
                            id="mechanic-name"
                            name="name"
                            placeholder="e.g. Moxie"
                            value="${escapeHtml(
            existingMechanic?.name ?? ""
        )}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="mechanic-category">
                            Category
                        </label>

                        <input
                            type="text"
                            id="mechanic-category"
                            name="category"
                            placeholder="e.g. Combat"
                            value="${escapeHtml(
            existingMechanic?.category ?? ""
        )}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="mechanic-short-description">
                            Short Description
                        </label>

                        <textarea
                            id="mechanic-short-description"
                            name="shortDescription"
                            rows="3"
                            placeholder="A quick explanation of this mechanic..."
                        >${escapeHtml(
            existingMechanic?.shortDescription ?? ""
        )}</textarea>

                    </div>

                </div>


                <!-- Detailed Information -->

                <div class="form-section">

                    <h2>Detailed Information</h2>


                    <div class="form-group">

                        <label for="mechanic-detailed-description">
                            Detailed Description
                        </label>

                        <textarea
                            id="mechanic-detailed-description"
                            name="detailedDescription"
                            rows="8"
                            placeholder="Explain how this mechanic works..."
                        >${escapeHtml(
            existingMechanic?.detailedDescription ?? ""
        )}</textarea>

                    </div>


                    <div class="form-group">

                        <label for="mechanic-examples">
                            Examples
                        </label>

                        <textarea
                            id="mechanic-examples"
                            name="examples"
                            rows="7"
                            placeholder="Example 1&#10;Example 2&#10;Example 3"
                        >${escapeHtml(
            (existingMechanic?.examples ?? [])
                .join("\n")
        )}</textarea>

                        <small>
                            Write one example per line.
                        </small>

                    </div>

                </div>


                <!-- Relationships -->

                <div class="form-section">

                    <h2>Relationships</h2>


                    <div class="form-group">

                        <label for="mechanic-related-arcanists">
                            Related Arcanists
                        </label>

                        <input
                            type="text"
                            id="mechanic-related-arcanists"
                            name="relatedArcanists"
                            placeholder="e.g. Lucy, Regulus"
                            value="${escapeHtml(
            (
                existingMechanic
                    ?.relatedArcanists ?? []
            ).join(", ")
        )}"
                        >

                        <small>
                            Separate multiple names with commas.
                        </small>

                    </div>


                    <div class="form-group">

                        <label for="mechanic-related-status-effects">
                            Related Status Effects
                        </label>

                        <input
                            type="text"
                            id="mechanic-related-status-effects"
                            name="relatedStatusEffects"
                            placeholder="e.g. Burn, Stunned"
                            value="${escapeHtml(
            (
                existingMechanic
                    ?.relatedStatusEffects ?? []
            ).join(", ")
        )}"
                        >

                        <small>
                            Separate multiple names with commas.
                        </small>

                    </div>

                </div>


                <!-- Additional Information -->

                <div class="form-section">

                    <h2>Additional Information</h2>


                    <div class="form-group">

                        <label for="mechanic-tags">
                            Tags
                        </label>

                        <input
                            type="text"
                            id="mechanic-tags"
                            name="tags"
                            placeholder="e.g. Combat, Moxie, Ultimate"
                            value="${escapeHtml(
            (existingMechanic?.tags ?? [])
                .join(", ")
        )}"
                        >

                        <small>
                            Separate multiple tags with commas.
                        </small>

                    </div>


                    <div class="form-group">

                        <label for="mechanic-notes">
                            Notes
                        </label>

                        <textarea
                            id="mechanic-notes"
                            name="notes"
                            rows="6"
                            placeholder="Your personal notes..."
                        >${escapeHtml(
            existingMechanic?.notes ?? ""
        )}</textarea>

                    </div>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        id="cancel-mechanic-button"
                        class="secondary-button"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        class="primary-button"
                    >
                        ${existingMechanic
            ? "Save Changes"
            : "Save Mechanic"
        }
                    </button>

                </div>

            </form>

        </div>
    `;


    const form =
        document.getElementById("mechanic-form");


    const cancelButton =
        document.getElementById(
            "cancel-mechanic-button"
        );


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const formData =
            new FormData(form);


        const mechanicData = {

            name:
                formData.get("name")
                    .trim(),

            category:
                formData.get("category")
                    .trim(),

            shortDescription:
                formData.get("shortDescription")
                    .trim(),

            detailedDescription:
                formData.get("detailedDescription")
                    .trim(),

            examples:
                parseLines(
                    formData.get("examples")
                ),

            relatedArcanists:
                parseList(
                    formData.get("relatedArcanists")
                ),

            relatedStatusEffects:
                parseList(
                    formData.get("relatedStatusEffects")
                ),

            tags:
                parseList(
                    formData.get("tags")
                ),

            notes:
                formData.get("notes")
                    .trim()

        };


        if (existingMechanic) {

            updateMechanic(
                existingMechanic.id,
                mechanicData
            );

        } else {

            createMechanic(
                mechanicData
            );

        }


        onSaved();

    });


    cancelButton.addEventListener(
        "click",
        () => onCancel()
    );

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


function parseLines(value) {

    if (!value) {
        return [];
    }

    return value
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

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