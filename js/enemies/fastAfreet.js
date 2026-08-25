/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Fast Afreet (عفريت الريح)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';

export class FastAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 15,
            enemyType: 'fastAfreet',
            enemyName: 'عفريت الريح',
            hp: Math.round(30 * difficultyMultiplier),
            speed: 155 + Math.random() * 20,
            damage: Math.round(8 * difficultyMultiplier),
            xpValue: 12,
            coinDropChance: 0.22,
            coinValue: 12,
            attackCooldown: 0.8
        });
        this.dashTimer = 0;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.dashTimer += dt;
        let currentSpeed = this.speed;
        if (this.dashTimer > 3.0) {
            currentSpeed *= 1.6;
            if (this.dashTimer > 3.7) this.dashTimer = 0;
        }

        if (dist > 1) {
            this.x += (dx / dist) * currentSpeed * dt;
            this.y += (dy / dist) * currentSpeed * dt;
            this.facingDirection = dx >= 0 ? 1 : -1;
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }
}
