/**
 * حارة العفاريت — Harat El Afareet
 * Wave Progression & Run Timeline
 */

import { bossRegistry } from '../bosses/bossRegistry.js';
import { enemyRegistry } from '../enemies/enemyRegistry.js';
import { audioSystem } from './audioSystem.js';
import { cameraSystem } from './cameraSystem.js';
import { damageSystem } from './damageSystem.js';

export class WaveSystem {
    constructor() {
        this.runTime = 0;
        this.bossSpawned = false;
        this.bossDefeated = false;
        this.eliteSpawned6Min = false;
    }

    reset() {
        this.runTime = 0;
        this.bossSpawned = false;
        this.bossDefeated = false;
        this.eliteSpawned6Min = false;
    }

    update(dt, player, enemies, activeBossRef) {
        this.runTime += dt;

        // 6:00 (360s) Elite Wave Event
        if (this.runTime >= 360 && !this.eliteSpawned6Min) {
            this.eliteSpawned6Min = true;
            this.spawnEliteWave(player, enemies);
        }

        // 10:00 (600s) Boss Event
        if (this.runTime >= 600 && !this.bossSpawned) {
            this.bossSpawned = true;
            return this.spawnBoss(player);
        }

        return null;
    }

    getAvailableEnemyTypes(runTime) {
        if (runTime < 120) {
            return ['smallAfreet'];
        } else if (runTime < 240) {
            return ['smallAfreet', 'fastAfreet'];
        } else if (runTime < 360) {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet'];
        } else {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet', 'giantAfreet'];
        }
    }

    spawnEliteWave(player, enemies) {
        damageSystem.spawnText(player.x, player.y - 40, '⚠️ موجة المردة العتاة!', false, '#ef4444');
        cameraSystem.triggerShake(8);
        audioSystem.playBossRoar();

        // Spawn 2 Giant Afareet
        for (let i = 0; i < 2; i++) {
            const angle = (Math.PI * 2 / 2) * i;
            const x = player.x + Math.cos(angle) * 550;
            const y = player.y + Math.sin(angle) * 550;
            const giant = enemyRegistry.create('giantAfreet', x, y, 1.4);
            enemies.push(giant);
        }
    }

    spawnBoss(player) {
        damageSystem.spawnText(player.x, player.y - 60, '👑 ظهر ملك العفاريت!', false, '#dc2626');
        cameraSystem.triggerShake(16);
        audioSystem.playBossRoar();

        const spawnDist = 480;
        const angle = Math.random() * Math.PI * 2;
        const bx = player.x + Math.cos(angle) * spawnDist;
        const by = player.y + Math.sin(angle) * spawnDist;

        return bossRegistry.create('afreetKing', bx, by, 1.0);
    }
}

export const waveSystem = new WaveSystem();
