/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Fast Afreet (عفريت الريح / Djinn Stalker)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';

export class FastAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 15,
            enemyType: 'fastAfreet',
            enemyName: 'عفريت الريح',
            hp: Math.round(38 * difficultyMultiplier),
            speed: 165 + Math.random() * 25,
            damage: Math.round(12 * difficultyMultiplier),
            xpValue: 12,
            coinDropChance: 0.18,
            coinValue: 10,
            attackCooldown: 0.7
        });
        this.dashTimer = 0;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Flanking / burst speed behavior
        this.dashTimer += dt;
        let currentSpeed = this.speed;
        if (this.dashTimer > 3.0) {
            currentSpeed *= 1.8; // Quick burst
            if (this.dashTimer > 3.8) this.dashTimer = 0;
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
