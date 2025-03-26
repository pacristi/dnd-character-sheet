// src/features/character-sheet/store/index.js
import { characterState } from './characterState';
import { characterGetters } from './characterGetters';
import { characterMutations } from './characterMutations';
import { characterActions } from './characterActions';

/**
 * Character store module
 */
export const characterStore = {
    namespaced: true,
    state: characterState,
    getters: characterGetters,
    mutations: characterMutations,
    actions: characterActions
};

export default characterStore;