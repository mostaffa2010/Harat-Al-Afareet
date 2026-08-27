/**
 * حارة العفاريت — Harat El Afareet
 * Weapon: الخرزانة السحرية
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class MagicStaff extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'magicStaff',
            name: 'الخرزانة السحرية',
            description: 'بتحدف كور سحرية ذكية بتطارد أقرب عفريت لوحدها وتفرتكه.',
            icon: '🪄',
            damage: 24,
            cooldown: 0.85,
            projectileSpeed: 420,
            projectileCount: 1,
            range: 520,
            pierce: 1,
            damageType: DAMAGE_TYPES.ARCANE
        });
    }

    applyLevelStats(level) {
        switch (level) {
            case 2:
                this.damage += 8;
                break;
            case 3:
                this.projectileCount += 1;
                break;
            case 4:
                this.cooldown *= 0.82;
                break;
            case 5:
                this.damage += 12;
                this.pierce += 1;
                break;
            case 6:
                this.projectileCount += 1;
                break;
            case 7:
                this.cooldown *= 0.78;
                break;
            case 8:
                this.damage += 22;
                this.projectileCount += 1;
                this.pierce += 1;
                break;
        }
    }

    fire(enemies, projectiles) {
        const targets = this.findClosestEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        this.player.triggerCastAnimation();
        audioSystem.playCast();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const angle = Math.atan2(dy, dx) + (Math.random() * 0.25 - 0.12);

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                vy: Math.sin(angle) * this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                speed: this.projectileSpeed * (this.player.projectileSpeedMultiplier || 1.0),
                radius: 9,
                damage: this.damage,
                damageType: this.damageType,
                pierce: this.pierce,
                duration: 2.5,
                weaponId: this.id,
                spriteKey: 'magicStaffBolt',
                isHoming: true,
                target: target,
                homingStrength: 7.0,
                rotation: angle
            }));
        }
    }
}
