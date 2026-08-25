/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: Fire Wand (صولجان اللهب / ولاعة الجان)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class FireWand extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'fireWand',
            name: 'صولجان اللهب (ولاعة الجان)',
            description: 'بتحدف كور نار متفجرة بتشوي العفاريت وبتعمل حرائق جماعية.',
            icon: '🔥',
            damage: 36,
            cooldown: 1.25,
            projectileSpeed: 310,
            projectileCount: 1,
            range: 460,
            pierce: 2,
            damageType: DAMAGE_TYPES.FIRE
        });
        this.burnDamage = 12;
        this.burnDuration = 3.0;
        this.explosionRadius = 55;
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.damage += 12;
                break;
            case 3:
                this.projectileCount += 1;
                this.explosionRadius += 12;
                break;
            case 4:
                this.burnDamage += 8;
                this.cooldown *= 0.85;
                break;
            case 5:
                this.pierce += 2;
                this.damage += 16;
                break;
            case 6:
                this.projectileCount += 1;
                this.explosionRadius += 15;
                break;
            case 7:
                this.cooldown *= 0.80;
                this.burnDamage += 10;
                break;
            case 8:
                this.projectileCount += 2;
                this.damage += 28;
                this.explosionRadius += 25;
                break;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findClosestEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        this.player.triggerCastAnimation();
        audioSystem.playFireball();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const baseAngle = Math.atan2(dy, dx);
            const spread = (this.projectileCount > 1) ? (i - (this.projectileCount - 1) / 2) * 0.22 : 0;
            const finalAngle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(finalAngle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                vy: Math.sin(finalAngle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                speed: this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                radius: 13,
                damage: this.damage,
                damageType: this.damageType,
                pierce: this.pierce,
                duration: 2.3,
                weaponId: this.id,
                spriteKey: 'fireWandBolt',
                explodeOnHit: true,
                explosionRadius: this.explosionRadius * (this.player.areaMultiplier || 1.0),
                appliesBurn: true,
                burnDamage: this.burnDamage,
                burnDuration: this.burnDuration,
                rotation: finalAngle
            }));
        }
    }
}
