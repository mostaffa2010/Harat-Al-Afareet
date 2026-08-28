/**
 * حارة العفاريت — Harat El Afareet
 * Mini-Boss 1: مارد الصخر الهائج (Rock Brute Mini-Boss)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Pickup } from '../entities/pickup.js';
import { PICKUP_TYPES, DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class RockBruteBoss extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 32,
            enemyType: 'rockBruteBoss',
            enemyName: '🗿 مارد الصخر الهائج (زعيم المرحلة الأولى)',
            hp: Math.round(650 * difficultyMultiplier),
            speed: 60,
            damage: Math.round(18 * difficultyMultiplier),
            xpValue: 120,
            coinDropChance: 1.0,
            coinValue: 80,
            attackCooldown: 1.8
        });
        this.bossId = 'rockBruteBoss';
        this.isBoss = true;
        this.isMiniBoss = true;
        this.stompTimer = 0;
        this.stompCooldown = 4.0;
    }

    updateAI(dt, player, projectiles, warnings = []) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
            this.facingDirection = dx >= 0 ? 1 : -1;
        }

        // Periodic shockwave stomp
        this.stompTimer += dt;
        if (this.stompTimer >= this.stompCooldown) {
            this.stompTimer = 0;
            this.triggerShockwaveStomp(player, warnings);
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }

    triggerShockwaveStomp(player, warnings) {
        audioSystem.playHit();
        particleSystem.emitShockwave(this.x, this.y, 80, '#94a3b8');

        if (player && player.alive) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= 85) {
                player.takeDamage(Math.round(this.damage * 0.7));
            }
        }
    }

    die(player = null) {
        super.die(player);
        audioSystem.playBossRoar();
        particleSystem.emitDeathExplosion(this.x, this.y, '#64748b', 25);
    }

    createDropPickups() {
        const drops = [];
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i;
            drops.push(new Pickup(this.x + Math.cos(angle) * 25, this.y + Math.sin(angle) * 25, PICKUP_TYPES.XP_LARGE, 60));
            drops.push(new Pickup(this.x + Math.cos(angle) * 35, this.y + Math.sin(angle) * 35, PICKUP_TYPES.COIN, 25));
        }
        drops.push(new Pickup(this.x, this.y, PICKUP_TYPES.HEALTH, 60));
        drops.push(new Pickup(this.x, this.y + 15, PICKUP_TYPES.MAGNET, 1));
        return drops;
    }
}
