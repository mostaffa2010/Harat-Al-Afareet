/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 2: قبضة الفتوات (Brawler's Fist / Flying Clog)
 * Max 5 Levels
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class FlyingClog extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'flyingClog',
            name: 'قبضة الفتوات',
            description: 'قبضات شبحية تطير وتضرب العفاريت في مسار بيضاوي وتدفعها للخلف.',
            icon: '🥊',
            damage: 42,
            cooldown: 2.0,
            projectileSpeed: 380,
            projectileCount: 1,
            range: 400,
            critChance: 0.12,
            knockback: 260,
            pierce: 999,
            damageType: DAMAGE_TYPES.PHYSICAL
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 60;
            this.cooldown = 1.75;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 85;
            this.projectileCount = 2;
            this.knockback = 320;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 120;
            this.projectileCount = 3;
            this.cooldown = 1.45;
            this.critChance = 0.25;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'قبضة الفتوة الأسطورية (أسطورة الحارة)';
            this.icon = '👑🥊';
            this.damage = 220;
            this.projectileCount = 5;
            this.cooldown = 1.0;
            this.critChance = 0.35;
            this.knockback = 450;
        }
    }

    fire(enemies, projectiles) {
        if (!projectiles) return;

        audioSystem.playHit();

        for (let i = 0; i < this.projectileCount; i++) {
            const angleOffset = (Math.PI * 2 / this.projectileCount) * i;
            const speed = this.projectileSpeed;

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angleOffset) * speed,
                vy: Math.sin(angleOffset) * speed,
                speed: speed,
                radius: this.isEvolved ? 20 : 13,
                damage: Math.round(this.damage * (this.player.damageMultiplier || 1.0)),
                damageType: this.damageType,
                pierce: 999,
                duration: 2.4,
                weaponId: 'flyingClog',
                spriteKey: this.isEvolved ? 'clogEvolved' : 'flyingClogItem',
                color: this.isEvolved ? '#fbbf24' : '#d97706',
                rotation: angleOffset
            }));
        }
    }
}
