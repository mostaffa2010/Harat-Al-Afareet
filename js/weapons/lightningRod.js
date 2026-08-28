/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 1: كهربا الحارة (Lightning Rod)
 * Level 8 Evolution: رعد السماء الأعظم (Cataclysmic Thunder)
 * (Zero Screen Shake — Clean Vertical Lightning Beam)
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
            damage: 48,
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
            this.damage = 65;
            this.cooldown = 1.6;
        } else if (level === 3) {
            this.damage = 85;
            this.strikeTargets = 2;
        } else if (level === 4) {
            this.damage = 110;
            this.cooldown = 1.4;
            this.critChance = 0.22;
        } else if (level === 5) {
            this.damage = 140;
            this.strikeTargets = 3;
        } else if (level === 6) {
            this.damage = 180;
            this.cooldown = 1.2;
        } else if (level === 7) {
            this.damage = 230;
            this.strikeTargets = 4;
            this.critChance = 0.30;
        } else if (level >= 8) {
            // Level 8 Evolution: رعد السماء الأعظم
            this.isEvolved = true;
            this.name = 'رعد السماء الأعظم (تطور أسطوري)';
            this.icon = '⛈️⚡';
            this.damage = 360;
            this.strikeTargets = 6;
            this.cooldown = 0.85;
            this.critChance = 0.45;
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
