/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: Magic Staff (عصا الحكمة)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class MagicStaff extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'magicStaff',
            name: 'عصا الحكمة (Magic Staff)',
            description: 'تطلق مقذوفات سحرية موجهة تبحث عن أقرب عفريت.',
            icon: '🪄',
            damage: 18,
            cooldown: 0.95,
            projectileSpeed: 380,
            projectileCount: 1,
            range: 480,
            pierce: 1,
            damageType: DAMAGE_TYPES.ARCANE
        });
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.damage += 6;
                break;
            case 3:
                this.projectileCount += 1;
                break;
            case 4:
                this.cooldown *= 0.85;
                break;
            case 5:
                this.damage += 10;
                this.pierce += 1;
                break;
            case 6:
                this.projectileCount += 1;
                break;
            case 7:
                this.cooldown *= 0.80;
                break;
            case 8:
                this.damage += 18;
                this.projectileCount += 1;
                this.pierce += 1;
                break;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findClosestEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        audioSystem.playCast();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const angle = Math.atan2(dy, dx) + (Math.random() * 0.3 - 0.15);

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                vy: Math.sin(angle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                speed: this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                radius: 8,
                damage: this.damage,
                damageType: this.damageType,
                pierce: this.pierce,
                duration: 2.5,
                weaponId: this.id,
                spriteKey: 'magicStaffBolt',
                isHoming: true,
                target: target,
                homingStrength: 6.0,
                rotation: angle
            }));
        }
    }
}
