/**
 * حارة العفاريت — Harat El Afareet
 * Mini-Boss 2: كاهن المقابر الأكبر (Grand Necro-Djinn Shaman)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Projectile } from '../entities/projectile.js';
import { Pickup } from '../entities/pickup.js';
import { PICKUP_TYPES, DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { CryptBat } from '../enemies/cryptBat.js';

export class NecroShamanBoss extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 34,
            enemyType: 'necroShamanBoss',
            enemyName: '💀 كاهن المقابر الأكبر (زعيم المرحلة الثانية)',
            hp: Math.round(1100 * difficultyMultiplier),
            speed: 68,
            damage: Math.round(22 * difficultyMultiplier),
            xpValue: 180,
            coinDropChance: 1.0,
            coinValue: 120,
            attackCooldown: 1.6
        });
        this.bossId = 'necroShamanBoss';
        this.isBoss = true;
        this.isMiniBoss = true;
        this.castTimer = 0;
        this.castCooldown = 3.5;
        this.summonTimer = 0;
        this.summonCooldown = 9.0;
    }

    updateAI(dt, player, projectiles, warnings = [], enemies = []) {
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Keep medium distance
        if (dist > 160) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
        } else if (dist < 100) {
            this.x -= (dx / dist) * (this.speed * 0.8) * dt;
            this.y -= (dy / dist) * (this.speed * 0.8) * dt;
        }
        this.facingDirection = dx >= 0 ? 1 : -1;

        // Cursed spiral barrage
        this.castTimer += dt;
        if (this.castTimer >= this.castCooldown) {
            this.castTimer = 0;
            this.castCursedBarrage(player, projectiles);
        }

        // Summon bat swarms
        this.summonTimer += dt;
        if (this.summonTimer >= this.summonCooldown) {
            this.summonTimer = 0;
            this.summonBats(enemies);
        }

        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }

    castCursedBarrage(player, projectiles) {
        if (!projectiles) return;
        audioSystem.playFireball();

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const baseAngle = Math.atan2(dy, dx);
        const count = 5;

        for (let i = 0; i < count; i++) {
            const spread = (i - (count - 1) / 2) * 0.25;
            const angle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 220,
                vy: Math.sin(angle) * 220,
                speed: 220,
                radius: 9,
                damage: Math.round(this.damage * 0.6),
                damageType: DAMAGE_TYPES.ARCANE,
                duration: 3.5,
                weaponId: 'cursedSkull',
                spriteKey: 'magicStaffBolt',
                isEnemy: true,
                rotation: angle
            }));
        }
    }

    summonBats(enemies) {
        if (!enemies) return;
        audioSystem.playBossRoar();
        particleSystem.emitDeathExplosion(this.x, this.y, '#a855f7', 15);

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i;
            const sx = this.x + Math.cos(angle) * 45;
            const sy = this.y + Math.sin(angle) * 45;
            enemies.push(new CryptBat(sx, sy, 1.1));
        }
    }

    die(player = null) {
        super.die(player);
        audioSystem.playBossRoar();
        particleSystem.emitDeathExplosion(this.x, this.y, '#9333ea', 30);
    }

    createDropPickups() {
        const drops = [];
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            drops.push(new Pickup(this.x + Math.cos(angle) * 30, this.y + Math.sin(angle) * 30, PICKUP_TYPES.XP_LARGE, 75));
            drops.push(new Pickup(this.x + Math.cos(angle) * 40, this.y + Math.sin(angle) * 40, PICKUP_TYPES.COIN, 35));
        }
        drops.push(new Pickup(this.x, this.y, PICKUP_TYPES.HEALTH, 80));
        drops.push(new Pickup(this.x, this.y + 20, PICKUP_TYPES.MAGNET, 1));
        return drops;
    }
}
