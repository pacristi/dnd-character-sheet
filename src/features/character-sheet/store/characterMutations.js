/**
 * Character Mutations
 * Defines mutations for the character store
 */
import { getDefaultState } from './characterState';

export const characterMutations = {
    // Reset the entire state to default
    RESET_STATE(state) {
        Object.assign(state, getDefaultState());
    },

    // Set/update entire state at once
    SET_STATE(state, newState) {
        Object.assign(state, newState);
    },

    // Update basic info fields
    SET_BASIC_INFO(state, { field, value }) {
        state.basicInfo[field] = value;
    },

    // Update ability score
    SET_ABILITY_SCORE(state, { ability, score }) {
        state.abilities[ability] = parseInt(score) || 10;
    },

    // Update combat stats
    SET_COMBAT_STAT(state, { stat, value }) {
        if (stat.includes('.')) {
            const [parent, child] = stat.split('.');
            state.combat[parent][child] = value;
        } else {
            state.combat[stat] = value;
        }
    },

    // Toggle proficiency for saving throws
    TOGGLE_SAVING_THROW(state, ability) {
        state.savingThrows[ability] = !state.savingThrows[ability];
    },

    // Set all skills
    SET_SKILLS(state, skills) {
        state.skills = skills;
    },

    // Toggle skill proficiency
    TOGGLE_SKILL(state, skillId) {
        state.skills[skillId] = !state.skills[skillId];
    },

    // Add/remove languages
    ADD_LANGUAGE(state, language) {
        if (!state.languages.includes(language)) {
            state.languages.push(language);
        }
    },

    REMOVE_LANGUAGE(state, language) {
        state.languages = state.languages.filter(lang => lang !== language);
    },

    // Add/remove proficiencies
    ADD_PROFICIENCY(state, proficiency) {
        if (!state.proficiencies.includes(proficiency)) {
            state.proficiencies.push(proficiency);
        }
    },

    REMOVE_PROFICIENCY(state, proficiency) {
        state.proficiencies = state.proficiencies.filter(prof => prof !== proficiency);
    },

    // Manage features
    SET_FEATURES(state, features) {
        state.features = features;
    },

    ADD_FEATURE(state, feature) {
        state.features.push(feature);
    },

    UPDATE_FEATURE(state, { index, feature }) {
        state.features[index] = feature;
    },

    REMOVE_FEATURE(state, index) {
        state.features.splice(index, 1);
    },

    // Manage spells
    SET_SPELLS(state, spells) {
        state.spells = spells;
    },

    ADD_SPELL(state, { level, spell }) {
        if (!state.spells[level]) {
            state.spells[level] = { spells: [], slots: { total: 0, used: 0 } };
        }
        state.spells[level].spells.push(spell);
    },

    UPDATE_SPELL(state, { level, index, spell }) {
        state.spells[level].spells[index] = spell;
    },

    REMOVE_SPELL(state, { level, index }) {
        state.spells[level].spells.splice(index, 1);

        // Remove the level if no spells remain
        if (state.spells[level].spells.length === 0 && level !== 'cantrip') {
            delete state.spells[level];
        }
    },

    SET_SPELL_SLOTS(state, { level, slots }) {
        if (!state.spells[level]) {
            state.spells[level] = { spells: [], slots: null };
        }
        state.spells[level].slots = slots;
    },

    // Manage equipment
    ADD_EQUIPMENT(state, item) {
        state.equipment.push(item);
    },

    UPDATE_EQUIPMENT(state, { index, item }) {
        state.equipment[index] = item;
    },

    REMOVE_EQUIPMENT(state, index) {
        state.equipment.splice(index, 1);
    },

    // Manage attacks
    SET_ATTACKS(state, attacks) {
        state.attacks = attacks;
    },

    ADD_ATTACK(state, attack) {
        state.attacks.push(attack);
    },

    UPDATE_ATTACK(state, { index, attack }) {
        state.attacks[index] = attack;
    },

    REMOVE_ATTACK(state, index) {
        state.attacks.splice(index, 1);
    },

    // Update money
    SET_MONEY(state, { currency, amount }) {
        state.money[currency] = parseInt(amount) || 0;
    },

    // Update personality traits
    SET_PERSONALITY(state, { trait, value }) {
        state.personality[trait] = value;
    },

    // Update notes
    SET_NOTES(state, notes) {
        state.notes = notes;
    },

    // Set portrait
    SET_PORTRAIT(state, portraitData) {
        state.portrait = portraitData;
    },

    // Import complete character data
    IMPORT_CHARACTER(state, characterData) {
        Object.assign(state, characterData);
    }
};