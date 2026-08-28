/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: Exploding Ghoul (العفريت المتفجر / كابوس الموت)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { particleSystem } from '../systems/particleSystem.js';
import { cameraSystem } from '../systems/cameraSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class ExplodingGhoul extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 16,
            enemyType: 'explodingGhoul',
            enemyName: 'العفريت المتفجر',
            hp: Math.round(24 * difficultyMultiplier),
            speed: 160 + Math.random() * 20,
            damage: Math.round(22 * difficultyMultiplier),
            xpValue: 16,
            coinDropChance: 0.25,
            coinValue: 15,
            attackCooldown: 1.0
        });
        this.fuseTimer = 0;
        this.isDetonating = false;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If close to player, start fuse countdown
        if (dist <= 65 && !this.isDetonating) {
            this.isDetonating = true;
            this.fuseTimer = 0.9; // 0.9s fuse before explosion
            audioSystem.playFireball();
        }

        if (this.isDetonating) {
            this.fuseTimer -= dt;
            this.speed = 40; // Slows down when preparing to burst

            // Violent red pulsing particles
            particleSystem.emit({
                x: this.x + (Math.random() * 14 - 7),
                y: this.y + (Math.random() * 14 - 7),
                color: '#ef4444',
                size: 4,
                life: 0.15,
                drag: 0.8
            });

            if (this.fuseTimer <= 0) {
                this.explode(player);
            }
        } else {
            if (dist > 1) {
                this.x += (dx / dist) * this.speed * dt;
                this.y += (dy / dist) * this.speed * dt;
                this.facingDirection = dx >= 0 ? 1 : -1;
            }
        }
    }

    explode(player) {
        this.alive = false;
        particleSystem.emitFireExplosion(this.x, this.y, 60);
        cameraSystem.triggerShake(9);
        audioSystem.playLightning();

        if (player && player.alive) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            if (Math.sqrt(dx * dx + dy * dy) <= 65) {
                player.takeDamage(this.damage);
            }
        }
    }
}
