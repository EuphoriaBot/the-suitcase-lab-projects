import { createStatusEffect, updateStatusEffect } from "./statusEffectService.js";
import { getAllArcanists } from "./arcanistService.js";

export function renderStatusEffectForm(
    container,
    onSaved,
    onCancel,
    existingStatusEffect = null
) {

    const arcanists = getAllArcanists();
    container.innerHTML = `
        <div class="form-page">
            <div class="page-header">
                <div>
                    <h1>
                        ${existingStatusEffect ? "Edit Status Effect" : "Add Status Effect"}
                    </h1>
                    <p class="page-description">
                        ${existingStatusEffect ? "Update this status effect's information." : "Record a Reverse: 1999 status effect."}
                    </p>
                </div>
            </div>

            <form
                id="status-effect-form"
                class="arcanist-form"
            >
                <div class="form-section">
                    <h2>Basic Information</h2>
                    <div class="form-group">
                        <label for="status-effect-name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="status-effect-name"
                            name="name"
                            placeholder="e.g. Burn"
                            value="${escapeHtml(existingStatusEffect?.name ?? "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="status-effect-description">
                            Description
                        </label>
                        <textarea
                            id="status-effect-description"
                            name="description"
                            rows="5"
                            placeholder="Explain what this status effect is..."
                        >${escapeHtml(existingStatusEffect?.description ?? "")}</textarea>
                    </div>


                    <div class="form-group">
                        <label for="status-effect-effect">
                            Effect
                        </label>
                        <textarea
                            id="status-effect-effect"
                            name="effect"
                            rows="6"
                            placeholder="Explain what this status effect does..."
                        >${escapeHtml(existingStatusEffect?.effect ?? "")}</textarea>
                    </div>


                    <div class="form-row">
                        <div class="form-group">
                            <label for="status-effect-duration">
                                Duration
                            </label>
                            <input
                                type="text"
                                id="status-effect-duration"
                                name="duration"
                                placeholder="e.g. 2 rounds"
                                value="${escapeHtml(existingStatusEffect?.duration ?? "")}"
                            >
                        </div>


                        <div class="form-group">
                            <label>
                                Stackable
                            </label>
                            <label class="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="status-effect-stackable"
                                    name="stackable"
                                    ${existingStatusEffect?.stackable ? "checked" : ""}
                                >
                                <span>
                                    This status effect can stack.
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h2>Related Arcanists</h2>
                    <p class="form-help">
                        Select the Arcanists related to this status effect.
                    </p>
                    <div class="relationship-list">
                        ${renderArcanistOptions(arcanists, existingStatusEffect?.relatedArcanists ?? [])}
                    </div>
                </div>

                <div class="form-section">
                    <h2>Additional Information</h2>
                    <div class="form-group">
                        <label for="status-effect-tags">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="status-effect-tags"
                            name="tags"
                            placeholder="e.g. Debuff, Damage, Control"
                            value="${escapeHtml((existingStatusEffect?.tags ?? []).join(", "))}"
                        >
                        <small>
                            Separate multiple tags with commas.
                        </small>
                    </div>

                    <div class="form-group">
                        <label for="status-effect-notes">
                            Notes
                        </label>

                        <textarea
                            id="status-effect-notes"
                            name="notes"
                            rows="6"
                            placeholder="Your personal notes..."
                        >${escapeHtml(existingStatusEffect?.notes ?? "")}</textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button
                        type="button"
                        id="cancel-status-effect-button"
                        class="secondary-button"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="primary-button"
                    >
                        ${existingStatusEffect ? "Save Changes" : "Save Status Effect"}
                    </button>
                </div>
            </form>
        </div>
    `;

    const form = document.getElementById("status-effect-form");
    const cancelButton = document.getElementById("cancel-status-effect-button");

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const statusEffectData = {
                name: formData.get("name").trim(),
                description: formData.get("description").trim(),
                effect: formData.get("effect").trim(),
                duration: formData.get("duration").trim(),
                stackable: formData.get("stackable") === "on",
                relatedArcanists: getCheckedValues("related-arcanist"),
                tags: parseList(formData.get("tags")),
                notes: formData.get("notes").trim()

            };

            if (existingStatusEffect) {
                updateStatusEffect(
                    existingStatusEffect.id,
                    statusEffectData
                );
            } else {
                createStatusEffect(statusEffectData);
            }
            onSaved();
        }
    );
    cancelButton.addEventListener(
        "click",
        () => onCancel()
    );

}

function renderArcanistOptions(
    arcanists,
    selectedIds
) {

    if (arcanists.length === 0) {
        return `
            <p class="detail-empty">
                No Arcanists available.
            </p>
        `;
    }


    return arcanists
        .map(arcanist => `
            <label class="relationship-item">
                <input
                    type="checkbox"
                    class="relationship-checkbox"
                    name="related-arcanist"
                    value="${escapeHtml(
            arcanist.id
        )}"
                    ${selectedIds.includes(
            arcanist.id
        )
                ? "checked" : ""
            }
                >
                <span>
                    ${escapeHtml(arcanist.name)}
                </span>
            </label>
        `)
        .join("");
}


function getCheckedValues(name) {
    return Array.from(
        document.querySelectorAll(
            `input[name="${name}"]:checked`
        )
    ).map(
        checkbox => checkbox.value
    );
}


function parseList(value) {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map(item => item.trim())
        .filter(
            item => item.length > 0
        );
}


function escapeHtml(value) {
    if (
        value === undefined || value === null
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