/**
 * حارة العفاريت — Harat El Afareet
 * LocalStorage Save & Progression Manager
 */

import { INITIAL_SAVE_DATA } from '../data/defaultData.js';

export class SaveSystem {
    constructor() {
        this.storageKey = 'harat_el_afareet_save_v1';
        this.data = JSON.parse(JSON.stringify(INITIAL_SAVE_DATA));
    }

    init() {
        this.loadGame();
    }

    loadGame() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                // Deep merge with initial save schema so new fields are never undefined
                this.data = {
                    ...INITIAL_SAVE_DATA,
                    ...parsed,
                    permanentUpgrades: {
                        ...INITIAL_SAVE_DATA.permanentUpgrades,
                        ...(parsed.permanentUpgrades || {})
                    },
                    audio: {
                        ...INITIAL_SAVE_DATA.audio,
                        ...(parsed.audio || {})
                    },
                    settings: {
                        ...INITIAL_SAVE_DATA.settings,
                        ...(parsed.settings || {})
                    }
                };
            } else {
                this.data = JSON.parse(JSON.stringify(INITIAL_SAVE_DATA));
                this.saveGame();
            }
        } catch (e) {
            console.error('Failed to load save data from localStorage:', e);
            this.data = JSON.parse(JSON.stringify(INITIAL_SAVE_DATA));
        }
        return this.data;
    }

    saveGame() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save data to localStorage:', e);
        }
    }

    resetGame() {
        this.data = JSON.parse(JSON.stringify(INITIAL_SAVE_DATA));
        this.saveGame();
        return this.data;
    }

    addCoins(amount) {
        if (amount <= 0) return;
        this.data.coins = (this.data.coins || 0) + amount;
        this.data.totalCoinsEarned = (this.data.totalCoinsEarned || 0) + amount;
        this.saveGame();
    }

    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.saveGame();
            return true;
        }
        return false;
    }

    recordRun(survivalTime, enemiesDefeated, coinsEarned) {
        if (survivalTime > (this.data.highScoreTime || 0)) {
            this.data.highScoreTime = survivalTime;
        }
        this.data.totalEnemiesDefeated = (this.data.totalEnemiesDefeated || 0) + enemiesDefeated;
        this.addCoins(coinsEarned);
        this.saveGame();
    }

    upgradePermanentStat(upgradeId, cost) {
        if (this.spendCoins(cost)) {
            const currentLvl = this.data.permanentUpgrades[upgradeId] || 0;
            this.data.permanentUpgrades[upgradeId] = currentLvl + 1;
            this.saveGame();
            return true;
        }
        return false;
    }

    setSelectedCharacter(characterId) {
        this.data.selectedCharacterId = characterId;
        this.saveGame();
    }
}

export const saveSystem = new SaveSystem();
