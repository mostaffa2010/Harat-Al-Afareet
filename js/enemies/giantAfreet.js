/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: مارد الحارة (Zero Screen Shake)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { particleSystem } from '../systems/particleSystem.js';

export class GiantAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 28,
            enemyType: 'giantAfreet',
            enemyName: 'مارد الحارة',
            hp: Math.round(150 * difficultyMultiplier),
            speed: 60,
            damage: Math.round(18 * difficultyMultiplier),
            xpValue: 45,
            coinDropChance: 0.65,
            coinValue: 40,
            attackCooldown: 2.0
        });
        this.stompTimer = 0;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
            this.facingDirection = dx >= 0 ? 1 : -1;
        }

        this.stompTimer += dt;
        if (this.stompTimer >= 4.5) {
            this.stompTimer = 0;
            particleSystem.emit({
                x: this.x,
                y: this.y,
                color: '#f97316',
                size: 32,
                life: 0.35,
                shape: 'ring',
                lineWidth: 4
            });

            if (dist <= 85) {
                player.takeDamage(Math.round(this.damage * 0.6));
            }
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }
}
