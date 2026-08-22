import {
    getStatusEffects,
    saveStatusEffects
} from "./storage.js";


export function getAllStatusEffects() {
    return getStatusEffects();
}


export function createStatusEffect(statusEffectData) {

    const statusEffects = getStatusEffects();

    const newStatusEffect = {
        id: crypto.randomUUID(),
        ...statusEffectData
    };

    statusEffects.push(newStatusEffect);

    saveStatusEffects(statusEffects);

    return newStatusEffect;
}


export function updateStatusEffect(
    id,
    updatedData
) {

    const statusEffects =
        getStatusEffects();

    const index =
        statusEffects.findIndex(
            statusEffect =>
                statusEffect.id === id
        );

    if (index === -1) {
        return null;
    }

    statusEffects[index] = {
        ...statusEffects[index],
        ...updatedData,
        id
    };

    saveStatusEffects(statusEffects);

    return statusEffects[index];
}


export function deleteStatusEffect(id) {

    const statusEffects =
        getStatusEffects();

    const filteredStatusEffects =
        statusEffects.filter(
            statusEffect =>
                statusEffect.id !== id
        );

    saveStatusEffects(
        filteredStatusEffects
    );

    return filteredStatusEffects;
}

export function toggleStatusEffectFavorite(id) {

    const statusEffects =
        getStatusEffects();

    const statusEffect =
        statusEffects.find(
            item => item.id === id
        );

    if (!statusEffect) {
        return null;
    }

    statusEffect.favorite =
        !Boolean(statusEffect.favorite);

    saveStatusEffects(statusEffects);

    return statusEffect;
}