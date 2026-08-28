/**
 * حارة العفاريت — Harat El Afareet
 * Secondary Weapon 5: جراب الرمال المسحورة (Enchanted Sand Whirlwind Flask)
 * Max 5 Levels
 */

import { BaseWeapon } from './baseWeapon.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { audioSystem } from '../systems/audioSystem.js';

export class AcidFlask extends BaseWeapon {
    constructor(player) {
        super(player, {
            id: 'acidFlask',
            name: 'جراب الرمال المسحورة',
            description: 'قوارير رمال مسحورة تنفجر على الأرض وتذيب وتبطئ العفاريت.',
            icon: '🏺',
            damage: 22,
            cooldown: 2.2,
            projectileSpeed: 280,
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
        this.poolRadius = 55;
        this.poolDuration = 3.5;
    }

    applyLevelStats(level) {
        if (level === 2) {
            // Level 2: شغل معلمين
            this.damage = 32;
            this.poolRadius = 68;
        } else if (level === 3) {
            // Level 3: سحر الفراعنة
            this.damage = 48;
            this.projectileCount = 2;
            this.cooldown = 1.9;
        } else if (level === 4) {
            // Level 4: بركة الأوليا
            this.damage = 70;
            this.poolRadius = 85;
            this.poolDuration = 4.5;
            this.critChance = 0.20;
        } else if (level >= 5) {
            // Level 5: أسطورة الحارة (Max)
            this.isEvolved = true;
            this.name = 'عاصفة الرمال الملكية (أسطورة الحارة)';
            this.icon = '🌪️🏺';
            this.damage = 120;
            this.projectileCount = 4;
            this.poolRadius = 120;
            this.poolDuration = 5.5;
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
                color: this.isEvolved ? '#eab308' : '#d97706',
                explodeOnHit: true,
                explosionRadius: this.poolRadius,
                appliesBurn: true,
                burnDamage: Math.round(this.damage * 0.75),
                burnDuration: this.poolDuration
            }));
        }
    }
}
