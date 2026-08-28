/**
 * حارة العفاريت — Harat El Afareet
 * Primary Weapon: الخرزانة السحرية (الواد زكي حصرياً)
 * Max 5 Levels -> Level 5 (أسطورة الحارة)
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
            description: 'تطلق طلقات زرقاء سحرية تطارد العفاريت وتصيبهم بدقة.',
            icon: '🪄',
            damage: 26,
            cooldown: 0.90,
            projectileSpeed: 400,
            projectileCount: 1,
            range: 480,
            critChance: 0.08,
            knockback: 140,
            pierce: 1,
            damageType: DAMAGE_TYPES.ARCANE
        });
        this.isPrimary = true;
        this.isEvolved = false;
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 36;
            this.projectileCount = 2;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 50;
            this.cooldown = 0.75;
            this.pierce = 2;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 72;
            this.projectileCount = 3;
            this.critChance = 0.18;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'عصا الحكيم الأعظم (أسطورة الحارة)';
            this.icon = '✨🪄';
            this.damage = 115;
            this.projectileCount = 5;
            this.pierce = 999;
            this.cooldown = 0.50;
            this.critChance = 0.30;
            this.projectileSpeed = 520;
        }
    }

    fire(enemies, projectiles) {
        if (!projectiles) return;

        const targets = this.findClosestEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        audioSystem.playMagicBolt();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const baseAngle = Math.atan2(dy, dx);
            const spread = (i - (this.projectileCount - 1) / 2) * (this.isEvolved ? 0.25 : 0.18);
            const angle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * this.projectileSpeed,
                vy: Math.sin(angle) * this.projectileSpeed,
                speed: this.projectileSpeed,
                radius: this.isEvolved ? 14 : 9,
                damage: Math.round(this.damage * (this.player.damageMultiplier || 1.0)),
                damageType: this.damageType,
                pierce: this.pierce,
                duration: 3.2,
                weaponId: 'magicStaff',
                spriteKey: this.isEvolved ? 'magicStaffEvolved' : 'magicStaffBolt',
                color: this.isEvolved ? '#38bdf8' : '#06b6d4',
                isHoming: true,
                target: target,
                homingStrength: this.isEvolved ? 8.0 : 5.5,
                rotation: angle
            }));
        }
    }
}
