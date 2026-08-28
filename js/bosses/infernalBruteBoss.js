/**
 * حارة العفاريت — Harat El Afareet
 * Mini-Boss 3: مارد اللهب الملعون (Infernal Flame Brute)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Projectile } from '../entities/projectile.js';
import { Pickup } from '../entities/pickup.js';
import { PICKUP_TYPES, DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class InfernalBruteBoss extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 36,
            enemyType: 'infernalBruteBoss',
            enemyName: '🔥 مارد اللهب الملعون (زعيم المرحلة الثالثة)',
            hp: Math.round(1500 * difficultyMultiplier),
            speed: 72,
            damage: Math.round(24 * difficultyMultiplier),
            xpValue: 240,
            coinDropChance: 1.0,
            coinValue: 180,
            attackCooldown: 1.5
        });
        this.bossId = 'infernalBruteBoss';
        this.isBoss = true;
        this.isMiniBoss = true;
        this.fireNovaTimer = 0;
        this.fireNovaCooldown = 4.5;
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

        // Fire Nova Eruption
        this.fireNovaTimer += dt;
        if (this.fireNovaTimer >= this.fireNovaCooldown) {
            this.fireNovaTimer = 0;
            this.castFireNova(projectiles);
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }

    castFireNova(projectiles) {
        if (!projectiles) return;
        audioSystem.playFireball();
        particleSystem.emitFireExplosion(this.x, this.y, 60);

        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 230,
                vy: Math.sin(angle) * 230,
                speed: 230,
                radius: 10,
                damage: Math.round(this.damage * 0.65),
                damageType: DAMAGE_TYPES.FIRE,
                duration: 3.0,
                weaponId: 'infernalNova',
                spriteKey: 'sandBolt',
                isEnemy: true,
                rotation: angle
            }));
        }
    }

    die(player = null) {
        super.die(player);
        audioSystem.playBossRoar();
        particleSystem.emitDeathExplosion(this.x, this.y, '#ef4444', 35);
    }

    createDropPickups() {
        const drops = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            drops.push(new Pickup(this.x + Math.cos(angle) * 30, this.y + Math.sin(angle) * 30, PICKUP_TYPES.XP_LARGE, 80));
            drops.push(new Pickup(this.x + Math.cos(angle) * 45, this.y + Math.sin(angle) * 45, PICKUP_TYPES.COIN, 45));
        }
        drops.push(new Pickup(this.x, this.y, PICKUP_TYPES.HEALTH, 90));
        drops.push(new Pickup(this.x, this.y + 20, PICKUP_TYPES.MAGNET, 1));
        return drops;
    }
}
