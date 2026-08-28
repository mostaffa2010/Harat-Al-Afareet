/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 3: مية النار السحرية (Holy Acid Flask)
 * Level 8 Evolution: طوفان الأسيد الملكي (Royal Caustic Inferno)
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class AcidFlask extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'acidFlask',
            name: 'مية النار السحرية',
            description: 'قزازة مية نار تترمى على الأرض وتعمل بقعة كاوية تحرق العفاريت.',
            icon: '🧪',
            damage: 18, // per tick
            cooldown: 2.4,
            projectileSpeed: 260,
            projectileCount: 1,
            range: 380,
            critChance: 0.10,
            knockback: 40,
            pierce: 999,
            damageType: DAMAGE_TYPES.POISON
        });
        this.isPrimary = false;
        this.isSecondary = true;
        this.isEvolved = false;
        this.poolRadius = 50;
        this.poolDuration = 3.5;
    }

    applyLevelStats(level) {
        if (level === 2) {
            this.damage = 25;
            this.poolRadius = 60;
        } else if (level === 3) {
            this.damage = 34;
            this.projectileCount = 2;
            this.cooldown = 2.1;
        } else if (level === 4) {
            this.damage = 45;
            this.poolRadius = 75;
            this.poolDuration = 4.2;
        } else if (level === 5) {
            this.damage = 58;
            this.projectileCount = 3;
            this.cooldown = 1.85;
        } else if (level === 6) {
            this.damage = 75;
            this.poolRadius = 90;
            this.critChance = 0.20;
        } else if (level === 7) {
            this.damage = 95;
            this.projectileCount = 4;
            this.cooldown = 1.6;
        } else if (level >= 8) {
            // Level 8 Evolution: طوفان الأسيد الملكي
            this.isEvolved = true;
            this.name = 'طوفان الأسيد الملكي (تطور أسطوري)';
            this.icon = '☣️🧪';
            this.damage = 165;
            this.projectileCount = 5;
            this.poolRadius = 130;
            this.poolDuration = 6.0;
            this.cooldown = 1.2;
            this.critChance = 0.35;
        }
    }

    fire(enemies, projectiles) {
        if (!projectiles) return;

        const targets = this.findRandomEnemies(enemies, this.projectileCount, this.range);
        if (targets.length === 0) return;

        audioSystem.playMagicBolt();

        for (let i = 0; i < this.projectileCount; i++) {
            const target = targets[i % targets.length];
            const dx = target.x - this.player.x;
            const dy = target.y - this.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const duration = Math.min(1.0, dist / this.projectileSpeed);

            projectiles.push(new Projectile({
                x: this.player.x,
                y: this.player.y,
                vx: (dx / dist) * this.projectileSpeed,
                vy: (dy / dist) * this.projectileSpeed,
                speed: this.projectileSpeed,
                radius: 10,
                damage: Math.round(this.damage * (this.player.damageMultiplier || 1.0)),
                damageType: this.damageType,
                pierce: 1,
                duration: duration,
                weaponId: 'acidFlask',
                spriteKey: this.isEvolved ? 'acidFlaskEvolved' : 'acidFlaskItem',
                color: this.isEvolved ? '#22c55e' : '#10b981',
                explodeOnHit: true,
                explosionRadius: this.poolRadius,
                appliesBurn: true,
                burnDamage: Math.round(this.damage * 0.8),
                burnDuration: this.poolDuration
            }));
        }
    }
}
