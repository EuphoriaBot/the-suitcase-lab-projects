import {
    getArcanists,
    saveArcanists
} from "./storage.js";


export function getAllArcanists() {
    return getArcanists();
}


export function createArcanist(arcanistData) {
    const arcanists = getArcanists();

    const newArcanist = {
        id: crypto.randomUUID(),
        ...arcanistData
    };

    arcanists.push(newArcanist);

    saveArcanists(arcanists);

    return newArcanist;
}


export function updateArcanist(id, updatedData) {
    const arcanists = getArcanists();

    const index = arcanists.findIndex(
        arcanist => arcanist.id === id
    );

    if (index === -1) {
        return null;
    }

    arcanists[index] = {
        ...arcanists[index],
        ...updatedData,
        id
    };

    saveArcanists(arcanists);

    return arcanists[index];
}


export function deleteArcanist(id) {
    const arcanists = getArcanists();

    const filteredArcanists = arcanists.filter(
        arcanist => arcanist.id !== id
    );

    saveArcanists(filteredArcanists);

    return filteredArcanists;
}

export function toggleArcanistFavorite(id) {

    const arcanists = getArcanists();

    const arcanist =
        arcanists.find(
            item => item.id === id
        );

    if (!arcanist) {
        return null;
    }

    arcanist.favorite =
        !Boolean(arcanist.favorite);

    saveArcanists(arcanists);

    return arcanist;
}

