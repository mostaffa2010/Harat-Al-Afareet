/**
 * حارة العفاريت — Harat El Afareet
 * Primary Weapon: الخرزانة السحرية (الواد زكي حصرياً)
 * Level 8 Evolution: عصا الحكيم الأعظم (Arch-Sage Staff)
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
            damage: 22,
            cooldown: 0.95,
            projectileSpeed: 380,
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
            this.damage = 28;
            this.projectileCount = 2;
        } else if (level === 3) {
            this.damage = 36;
            this.cooldown = 0.85;
            this.pierce = 2;
        } else if (level === 4) {
            this.damage = 45;
            this.projectileCount = 3;
        } else if (level === 5) {
            this.damage = 56;
            this.cooldown = 0.75;
            this.critChance = 0.15;
        } else if (level === 6) {
            this.damage = 70;
            this.projectileCount = 4;
            this.pierce = 3;
        } else if (level === 7) {
            this.damage = 88;
            this.cooldown = 0.65;
            this.projectileSpeed = 440;
        } else if (level >= 8) {
            // Level 8 Evolution: عصا الحكيم الأعظم
            this.isEvolved = true;
            this.name = 'عصا الحكيم الأعظم (تطور أسطوري)';
            this.icon = '✨🪄';
            this.damage = 135;
            this.projectileCount = 5;
            this.pierce = 999; // Infinite pierce!
            this.cooldown = 0.50;
            this.critChance = 0.28;
            this.projectileSpeed = 500;
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
