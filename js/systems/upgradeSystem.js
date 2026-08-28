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

    generateChoices(player, count = 3) {
        const eligible = upgradeRegistry.getEligibleUpgrades(player, this.playerUpgradeLevels);

        // Shuffle eligible pool
        for (let i = eligible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
        }

        const chosen = eligible.slice(0, count);

        // Assign rarity & colors
        return chosen.map(card => {
            const rarity = card.forceRarity || upgradeRegistry.rollRarity();
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
