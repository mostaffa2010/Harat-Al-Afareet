/**
 * حارة العفاريت — Harat El Afareet
 * Base Enemy Entity Class (Balanced Combat & Better Drop Rates)
 */

import { PICKUP_TYPES } from '../data/constants.js';
import { Pickup } from './pickup.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { damageSystem } from '../systems/damageSystem.js';

let enemyIdCounter = 0;

export class BaseEnemy {
    constructor(config) {
        this.id = ++enemyIdCounter;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.radius = config.radius || 16;
        this.enemyType = config.enemyType || 'smallAfreet';
        this.enemyName = config.enemyName || 'عفريت';

        // Stats
        this.maxHp = config.hp || 25;
        this.hp = this.maxHp;
        this.speed = config.speed || 110;
        this.damage = config.damage || 6;
        this.xpValue = config.xpValue || 5;
        this.coinDropChance = config.coinDropChance || 0.20;
        this.coinValue = config.coinValue || 10;

        // State & AI
        this.alive = true;
        this.facingDirection = 1;
        this.hurtTimer = 0;
        this.knockbackVx = 0;
        this.knockbackVy = 0;

        // Attack cooldowns
        this.attackCooldown = config.attackCooldown || 1.0;
        this.attackTimer = 0;

        // Burn Status Effect
        this.burnTimer = 0;
        this.burnDamage = 0;
        this.burnTickTimer = 0;
    }

    update(dt, player, projectiles) {
        if (!this.alive) return;

        // Timers
        if (this.hurtTimer > 0) this.hurtTimer -= dt;
        if (this.attackTimer > 0) this.attackTimer -= dt;

        // Process Burn DoT
        if (this.burnTimer > 0) {
            this.burnTimer -= dt;
            this.burnTickTimer += dt;
            if (this.burnTickTimer >= 0.5) {
                this.burnTickTimer = 0;
                this.takeDamage(this.burnDamage, null, false);
                particleSystem.emit({
                    x: this.x + (Math.random() * 12 - 6),
                    y: this.y + (Math.random() * 12 - 6),
                    color: '#f97316',
                    size: 3,
                    life: 0.2,
                    drag: 0.9
                });
            }
        }

        // Apply knockback decay
        this.x += this.knockbackVx * dt;
        this.y += this.knockbackVy * dt;
        this.knockbackVx *= 0.86;
        this.knockbackVy *= 0.86;

        this.updateAI(dt, player, projectiles);
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

        // Contact attack
        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }

    applyBurn(damage, duration, player) {
        this.burnDamage = damage;
        this.burnTimer = duration;
        this.burnTickTimer = 0;

        if (player && player.characterId === 'fireMage' && Math.random() < 0.40) {
            particleSystem.emitFireExplosion(this.x, this.y, 30);
        }
    }

    applyKnockback(vx, vy, force = 220) {
        this.knockbackVx += vx * force;
        this.knockbackVy += vy * force;
    }

    takeDamage(damage, player = null, triggerHurtFlash = true, knockback = null) {
        if (!this.alive) return;

        this.hp -= damage;
        if (triggerHurtFlash) this.hurtTimer = 0.12;

        if (knockback) {
            this.applyKnockback(knockback.x, knockback.y, knockback.force);
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.die(player);
        }
    }

    die(player = null) {
        this.alive = false;
        particleSystem.emitDeathExplosion(this.x, this.y, '#7e22ce', 14);
        audioSystem.playEnemyDeath();

        if (player && player.characterId === 'fireMage') {
            particleSystem.emitHitSparks(this.x, this.y, '#f97316', 10);
        }
    }

    createDropPickups() {
        const drops = [];

        let xpType = PICKUP_TYPES.XP_SMALL;
        if (this.xpValue >= 45) xpType = PICKUP_TYPES.XP_LARGE;
        else if (this.xpValue >= 15) xpType = PICKUP_TYPES.XP_MEDIUM;

        drops.push(new Pickup(this.x, this.y, xpType, this.xpValue));

        // 20% Coin Drop
        if (Math.random() < this.coinDropChance) {
            drops.push(new Pickup(this.x + 8, this.y + 4, PICKUP_TYPES.COIN, this.coinValue));
        }

        // 5.5% Health Potion Drop (Generous healing in Egyptian alley)
        if (Math.random() < 0.055) {
            drops.push(new Pickup(this.x - 8, this.y - 4, PICKUP_TYPES.HEALTH, 35));
        }

        // 1.2% Magnet Scarab
        if (Math.random() < 0.012) {
            drops.push(new Pickup(this.x, this.y, PICKUP_TYPES.MAGNET, 1));
        }

        return drops;
    }
}
