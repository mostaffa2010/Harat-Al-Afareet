/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 5: شيشة الأرواح (Spirit Shisha Smoke)
 * Level 8 Evolution: سحابة الجان الخانقة (Eternal Spirit Fog)
 */

import { BaseWeapon } from './baseWeapon.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';

export class SpiritSmoke extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'spiritSmoke',
            name: 'شيشة الأرواح',
            description: 'سحابة دخان معسل سحري حوالين اللاعب تسمم وتبطئ العفاريت اللي تقرب.',
            icon: '💨',
            damage: 16,
            cooldown: 1.5,
            range: 160,
            critChance: 0.08,
            damageType: DAMAGE_TYPES.POISON
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
        this.smokeRadius = 130;
    }

    applyLevelStats(level) {
        if (level === 2) {
            this.damage = 22;
            this.smokeRadius = 150;
        } else if (level === 3) {
            this.damage = 30;
            this.cooldown = 1.35;
        } else if (level === 4) {
            this.damage = 40;
            this.smokeRadius = 175;
        } else if (level === 5) {
            this.damage = 52;
            this.cooldown = 1.15;
            this.critChance = 0.18;
        } else if (level === 6) {
            this.damage = 68;
            this.smokeRadius = 200;
        } else if (level === 7) {
            this.damage = 88;
            this.cooldown = 0.95;
        } else if (level >= 8) {
            // Level 8 Evolution: سحابة الجان الخانقة
            this.isEvolved = true;
            this.name = 'سحابة الجان الخانقة (تطور أسطوري)';
            this.icon = '🟣💨';
            this.damage = 150;
            this.smokeRadius = 260;
            this.cooldown = 0.65;
            this.critChance = 0.30;
        }
    }

    fire(enemies, projectiles) {
        if (!enemies) return;

        // Emit smoke particles
        particleSystem.emit({
            x: this.player.x + (Math.random() * 40 - 20),
            y: this.player.y + (Math.random() * 40 - 20),
            color: this.isEvolved ? '#a855f7' : '#94a3b8',
            size: this.smokeRadius * 0.8,
            life: 0.6,
            shape: 'circle',
            alpha: 0.35
        });

        const radiusSq = this.smokeRadius * this.smokeRadius;
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!e || !e.alive) continue;
            const dx = e.x - this.player.x;
            const dy = e.y - this.player.y;
            if (dx * dx + dy * dy <= radiusSq) {
                const finalDmg = Math.round(this.damage * (this.player.damageMultiplier || 1.0));
                e.takeDamage(finalDmg, this.damageType);
                // Apply slow
                if (e.speed) {
                    e.speed = Math.max(25, e.speed * (this.isEvolved ? 0.55 : 0.75));
                }
            }
        }
    }
}
