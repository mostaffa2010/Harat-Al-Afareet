/**
 * حارة العفاريت — Harat El Afareet
 * Difficulty Scaling Engine (with Mode Modifiers)
 */

import { DIFFICULTY_MODES } from '../data/constants.js';

export class DifficultySystem {
    constructor() {
        this.baseSpawnInterval = 1.3;
        this.minSpawnInterval = 0.30;
        this.maxActiveEnemies = 175;
        this.currentMode = DIFFICULTY_MODES.NORMAL;
    }

    setMode(modeKey) {
        this.currentMode = DIFFICULTY_MODES[modeKey] || DIFFICULTY_MODES.NORMAL;
    }

    setDifficulty(modeKey) {
        this.setMode(modeKey);
    }

    get currentDifficulty() {
        return this.currentMode;
    }

    getDifficultyMultiplier(runTimeSeconds) {
        const timeFactor = 1.0 + (runTimeSeconds / 60) * 0.22 + Math.pow(runTimeSeconds / 600, 1.7) * 0.7;
        return timeFactor * (this.currentMode.enemyHpMult || 1.0);
    }

    getSpawnInterval(runTimeSeconds) {
        const factor = Math.min(1.0, runTimeSeconds / 450);
        const base = this.baseSpawnInterval - factor * (this.baseSpawnInterval - this.minSpawnInterval);
        return base * (this.currentMode.spawnIntervalMult || 1.0);
    }

    getBatchSize(runTimeSeconds) {
        if (runTimeSeconds < 100) return 2;
        if (runTimeSeconds < 220) return 3;
        if (runTimeSeconds < 360) return 4;
        if (runTimeSeconds < 500) return 6;
        return 8;
    }
}

export const difficultySystem = new DifficultySystem();
