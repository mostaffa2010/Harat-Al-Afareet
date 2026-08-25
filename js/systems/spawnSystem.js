/**
 * حارة العفاريت — Harat El Afareet
 * Perimeter Spawning System
 */

import { WORLD_CONFIG } from '../data/constants.js';
import { difficultySystem } from './difficultySystem.js';
import { waveSystem } from './waveSystem.js';
import { enemyRegistry } from '../enemies/enemyRegistry.js';

export class SpawnSystem {
    constructor() {
        this.spawnTimer = 0;
    }

    reset() {
        this.spawnTimer = 0;
    }

    update(dt, player, enemies) {
        if (!player || !player.alive) return;

        const runTime = waveSystem.runTime;
        const diffMult = difficultySystem.getDifficultyMultiplier(runTime);
        const spawnInterval = difficultySystem.getSpawnInterval(runTime);
        const batchSize = difficultySystem.getBatchSize(runTime);
        const maxEnemies = difficultySystem.maxActiveEnemies;

        this.spawnTimer += dt;
        if (this.spawnTimer >= spawnInterval && enemies.length < maxEnemies) {
            this.spawnTimer = 0;
            this.spawnBatch(player, enemies, batchSize, diffMult, runTime);
        }
    }

    spawnBatch(player, enemies, batchSize, diffMult, runTime) {
        const availableTypes = waveSystem.getAvailableEnemyTypes(runTime);

        for (let i = 0; i < batchSize; i++) {
            // Spawn in circle perimeter outside camera (500 to 650px away)
            const angle = Math.random() * Math.PI * 2;
            const dist = 500 + Math.random() * 160;
            let sx = player.x + Math.cos(angle) * dist;
            let sy = player.y + Math.sin(angle) * dist;

            // Clamp within world map bounds
            sx = Math.max(64, Math.min(WORLD_CONFIG.MAP_WIDTH - 64, sx));
            sy = Math.max(64, Math.min(WORLD_CONFIG.MAP_HEIGHT - 64, sy));

            const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            const enemy = enemyRegistry.create(randomType, sx, sy, diffMult);
            enemies.push(enemy);
        }
    }
}

export const spawnSystem = new SpawnSystem();
