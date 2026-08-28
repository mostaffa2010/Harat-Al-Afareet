/**
 * حارة العفاريت — Harat El Afareet
 * Primary Weapon: حجاب عين حورس (الست ليلى حصرياً)
 * Level 8 Evolution: درع حورس السماوي (Celestial Horus Aegis)
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
            damage: 26,
            cooldown: 9999, // Persistent orbiting projectiles
            projectileSpeed: 0,
            projectileCount: 2,
            range: 120,
            critChance: 0.10,
            knockback: 220,
            pierce: 999,
            damageType: DAMAGE_TYPES.ARCANE
        });
        this.isPrimary = true;
        this.isEvolved = false;
        this.orbitRadius = 75;
        this.orbitSpeed = 3.2; // Radians per sec
        this.spawnedProjectiles = [];
    }

    applyLevelStats(level) {
        if (level === 2) {
            this.damage = 35;
            this.orbitSpeed = 3.8;
        } else if (level === 3) {
            this.damage = 46;
            this.projectileCount = 3;
            this.orbitRadius = 85;
        } else if (level === 4) {
            this.damage = 60;
            this.orbitSpeed = 4.4;
        } else if (level === 5) {
            this.damage = 76;
            this.projectileCount = 4;
            this.orbitRadius = 95;
        } else if (level === 6) {
            this.damage = 95;
            this.orbitSpeed = 5.0;
            this.critChance = 0.20;
        } else if (level === 7) {
            this.damage = 120;
            this.projectileCount = 5;
            this.orbitRadius = 105;
        } else if (level >= 8) {
            // Level 8 Evolution: درع حورس السماوي
            this.isEvolved = true;
            this.name = 'درع حورس السماوي (تطور أسطوري)';
            this.icon = '𓂀✨';
            this.damage = 185;
            this.projectileCount = 6;
            this.orbitSpeed = 6.2;
            this.orbitRadius = 120;
            this.critChance = 0.30;
        }

        // Force recreation of orbiting projectiles
        this.refreshProjectiles();
    }

    refreshProjectiles() {
        for (const p of this.spawnedProjectiles) {
            p.alive = false;
        }
        this.spawnedProjectiles = [];
    }

    update(dt, enemies, projectiles) {
        // Maintain continuous orbiting projectiles in game state
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
