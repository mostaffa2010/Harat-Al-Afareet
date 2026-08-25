/**
 * حارة العفاريت — Harat El Afareet
 * Difficulty Scaling Engine
 */

export class DifficultySystem {
    constructor() {
        this.baseSpawnInterval = 1.4; // Seconds between spawn batches
        this.minSpawnInterval = 0.35;
        this.maxActiveEnemies = 160;
    }

    getDifficultyMultiplier(runTimeSeconds) {
        // Linear + exponential curve
        return 1.0 + (runTimeSeconds / 60) * 0.28 + Math.pow(runTimeSeconds / 600, 1.8) * 0.8;
    }

    getSpawnInterval(runTimeSeconds) {
        const factor = Math.min(1.0, runTimeSeconds / 480);
        return this.baseSpawnInterval - factor * (this.baseSpawnInterval - this.minSpawnInterval);
    }

    getBatchSize(runTimeSeconds) {
        if (runTimeSeconds < 120) return 2;
        if (runTimeSeconds < 240) return 3;
        if (runTimeSeconds < 400) return 4;
        if (runTimeSeconds < 540) return 6;
        return 8;
    }
}

export const difficultySystem = new DifficultySystem();
