/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 1: كهربا الحارة (Lightning Rod)
 * Max 5 Levels (Zero Screen Shake — Clean Vertical Lightning Beam)
 */

import { BaseWeapon } from './baseWeapon.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';
import { damageSystem } from '../systems/damageSystem.js';
import { particleSystem } from '../systems/particleSystem.js';

export class LightningRod extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'lightningRod',
            name: 'كهربا الحارة',
            description: 'صواعق ورعود كهربائية تسقط من السماء على العفاريت مباشرة.',
            icon: '⚡',
            damage: 55,
            cooldown: 1.8,
            range: 480,
            projectileCount: 1,
            critChance: 0.15,
            damageType: DAMAGE_TYPES.LIGHTNING
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
        this.strikeTargets = 1;
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 80;
            this.cooldown = 1.5;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 115;
            this.strikeTargets = 2;
            this.critChance = 0.22;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 160;
            this.strikeTargets = 3;
            this.cooldown = 1.2;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'رعد السماء الأعظم (أسطورة الحارة)';
            this.icon = '⛈️⚡';
            this.damage = 250;
            this.strikeTargets = 5;
            this.cooldown = 0.85;
            this.critChance = 0.40;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findRandomEnemies(enemies, this.strikeTargets, this.range);
        if (targets.length === 0) return;

        audioSystem.playLightning();

        for (let i = 0; i < targets.length; i++) {
            const enemy = targets[i];
            if (!enemy || !enemy.alive) continue;

            const dmgResult = damageSystem.calculateDamage(this.damage, this.player, enemy, this.damageType);
            enemy.takeDamage(dmgResult.damage, this.player, true);
            damageSystem.spawnText(
                enemy.x,
                enemy.y,
                dmgResult.damage,
                dmgResult.isCrit,
                dmgResult.isCrit ? '#fde047' : (this.isEvolved ? '#38bdf8' : '#a855f7')
            );

            // Clean vertical lightning beam & spark particles (NO screen shake)
            particleSystem.emitLightningStrike(enemy.x, enemy.y, this.isEvolved ? '#38bdf8' : '#a855f7');
        }
    }
}
