/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Ranged Afreet (عفريت القاذف / Sand Spitter)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';

export class RangedAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 16,
            enemyType: 'rangedAfreet',
            enemyName: 'عفريت القاذف',
            hp: Math.round(45 * difficultyMultiplier),
            speed: 85,
            damage: Math.round(14 * difficultyMultiplier),
            xpValue: 18,
            coinDropChance: 0.22,
            coinValue: 15,
            attackCooldown: 2.2
        });
        this.preferredDistance = 240;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Maintain distance from player
        if (dist < this.preferredDistance - 40) {
            // Back away
            this.x -= (dx / dist) * this.speed * dt;
            this.y -= (dy / dist) * this.speed * dt;
        } else if (dist > this.preferredDistance + 40) {
            // Approach
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
        }

        this.facingDirection = dx >= 0 ? 1 : -1;

        // Shoot sand bolt projectile
        if (dist <= 380 && this.attackTimer <= 0 && projectiles) {
            this.attackTimer = this.attackCooldown;
            const angle = Math.atan2(dy, dx);
            projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 220,
                vy: Math.sin(angle) * 220,
                speed: 220,
                radius: 7,
                damage: this.damage,
                damageType: DAMAGE_TYPES.PHYSICAL,
                duration: 2.5,
                weaponId: 'sandBolt',
                spriteKey: 'sandBolt',
                isEnemy: true,
                rotation: angle
            }));
        }
    }
}
