/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 2: قبقاب الفتوة (Brawler's Flying Clog)
 * Level 8 Evolution: قبقاب الفتوة الأسطوري (Titan's Heavy Clog)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class FlyingClog extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'flyingClog',
            name: 'قبقاب الفتوة',
            description: 'قبقاب خشب سحري يطير ويلف في مسار بيضاوي يكسر عظام أي عفريت.',
            icon: '🪵',
            damage: 38,
            cooldown: 2.2,
            projectileSpeed: 360,
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
            this.damage = 50;
            this.cooldown = 2.0;
        } else if (level === 3) {
            this.damage = 65;
            this.projectileCount = 2;
        } else if (level === 4) {
            this.damage = 85;
            this.cooldown = 1.75;
            this.knockback = 300;
        } else if (level === 5) {
            this.damage = 110;
            this.projectileCount = 3;
        } else if (level === 6) {
            this.damage = 145;
            this.cooldown = 1.5;
            this.critChance = 0.25;
        } else if (level === 7) {
            this.damage = 190;
            this.projectileCount = 4;
        } else if (level >= 8) {
            // Level 8 Evolution: قبقاب الفتوة الأسطوري
            this.isEvolved = true;
            this.name = 'قبقاب الفتوة الأسطوري (تطور أسطوري)';
            this.icon = '👑🪵';
            this.damage = 320;
            this.projectileCount = 5;
            this.cooldown = 1.1;
            this.critChance = 0.38;
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
