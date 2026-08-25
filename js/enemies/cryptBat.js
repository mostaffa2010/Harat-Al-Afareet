/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Crypt Bat (خفاش المقابر)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';

export class CryptBat extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 12,
            enemyType: 'cryptBat',
            enemyName: 'خفاش المقابر',
            hp: Math.round(14 * difficultyMultiplier),
            speed: 175 + Math.random() * 25,
            damage: Math.round(5 * difficultyMultiplier),
            xpValue: 4,
            coinDropChance: 0.15,
            coinValue: 5,
            attackCooldown: 0.6
        });
        this.sineTimer = Math.random() * 10;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        this.sineTimer += dt * 6.0;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            // Zig-zag swooping movement
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const wave = Math.sin(this.sineTimer) * 70;

            this.x += ((dx / dist) * this.speed + perpX * wave) * dt;
            this.y += ((dy / dist) * this.speed + perpY * wave) * dt;
            this.facingDirection = dx >= 0 ? 1 : -1;
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }
}
