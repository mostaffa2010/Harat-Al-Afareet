/**
 * حارة العفاريت — Harat El Afareet
 * 10-Stage Wave Timeline with 3 Mini-Bosses & Final Boss
 */

import { bossRegistry } from '../bosses/bossRegistry.js';
import { audioSystem } from './audioSystem.js';
import { damageSystem } from './damageSystem.js';

export class WaveSystem {
    constructor() {
        this.runTime = 0;
        this.currentStageIndex = 0;
        this.miniBoss1Spawned = false;
        this.miniBoss2Spawned = false;
        this.miniBoss3Spawned = false;
        this.finalBossSpawned = false;

        this.stages = [
            { start: 0, end: 60, name: 'المرحلة 1: حارة السيدة' },
            { start: 60, end: 120, name: 'المرحلة 2: درب اللبانة' },
            { start: 120, end: 180, name: 'المرحلة 3: حوش الغجر' },
            { start: 180, end: 240, name: 'المرحلة 4: زقاق المجانين' },
            { start: 240, end: 300, name: 'المرحلة 5: خان الجان' },
            { start: 300, end: 360, name: 'المرحلة 6: مقابر الغفير' },
            { start: 360, end: 420, name: 'المرحلة 7: سوق العفاريت' },
            { start: 420, end: 480, name: 'المرحلة 8: درب الأساطير' },
            { start: 480, end: 540, name: 'المرحلة 9: حافة الهاوية' },
            { start: 540, end: 9999, name: 'المرحلة 10: عرش سلطان الجان' }
        ];
    }

    reset() {
        this.runTime = 0;
        this.currentStageIndex = 0;
        this.miniBoss1Spawned = false;
        this.miniBoss2Spawned = false;
        this.miniBoss3Spawned = false;
        this.finalBossSpawned = false;
    }

    getCurrentStageName() {
        const stage = this.stages.find(s => this.runTime >= s.start && this.runTime < s.end);
        return stage ? stage.name : 'المرحلة 10: عرش سلطان الجان';
    }

    update(dt, player, enemies, activeBossRef) {
        this.runTime += dt;

        // Mini-Boss 1: 2:30 (150s)
        if (this.runTime >= 150 && !this.miniBoss1Spawned) {
            this.miniBoss1Spawned = true;
            return this.spawnMiniBoss(player, 'rockBruteBoss', '🗿 هجوم مارد الصخر الهائج!');
        }

        // Mini-Boss 2: 5:30 (330s)
        if (this.runTime >= 330 && !this.miniBoss2Spawned) {
            this.miniBoss2Spawned = true;
            return this.spawnMiniBoss(player, 'necroShamanBoss', '💀 كاهن المقابر يخرج من باطن الأرض!');
        }

        // Mini-Boss 3: 8:30 (510s)
        if (this.runTime >= 510 && !this.miniBoss3Spawned) {
            this.miniBoss3Spawned = true;
            return this.spawnMiniBoss(player, 'infernalBruteBoss', '🔥 مارد اللهب الملعون يحرق الحارة!');
        }

        // Final Big Boss: 10:00 (600s)
        if (this.runTime >= 600 && !this.finalBossSpawned) {
            this.finalBossSpawned = true;
            return this.spawnFinalBoss(player);
        }

        return null;
    }

    getAvailableEnemyTypes(runTime) {
        if (runTime < 60) {
            return ['smallAfreet', 'cryptBat'];
        } else if (runTime < 120) {
            return ['smallAfreet', 'cryptBat', 'fastAfreet'];
        } else if (runTime < 180) {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet'];
        } else if (runTime < 240) {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet', 'explodingGhoul'];
        } else if (runTime < 300) {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet', 'explodingGhoul', 'djinnShaman'];
        } else if (runTime < 420) {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet', 'explodingGhoul', 'djinnShaman', 'cryptBat'];
        } else {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet', 'explodingGhoul', 'djinnShaman', 'giantAfreet', 'cryptBat'];
        }
    }

    spawnMiniBoss(player, bossId, announcement) {
        damageSystem.spawnText(player.x, player.y - 40, announcement, false, '#f59e0b');
        audioSystem.playBossRoar();

        const spawnDist = 420;
        const angle = Math.random() * Math.PI * 2;
        const bx = player.x + Math.cos(angle) * spawnDist;
        const by = player.y + Math.sin(angle) * spawnDist;

        return bossRegistry.create(bossId, bx, by, 1.0);
    }

    spawnFinalBoss(player) {
        damageSystem.spawnText(player.x, player.y - 60, '👑 ظهر سلطان الجان الأعظم (المعركة الأخيرة)!', false, '#ef4444');
        audioSystem.playBossRoar();

        const spawnDist = 480;
        const angle = Math.random() * Math.PI * 2;
        const bx = player.x + Math.cos(angle) * spawnDist;
        const by = player.y + Math.sin(angle) * spawnDist;

        return bossRegistry.create('afreetKing', bx, by, 1.2);
    }
}

export const waveSystem = new WaveSystem();
