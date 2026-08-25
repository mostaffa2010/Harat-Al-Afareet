/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: Fire Wand (صولجان اللهب)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class FireWand extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'fireWand',
            name: 'صولجان اللهب (Fire Wand)',
            description: 'يطلق كرات نارية متفجرة تخترق الأعداء وتشعل الحروق.',
            icon: '🔥',
            damage: 28,
            cooldown: 1.4,
            projectileSpeed: 290,
            projectileCount: 1,
            range: 420,
            pierce: 2,
            damageType: DAMAGE_TYPES.FIRE
        });
        this.burnDamage = 8;
        this.burnDuration = 3.0;
        this.explosionRadius = 45;
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.damage += 10;
                break;
            case 3:
                this.projectileCount += 1;
                this.explosionRadius += 10;
                break;
            case 4:
                this.burnDamage += 5;
                this.cooldown *= 0.88;
                break;
            case 5:
                this.pierce += 2;
                this.damage += 14;
                break;
            case 6:
                this.projectileCount += 1;
                this.explosionRadius += 15;
                break;
            case 7:
                this.cooldown *= 0.82;
                this.burnDamage += 8;
                break;
            case 8:
                this.projectileCount += 2;
                this.damage += 24;
                this.explosionRadius += 20;
                break;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findClosestEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        audioSystem.playFireball();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const baseAngle = Math.atan2(dy, dx);
            const spread = (this.projectileCount > 1) ? (i - (this.projectileCount - 1) / 2) * 0.25 : 0;
            const finalAngle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(finalAngle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                vy: Math.sin(finalAngle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                speed: this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                radius: 12,
                damage: this.damage,
                damageType: this.damageType,
                pierce: this.pierce,
                duration: 2.2,
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
