/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 4: شفرات النحاس الطايرة (Flying Brass Blades)
 * Max 5 Levels
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class HunterShotgun extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'hunterShotgun',
            name: 'شفرات النحاس الطايرة',
            description: 'شفرات نحاسية سحرية تنتشر بزاوية واسعة وتقطع صفوف العفاريت.',
            icon: '🗡️',
            damage: 32,
            cooldown: 1.5,
            projectileSpeed: 420,
            projectileCount: 3,
            range: 360,
            critChance: 0.15,
            knockback: 280,
            pierce: 2,
            damageType: DAMAGE_TYPES.PHYSICAL
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 44;
            this.projectileCount = 4;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 60;
            this.projectileCount = 5;
            this.cooldown = 1.3;
            this.pierce = 3;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 85;
            this.projectileCount = 7;
            this.critChance = 0.25;
            this.knockback = 380;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'طوفان الشفرات الفرعونية (أسطورة الحارة)';
            this.icon = '👑🗡️';
            this.damage = 145;
            this.projectileCount = 12; // Massive 360 radial storm!
            this.cooldown = 0.85;
            this.critChance = 0.38;
            this.pierce = 999;
            this.knockback = 500;
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
                angle = (Math.PI * 2 / count) * i;
            } else {
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
