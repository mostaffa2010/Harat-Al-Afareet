/**
 * حارة العفاريت — Harat El Afareet
 * Upgrade Manager & Card Selection Engine
 */

import { UPGRADE_RARITIES } from '../data/constants.js';
import { upgradeRegistry } from '../upgrades/upgradeRegistry.js';

export class UpgradeSystem {
    constructor() {
        this.playerUpgradeLevels = {};
    }

    reset() {
        this.playerUpgradeLevels = {};
    }

    rollRarity() {
        const roll = Math.random() * 100;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight) return UPGRADE_RARITIES.LEGENDARY;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight + UPGRADE_RARITIES.EPIC.weight) return UPGRADE_RARITIES.EPIC;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight + UPGRADE_RARITIES.EPIC.weight + UPGRADE_RARITIES.RARE.weight) return UPGRADE_RARITIES.RARE;
        return UPGRADE_RARITIES.COMMON;
    }

    generateChoices(player, count = 3) {
        // The Apprentice passive "Quick Study" grants 4 choices
        if (player && player.characterId === 'apprentice') {
            count = 4;
        }

        const eligible = upgradeRegistry.getEligibleUpgrades(player, this.playerUpgradeLevels);

        // Shuffle eligible pool
        for (let i = eligible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
        }

        const chosen = eligible.slice(0, count);

        // Assign randomized rarity for aesthetic flair & multipliers
        return chosen.map(card => {
            const rarity = this.rollRarity();
            return {
                ...card,
                rarity: rarity
            };
        });
    }

    applyUpgrade(card) {
        if (card && typeof card.apply === 'function') {
            card.apply();
        }
    }
}

export const upgradeSystem = new UpgradeSystem();
