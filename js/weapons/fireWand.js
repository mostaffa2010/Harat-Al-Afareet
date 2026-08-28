/**
 * حارة العفاريت — Harat El Afareet
 * Primary Weapon: ولاعة الجان (الأسطى ريان حصرياً)
 * Max 5 Levels -> Level 5 (أسطورة الحارة)
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
            damage: 34,
            cooldown: 1.20,
            projectileSpeed: 320,
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
            // Level 2: شغل معلمين
            this.damage = 48;
            this.explosionRadius = 60;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 68;
            this.projectileCount = 2;
            this.cooldown = 1.05;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 95;
            this.explosionRadius = 85;
            this.critChance = 0.22;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'جحيم الشمس الحارق (أسطورة الحارة)';
            this.icon = '☀️🔥';
            this.damage = 160;
            this.projectileCount = 4;
            this.explosionRadius = 120;
            this.cooldown = 0.70;
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
                burnDamage: this.isEvolved ? 25 : 10,
                burnDuration: 3.5,
                rotation: angle
            }));
        }
    }
}
