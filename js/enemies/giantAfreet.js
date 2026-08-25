/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Giant Afreet (مارد الحارة / Alley Brute)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { cameraSystem } from '../systems/cameraSystem.js';
import { particleSystem } from '../systems/particleSystem.js';

export class GiantAfreet extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 28,
            enemyType: 'giantAfreet',
            enemyName: 'مارد الحارة',
            hp: Math.round(180 * difficultyMultiplier),
            speed: 65,
            damage: Math.round(28 * difficultyMultiplier),
            xpValue: 45,
            coinDropChance: 0.60,
            coinValue: 35,
            attackCooldown: 1.8
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

        // Periodic Ground Stomp Shockwave
        this.stompTimer += dt;
        if (this.stompTimer >= 4.0) {
            this.stompTimer = 0;
            cameraSystem.triggerShake(4);
            particleSystem.emit({
                x: this.x,
                y: this.y,
                color: '#f97316',
                size: 30,
                life: 0.35,
                shape: 'ring',
                lineWidth: 4
            });

            if (dist <= 85) {
                player.takeDamage(Math.round(this.damage * 0.7));
            }
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }
}
