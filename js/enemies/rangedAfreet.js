/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: عفريت القاذف (Yellow Ranged Spitter with 1.5s Initial Delay)
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
            hp: Math.round(38 * difficultyMultiplier),
            speed: 80,
            damage: Math.round(10 * difficultyMultiplier),
            xpValue: 18,
            coinDropChance: 0.28,
            coinValue: 18,
            attackCooldown: 2.4
        });
        this.preferredDistance = 250;
        // 1.5s initial attack delay so it doesn't shoot immediately on spawn
        this.attackTimer = 1.5;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.preferredDistance - 40) {
            this.x -= (dx / dist) * this.speed * dt;
            this.y -= (dy / dist) * this.speed * dt;
        } else if (dist > this.preferredDistance + 40) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
        }

        this.facingDirection = dx >= 0 ? 1 : -1;

        if (dist <= 380 && this.attackTimer <= 0 && projectiles) {
            this.attackTimer = this.attackCooldown;
            const angle = Math.atan2(dy, dx);
            projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 200,
                vy: Math.sin(angle) * 200,
                speed: 200,
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
