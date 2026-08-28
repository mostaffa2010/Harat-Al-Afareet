/**
 * حارة العفاريت — Harat El Afareet
 * Primary Weapon: ولاعة الجان (الأسطى ريان حصرياً)
 * Level 8 Evolution: جحيم الشمس الحارق (Solar Sunfire Wand)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class FireWand extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'fireWand',
            name: 'ولاعة الجان',
            description: 'تطلق كرات نار متفجرة تشعل العفاريت بحرائق متسلسلة.',
            icon: '🔥',
            damage: 32,
            cooldown: 1.25,
            projectileSpeed: 300,
            projectileCount: 1,
            range: 440,
            critChance: 0.12,
            knockback: 180,
            pierce: 1,
            damageType: DAMAGE_TYPES.FIRE
        });
        this.isPrimary = true;
        this.isEvolved = false;
        this.explosionRadius = 45;
    }

    applyLevelStats(level) {
        if (level === 2) {
            this.damage = 42;
            this.explosionRadius = 55;
        } else if (level === 3) {
            this.damage = 54;
            this.projectileCount = 2;
            this.cooldown = 1.15;
        } else if (level === 4) {
            this.damage = 70;
            this.explosionRadius = 68;
        } else if (level === 5) {
            this.damage = 88;
            this.projectileCount = 3;
            this.cooldown = 1.0;
        } else if (level === 6) {
            this.damage = 110;
            this.explosionRadius = 82;
            this.critChance = 0.22;
        } else if (level === 7) {
            this.damage = 138;
            this.projectileCount = 4;
            this.cooldown = 0.88;
        } else if (level >= 8) {
            // Level 8 Evolution: جحيم الشمس الحارق
            this.isEvolved = true;
            this.name = 'جحيم الشمس الحارق (تطور أسطوري)';
            this.icon = '☀️🔥';
            this.damage = 220;
            this.projectileCount = 5;
            this.explosionRadius = 120;
            this.cooldown = 0.65;
            this.critChance = 0.35;
        }
    }

    fire(enemies, projectiles) {
        if (!projectiles) return;

        const targets = this.findClosestEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        audioSystem.playFireball();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const baseAngle = Math.atan2(dy, dx);
            const spread = (i - (this.projectileCount - 1) / 2) * (this.isEvolved ? 0.28 : 0.20);
            const angle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * this.projectileSpeed,
                vy: Math.sin(angle) * this.projectileSpeed,
                speed: this.projectileSpeed,
                radius: this.isEvolved ? 16 : 10,
                damage: Math.round(this.damage * (this.player.damageMultiplier || 1.0)),
                damageType: this.damageType,
                pierce: 1,
                duration: 2.8,
                weaponId: 'fireWand',
                spriteKey: this.isEvolved ? 'fireWandEvolved' : 'fireWandFireball',
                color: this.isEvolved ? '#fbbf24' : '#ef4444',
                explodeOnHit: true,
                explosionRadius: this.explosionRadius,
                appliesBurn: true,
                burnDamage: this.isEvolved ? 25 : 8,
                burnDuration: 3.5,
                rotation: angle
            }));
        }
    }
}
