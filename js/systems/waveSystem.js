/**
 * حارة العفاريت — Harat El Afareet
 * 10-Minute Run Wave Timeline (3:00 Mini-Boss 1, 7:00 Mini-Boss 2, 10:00 Final Boss)
 */

import { bossRegistry } from '../bosses/bossRegistry.js';
import { audioSystem } from './audioSystem.js';
import { damageSystem } from './damageSystem.js';

export class WaveSystem {
    constructor() {
        this.runTime = 0;
        this.miniBoss1Spawned = false;
        this.miniBoss2Spawned = false;
        this.finalBossSpawned = false;

        this.stages = [
            { start: 0, end: 60, name: 'المرحلة 1: حارة السيدة' },
            { start: 60, end: 120, name: 'المرحلة 2: درب اللبانة' },
            { start: 120, end: 180, name: 'المرحلة 3: حوش الغجر' },
            { start: 180, end: 240, name: 'المرحلة 4: زقاق المجانين (مارد الصخر)' },
            { start: 240, end: 300, name: 'المرحلة 5: خان الجان' },
            { start: 300, end: 360, name: 'المرحلة 6: مقابر الغفير' },
            { start: 360, end: 420, name: 'المرحلة 7: سوق العفاريت' },
            { start: 420, end: 480, name: 'المرحلة 8: درب الأساطير (كاهن الجان)' },
            { start: 480, end: 540, name: 'المرحلة 9: حافة الهاوية' },
            { start: 540, end: 9999, name: 'المرحلة 10: عرش سلطان الجان (المعركة الكبرى)' }
        ];
    }

    reset() {
        this.runTime = 0;
        this.miniBoss1Spawned = false;
        this.miniBoss2Spawned = false;
        this.finalBossSpawned = false;
    }

    getCurrentStageName() {
        const stage = this.stages.find(s => this.runTime >= s.start && this.runTime < s.end);
        return stage ? stage.name : 'المرحلة 10: عرش سلطان الجان';
    }

    update(dt, player, enemies, activeBossRef) {
        this.runTime += dt;

        // Mini-Boss 1: Exactly at 3:00 (180s)
        if (this.runTime >= 180 && !this.miniBoss1Spawned) {
            this.miniBoss1Spawned = true;
            return this.spawnMiniBoss(player, 'rockBruteBoss', '🗿 هجوم مارد الصخر الجبار!');
        }

        // Mini-Boss 2: Exactly at 7:00 (420s)
        if (this.runTime >= 420 && !this.miniBoss2Spawned) {
            this.miniBoss2Spawned = true;
            return this.spawnMiniBoss(player, 'necroShamanBoss', '💀 كاهن الجان الأعظم يخرج من باطن الأرض!');
        }

        // Final Big Boss: Exactly at 10:00 (600s)
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
        } else if (runTime < 360) {
            return ['smallAfreet', 'fastAfreet', 'rangedAfreet', 'explodingGhoul', 'djinnShaman'];
        } else if (runTime < 480) {
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

        return bossRegistry.create('afreetKing', bx, by, 1.25);
    }
}

export const waveSystem = new WaveSystem();
