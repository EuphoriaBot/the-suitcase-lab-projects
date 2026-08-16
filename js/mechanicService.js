import {
    getMechanics,
    saveMechanics
} from "./storage.js";


export function getAllMechanics() {
    return getMechanics();
}


export function createMechanic(mechanicData) {

    const mechanics = getMechanics();

    const newMechanic = {
        id: crypto.randomUUID(),
        ...mechanicData
    };

    mechanics.push(newMechanic);

    saveMechanics(mechanics);

    return newMechanic;
}


export function updateMechanic(id, updatedData) {

    const mechanics = getMechanics();

    const index = mechanics.findIndex(
        mechanic => mechanic.id === id
    );

    if (index === -1) {
        return null;
    }

    mechanics[index] = {
        ...mechanics[index],
        ...updatedData,
        id
    };

    saveMechanics(mechanics);

    return mechanics[index];
}


export function deleteMechanic(id) {

    const mechanics = getMechanics();

    const filteredMechanics =
        mechanics.filter(
            mechanic => mechanic.id !== id
        );

    saveMechanics(filteredMechanics);

    return filteredMechanics;
}