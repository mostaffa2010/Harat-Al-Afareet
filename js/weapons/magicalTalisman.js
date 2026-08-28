/**
 * حارة العفاريت — Harat El Afareet
 * Primary Weapon: حجاب عين حورس (الست ليلى حصرياً)
 * Max 5 Levels -> Level 5 (أسطورة الحارة)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';

export class MagicalTalisman extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'magicalTalisman',
            name: 'حجاب عين حورس',
            description: 'تمائم فرعونية تلف حوالين اللاعب وتصد أي عفريت يقرب.',
            icon: '🧿',
            damage: 28,
            cooldown: 9999,
            projectileSpeed: 0,
            projectileCount: 2,
            range: 130,
            critChance: 0.10,
            knockback: 220,
            pierce: 999,
            damageType: DAMAGE_TYPES.ARCANE
        });
        this.isPrimary = true;
        this.isEvolved = false;
        this.orbitRadius = 75;
        this.orbitSpeed = 3.2;
        this.spawnedProjectiles = [];
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 40;
            this.orbitSpeed = 4.0;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 56;
            this.projectileCount = 3;
            this.orbitRadius = 88;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 78;
            this.projectileCount = 4;
            this.orbitSpeed = 4.8;
            this.critChance = 0.20;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'درع حورس السماوي (أسطورة الحارة)';
            this.icon = '𓂀✨';
            this.damage = 130;
            this.projectileCount = 6;
            this.orbitSpeed = 6.0;
            this.orbitRadius = 110;
            this.critChance = 0.30;
        }

        this.refreshProjectiles();
    }

    refreshProjectiles() {
        for (const p of this.spawnedProjectiles) {
            p.alive = false;
        }
        this.spawnedProjectiles = [];
    }

    update(dt, enemies, projectiles) {
        if (this.spawnedProjectiles.length !== this.projectileCount) {
            this.refreshProjectiles();

            for (let i = 0; i < this.projectileCount; i++) {
                const angle = (Math.PI * 2 / this.projectileCount) * i;
                const p = new Projectile({
                    x: this.player.x + Math.cos(angle) * this.orbitRadius,
                    y: this.player.y + Math.sin(angle) * this.orbitRadius,
                    speed: 0,
                    radius: this.isEvolved ? 18 : 12,
                    damage: Math.round(this.damage * (this.player.damageMultiplier || 1.0)),
                    damageType: this.damageType,
                    pierce: 999,
                    duration: 99999,
                    weaponId: 'magicalTalisman',
                    spriteKey: this.isEvolved ? 'talismanEvolved' : 'magicalTalismanOrb',
                    color: this.isEvolved ? '#fbbf24' : '#2563eb',
                    isOrbiting: true,
                    orbitRadius: this.orbitRadius,
                    orbitSpeed: this.orbitSpeed,
                    orbitAngle: angle
                });
                this.spawnedProjectiles.push(p);
                projectiles.push(p);
            }
        }
    }
}
