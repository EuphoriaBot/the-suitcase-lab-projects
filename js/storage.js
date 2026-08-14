const STORAGE_KEYS = {
    ARCANISTS: "reverse1999_arcanists",
    MECHANICS: "reverse1999_mechanics",
    STATUS_EFFECTS: "reverse1999_status_effects"
};


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function getData(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to parse storage data for key: ${key}`, error);
        return [];
    }
}


function removeData(key) {
    localStorage.removeItem(key);
}

export function saveArcanists(arcanists) {
    saveData(STORAGE_KEYS.ARCANISTS, arcanists);
}


export function getArcanists() {
    return getData(STORAGE_KEYS.ARCANISTS);
}


export function removeArcanists() {
    removeData(STORAGE_KEYS.ARCANISTS);
}

export function saveMechanics(mechanics) {
    saveData(STORAGE_KEYS.MECHANICS, mechanics);
}


export function getMechanics() {
    return getData(STORAGE_KEYS.MECHANICS);
}


export function removeMechanics() {
    removeData(STORAGE_KEYS.MECHANICS);
}

export function saveStatusEffects(statusEffects) {
    saveData(STORAGE_KEYS.STATUS_EFFECTS, statusEffects);
}


export function getStatusEffects() {
    return getData(STORAGE_KEYS.STATUS_EFFECTS);
}


export function removeStatusEffects() {
    removeData(STORAGE_KEYS.STATUS_EFFECTS);
}