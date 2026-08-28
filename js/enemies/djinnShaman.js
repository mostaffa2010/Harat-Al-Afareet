/**
 * حارة العفاريت — Harat El Afareet
 * Enemy: ساحر الجان (with Initial Delay)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Projectile } from '../entities/projectile.js';
import { DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';

export class DjinnShaman extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 18,
            enemyType: 'djinnShaman',
            enemyName: 'ساحر الجان',
            hp: Math.round(55 * difficultyMultiplier),
            speed: 70,
            damage: Math.round(12 * difficultyMultiplier),
            xpValue: 28,
            coinDropChance: 0.40,
            coinValue: 25,
            attackCooldown: 2.2
        });
        this.buffTimer = 0;
        this.attackTimer = 1.5;
    }

    updateAI(dt, player, projectiles) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 230) {
            this.x -= (dx / dist) * this.speed * dt;
            this.y -= (dy / dist) * this.speed * dt;
        } else if (dist > 300) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
        }

        this.facingDirection = dx >= 0 ? 1 : -1;

        this.buffTimer += dt;
        if (this.buffTimer >= 3.0) {
            this.buffTimer = 0;
            particleSystem.emit({
                x: this.x,
                y: this.y,
                color: '#a855f7',
                size: 45,
                life: 0.4,
                shape: 'ring',
                lineWidth: 3
            });
        }

        if (dist <= 420 && this.attackTimer <= 0 && projectiles) {
            this.attackTimer = this.attackCooldown;
            const baseAngle = Math.atan2(dy, dx);

            for (let i = -1; i <= 1; i += 2) {
                const angle = baseAngle + i * 0.18;
                projectiles.push(new Projectile({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * 190,
                    vy: Math.sin(angle) * 190,
                    speed: 190,
                    radius: 8,
                    damage: this.damage,
                    damageType: DAMAGE_TYPES.ARCANE,
                    duration: 3.0,
                    weaponId: 'curseOrb',
                    spriteKey: 'sandBolt',
                    isEnemy: true,
                    rotation: angle
                }));
            }
        }
    }
}
