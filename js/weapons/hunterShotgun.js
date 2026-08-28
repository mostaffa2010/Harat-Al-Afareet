/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 4: خرطوش الصياد (Spectral Blunderbuss)
 * Level 8 Evolution: مدفع رمضان الفتاك (Spectral Cannon Barrage)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class HunterShotgun extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'hunterShotgun',
            name: 'خرطوش الصياد',
            description: 'طلقات خردق سحرية تنتشر بزاوية واسعة تصد الحشود وتدفعها لورا.',
            icon: '🔫',
            damage: 28,
            cooldown: 1.6,
            projectileSpeed: 420,
            projectileCount: 4,
            range: 350,
            critChance: 0.15,
            knockback: 320,
            pierce: 2,
            damageType: DAMAGE_TYPES.PHYSICAL
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
    }

    applyLevelStats(level) {
        if (level === 2) {
            this.damage = 36;
            this.projectileCount = 5;
        } else if (level === 3) {
            this.damage = 46;
            this.cooldown = 1.45;
            this.pierce = 3;
        } else if (level === 4) {
            this.damage = 58;
            this.projectileCount = 6;
            this.knockback = 380;
        } else if (level === 5) {
            this.damage = 72;
            this.cooldown = 1.3;
            this.critChance = 0.25;
        } else if (level === 6) {
            this.damage = 90;
            this.projectileCount = 8;
            this.pierce = 4;
        } else if (level === 7) {
            this.damage = 115;
            this.cooldown = 1.15;
            this.projectileSpeed = 480;
        } else if (level >= 8) {
            // Level 8 Evolution: مدفع رمضان الفتاك
            this.isEvolved = true;
            this.name = 'مدفع رمضان الفتاك (تطور أسطوري)';
            this.icon = '💣🔫';
            this.damage = 195;
            this.projectileCount = 14; // Massive radial 360 blast!
            this.cooldown = 0.85;
            this.critChance = 0.40;
            this.pierce = 999;
            this.knockback = 550;
        }
    }

    fire(enemies, projectiles) {
        if (!projectiles) return;

        const targets = this.findClosestEnemies(enemies, 1, this.range);
        let baseAngle = Math.random() * Math.PI * 2;
        if (targets.length > 0) {
            const dx = targets[0].x - this.player.x;
            const dy = targets[0].y - this.player.y;
            baseAngle = Math.atan2(dy, dx);
        }

        audioSystem.playFireball();

        const count = this.projectileCount;
        for (let i = 0; i < count; i++) {
            let angle;
            if (this.isEvolved) {
                // 360 degree radial barrage!
                angle = (Math.PI * 2 / count) * i;
            } else {
                // Frontal spread cone
                const spread = (i - (count - 1) / 2) * 0.18;
                angle = baseAngle + spread;
            }

            const speed = this.projectileSpeed * (0.9 + Math.random() * 0.2);

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                speed: speed,
                radius: this.isEvolved ? 12 : 7,
                damage: Math.round(this.damage * (this.player.damageMultiplier || 1.0)),
                damageType: this.damageType,
                pierce: this.pierce,
                duration: 0.9,
                weaponId: 'hunterShotgun',
                spriteKey: this.isEvolved ? 'shotgunEvolved' : 'shotgunPellet',
                color: this.isEvolved ? '#ef4444' : '#e2e8f0',
                rotation: angle
            }));
        }
    }
}
