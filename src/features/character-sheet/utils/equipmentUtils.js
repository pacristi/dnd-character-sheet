/**
 * Equipment Utilities
 * Provides utility functions for equipment and weapons
 */

/**
 * Database of standard weapons with their properties
 * @type {Object.<string, {damage: string, type: string, properties: string}>}
 */
export const WEAPONS_DATABASE = {
    // Melee weapons
    "Espada larga": { damage: "1d8", type: "cortante", properties: "Versátil (1d10)" },
    "Espada corta": { damage: "1d6", type: "perforante", properties: "Ligera, Sutil" },
    "Daga": { damage: "1d4", type: "perforante", properties: "Ligera, Sutil, Arrojadiza (alcance 6/18)" },
    "Estoque": { damage: "1d8", type: "perforante", properties: "Sutil" },
    "Hacha de mano": { damage: "1d6", type: "cortante", properties: "Ligera, Arrojadiza (alcance 6/18)" },
    "Bastón": { damage: "1d6", type: "contundente", properties: "Versátil (1d8)" },
    "Maza": { damage: "1d6", type: "contundente", properties: "" },
    "Martillo de guerra": { damage: "1d8", type: "contundente", properties: "Versátil (1d10)" },
    "Hacha de batalla": { damage: "1d8", type: "cortante", properties: "Versátil (1d10)" },
    "Pica": { damage: "1d10", type: "perforante", properties: "Pesada, Alcance, Dos manos" },

    // Ranged weapons
    "Arco largo": { damage: "1d8", type: "perforante", properties: "Munición (alcance 45/180), Dos manos, Pesada" },
    "Arco corto": { damage: "1d6", type: "perforante", properties: "Munición (alcance 24/96), Dos manos" },
    "Ballesta ligera": { damage: "1d8", type: "perforante", properties: "Munición (alcance 24/96), Carga, Dos manos" },
    "Ballesta pesada": { damage: "1d10", type: "perforante", properties: "Munición (alcance 30/120), Carga, Pesada, Dos manos" },
    "Honda": { damage: "1d4", type: "contundente", properties: "Munición (alcance 9/36)" }
};

/**
 * Database of standard armor with their properties
 * @type {Object.<string, {type: string, ac: number, strength: number, stealth: string, weight: number}>}
 */
export const ARMOR_DATABASE = {
    // Light Armor
    "Acolchada": { type: "light", ac: 11, strength: 0, stealth: "disadvantage", weight: 4 },
    "Cuero": { type: "light", ac: 11, strength: 0, stealth: "normal", weight: 5 },
    "Cuero tachonado": { type: "light", ac: 12, strength: 0, stealth: "normal", weight: 6.5 },

    // Medium Armor
    "Pieles": { type: "medium", ac: 12, strength: 0, stealth: "normal", weight: 6 },
    "Camisote de mallas": { type: "medium", ac: 13, strength: 0, stealth: "normal", weight: 10 },
    "Cota de escamas": { type: "medium", ac: 14, strength: 0, stealth: "disadvantage", weight: 20 },
    "Coraza": { type: "medium", ac: 14, strength: 0, stealth: "normal", weight: 10 },
    "Media armadura": { type: "medium", ac: 15, strength: 0, stealth: "disadvantage", weight: 18 },

    // Heavy Armor
    "Armadura de anillas": { type: "heavy", ac: 14, strength: 0, stealth: "disadvantage", weight: 20 },
    "Cota de malla": { type: "heavy", ac: 16, strength: 13, stealth: "disadvantage", weight: 25 },
    "Cota de bandas": { type: "heavy", ac: 17, strength: 15, stealth: "disadvantage", weight: 30 },
    "Armadura de placas": { type: "heavy", ac: 18, strength: 15, stealth: "disadvantage", weight: 32.5 },

    // Shields
    "Escudo": { type: "shield", ac: 2, strength: 0, stealth: "normal", weight: 3 }
};

/**
 * Determine if a weapon is ranged based on its properties
 * @param {Object|string} weapon - Weapon object or weapon name
 * @returns {boolean} True if the weapon is ranged
 */
export function isRangedWeapon(weapon) {
    // If weapon is a string (name), look it up in the database
    const weaponData = typeof weapon === 'string'
        ? WEAPONS_DATABASE[weapon]
        : weapon;

    if (!weaponData) return false;

    // Check if it's a ranged weapon based on properties
    return weaponData.properties.includes("Munición") ||
        weaponData.properties.includes("alcance") ||
        (typeof weapon === 'string' && (
            weapon.includes("Arco") ||
            weapon.includes("Ballesta") ||
            weapon.includes("Honda")
        ));
}

/**
 * Find a weapon in the database by name
 * @param {string} weaponName - Name of the weapon to find
 * @returns {Object|null} Weapon data or null if not found
 */
export function findWeapon(weaponName) {
    if (!weaponName) return null;

    // Check for exact match
    if (WEAPONS_DATABASE[weaponName]) {
        return {
            name: weaponName,
            ...WEAPONS_DATABASE[weaponName]
        };
    }

    // Check for partial match
    for (const [name, data] of Object.entries(WEAPONS_DATABASE)) {
        if (name.toLowerCase().includes(weaponName.toLowerCase()) ||
            weaponName.toLowerCase().includes(name.toLowerCase())) {
            return {
                name,
                ...data
            };
        }
    }

    return null;
}

/**
 * Find armor in the database by name
 * @param {string} armorName - Name of the armor to find
 * @returns {Object|null} Armor data or null if not found
 */
export function findArmor(armorName) {
    if (!armorName) return null;

    // Check for exact match
    if (ARMOR_DATABASE[armorName]) {
        return {
            name: armorName,
            ...ARMOR_DATABASE[armorName]
        };
    }

    // Check for partial match
    for (const [name, data] of Object.entries(ARMOR_DATABASE)) {
        if (name.toLowerCase().includes(armorName.toLowerCase()) ||
            armorName.toLowerCase().includes(name.toLowerCase())) {
            return {
                name,
                ...data
            };
        }
    }

    return null;
}

/**
 * Calculate attack bonus for a weapon
 * @param {Object} weaponData - Weapon data
 * @param {Object} abilityModifiers - Character's ability modifiers
 * @param {number} proficiencyBonus - Character's proficiency bonus
 * @returns {number} Attack bonus
 */
export function calculateAttackBonus(weaponData, abilityModifiers, proficiencyBonus) {
    if (!weaponData || !abilityModifiers) return 0;

    // Determine if the weapon is ranged
    const isRanged = isRangedWeapon(weaponData);

    // Get the appropriate ability modifier (STR for melee, DEX for ranged)
    // Unless the weapon has the 'Sutil' property, which allows using DEX for melee
    let abilityMod;
    if (isRanged) {
        abilityMod = abilityModifiers.dex || 0;
    } else if (weaponData.properties && weaponData.properties.includes('Sutil')) {
        // For finesse weapons, use the better of STR or DEX
        abilityMod = Math.max(
            abilityModifiers.str || 0,
            abilityModifiers.dex || 0
        );
    } else {
        // Standard melee weapons use STR
        abilityMod = abilityModifiers.str || 0;
    }

    // Calculate total bonus
    return abilityMod + proficiencyBonus;
}

/**
 * Calculate armor class based on armor and ability modifiers
 * @param {Object|string} armor - Armor object or armor name
 * @param {Object} abilityModifiers - Character's ability modifiers
 * @param {boolean} hasShield - Whether the character has a shield equipped
 * @returns {number} Armor class
 */
export function calculateArmorClass(armor, abilityModifiers, hasShield = false) {
    // If no armor, use unarmored defense (10 + DEX modifier)
    if (!armor) {
        return 10 + (abilityModifiers.dex || 0);
    }

    // If armor is a string (name), look it up in the database
    const armorData = typeof armor === 'string'
        ? findArmor(armor)
        : armor;

    if (!armorData) {
        // Fall back to unarmored defense
        return 10 + (abilityModifiers.dex || 0);
    }

    let ac = armorData.ac;

    // Add DEX modifier for light armor
    if (armorData.type === 'light') {
        ac += (abilityModifiers.dex || 0);
    }
    // Add DEX modifier (max 2) for medium armor
    else if (armorData.type === 'medium') {
        ac += Math.min(2, (abilityModifiers.dex || 0));
    }
    // Heavy armor doesn't add DEX modifier

    // Add shield bonus
    if (hasShield) {
        ac += 2;
    }

    return ac;
}

/**
 * Calculate weight capacity based on strength
 * @param {number} strength - Character's strength score
 * @returns {number} Weight capacity in kilograms
 */
export function calculateWeightCapacity(strength) {
    return strength * 7.5; // 15 times strength in pounds, converted to kg and rounded
}

/**
 * Parse bulk equipment text into individual items
 * @param {string} bulkText - Text with one item per line
 * @returns {Array<{name: string, equipped: boolean, weight: number}>} Parsed equipment items
 */
export function parseBulkEquipment(bulkText) {
    if (!bulkText) return [];

    const lines = bulkText.split('\n');
    const equipmentItems = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check if the item should be equipped (marked with [P] or [E])
        const equippedMatch = trimmedLine.match(/^\[([PE])\]\s*(.*)/i);
        const isEquipped = !!equippedMatch;
        const itemText = isEquipped ? equippedMatch[2].trim() : trimmedLine;

        if (itemText) {
            // Try to find a default weight based on the item type
            let weight = 0;

            // Check if it's a known weapon or armor
            const weaponData = findWeapon(itemText);
            const armorData = findArmor(itemText);

            if (weaponData) {
                // Estimate weapon weight based on type
                if (weaponData.properties.includes('Ligera')) {
                    weight = 1; // Light weapons ~1kg
                } else if (weaponData.properties.includes('Pesada') || weaponData.properties.includes('Dos manos')) {
                    weight = 3; // Heavy/two-handed weapons ~3kg
                } else {
                    weight = 2; // Medium weapons ~2kg
                }
            } else if (armorData) {
                // Use the armor's defined weight
                weight = armorData.weight;
            }

            equipmentItems.push({
                name: itemText,
                equipped: isEquipped,
                weight
            });
        }
    }

    return equipmentItems;
}

/**
 * Format money amount for display
 * @param {Object} money - Character's money (gold, silver, copper)
 * @returns {string} Formatted money string
 */
export function formatMoney(money) {
    const { gold = 0, silver = 0, copper = 0 } = money;
    const parts = [];

    if (gold > 0) parts.push(`${gold} po`);
    if (silver > 0) parts.push(`${silver} pp`);
    if (copper > 0) parts.push(`${copper} pc`);

    return parts.length > 0 ? parts.join(', ') : '0 po';
}

/**
 * Convert all money to copper pieces for calculations
 * @param {Object} money - Character's money (gold, silver, copper)
 * @returns {number} Total value in copper pieces
 */
export function convertToCopper(money) {
    const { gold = 0, silver = 0, copper = 0 } = money;
    return (gold * 100) + (silver * 10) + copper;
}

/**
 * Convert copper pieces to an optimal distribution of coins
 * @param {number} copper - Total value in copper pieces
 * @returns {Object} Distribution of coins {gold, silver, copper}
 */
export function convertFromCopper(copper) {
    const gold = Math.floor(copper / 100);
    copper %= 100;
    const silver = Math.floor(copper / 10);
    copper %= 10;

    return { gold, silver, copper };
}