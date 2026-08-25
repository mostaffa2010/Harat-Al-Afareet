/**
 * حارة العفاريت — Harat El Afareet
 * Boss: Afreet King (ملك العفاريت / Sultan El-Ghan)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Projectile } from '../entities/projectile.js';
import { Pickup } from '../entities/pickup.js';
import { PICKUP_TYPES, DAMAGE_TYPES } from '../data/constants.js';
import { cameraSystem } from '../systems/cameraSystem.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { SmallAfreet } from '../enemies/smallAfreet.js';

export class AfreetKing extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 40,
            enemyType: 'afreetKing',
            enemyName: 'ملك العفاريت (Sultan El-Ghan)',
            hp: Math.round(2000 * difficultyMultiplier),
            speed: 80,
            damage: Math.round(35 * difficultyMultiplier),
            xpValue: 300,
            coinDropChance: 1.0,
            coinValue: 200,
            attackCooldown: 1.5
        });
        this.bossId = 'afreetKing';
        this.isBoss = true;
        this.isEnraged = false;

        // Attack Phase Timers
        this.specialAttackTimer = 0;
        this.meteorCooldown = 6.0;
        this.summonCooldown = 10.0;
        this.summonTimer = 0;
    }

    updateAI(dt, player, projectiles, warnings = [], enemies = []) {
        if (!player || !player.alive) return;

        // Enrage check at 50% HP
        if (!this.isEnraged && this.hp < this.maxHp * 0.5) {
            this.isEnraged = true;
            this.speed *= 1.35;
            audioSystem.playBossRoar();
            cameraSystem.triggerShake(12);
            particleSystem.emitDeathExplosion(this.x, this.y, '#dc2626', 30);
        }

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Move toward player
        if (dist > 1) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
            this.facingDirection = dx >= 0 ? 1 : -1;
        }

        // 1. Dark Fire Breath (Spread shot)
        this.specialAttackTimer += dt;
        if (this.specialAttackTimer >= (this.isEnraged ? 2.5 : 4.0)) {
            this.specialAttackTimer = 0;
            this.castDarkFireBreath(player, projectiles);
        }

        // 2. Meteor Slam with Warning Ring
        this.meteorCooldown -= dt;
        if (this.meteorCooldown <= 0) {
            this.meteorCooldown = this.isEnraged ? 5.0 : 8.0;
            this.telegraphMeteor(player, warnings);
        }

        // 3. Minion Summon Portal (Phase 2 Enraged)
        if (this.isEnraged) {
            this.summonTimer += dt;
            if (this.summonTimer >= this.summonCooldown) {
                this.summonTimer = 0;
                this.summonMinions(enemies);
            }
        }

        // Contact attack
        if (dist <= this.radius + player.radius && this.attackTimer <= 0) {
            player.takeDamage(this.damage);
            this.attackTimer = this.attackCooldown;
        }
    }

    castDarkFireBreath(player, projectiles) {
        if (!projectiles) return;
        audioSystem.playFireball();

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const baseAngle = Math.atan2(dy, dx);
        const count = this.isEnraged ? 7 : 5;

        for (let i = 0; i < count; i++) {
            const spread = (i - (count - 1) / 2) * 0.22;
            const angle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 230,
                vy: Math.sin(angle) * 230,
                speed: 230,
                radius: 10,
                damage: Math.round(this.damage * 0.6),
                damageType: DAMAGE_TYPES.FIRE,
                duration: 3.0,
                weaponId: 'darkFireBreath',
                spriteKey: 'sandBolt',
                isEnemy: true,
                rotation: angle
            }));
        }
    }

    telegraphMeteor(player, warnings) {
        if (!warnings) return;
        const targetX = player.x + (Math.random() * 40 - 20);
        const targetY = player.y + (Math.random() * 40 - 20);
        const meteorRadius = 70;
        const warningDuration = 1.2;

        warnings.push({
            x: targetX,
            y: targetY,
            radius: meteorRadius,
            duration: warningDuration,
            timeLeft: warningDuration,
            onTrigger: (p) => {
                cameraSystem.triggerShake(14);
                audioSystem.playLightning();
                particleSystem.emitFireExplosion(targetX, targetY, meteorRadius);

                // Damage player if inside impact zone
                if (p && p.alive) {
                    const ddx = p.x - targetX;
                    const ddy = p.y - targetY;
                    if (Math.sqrt(ddx * ddx + ddy * ddy) <= meteorRadius) {
                        p.takeDamage(Math.round(this.damage * 1.2));
                    }
                }
            }
        });
    }

    summonMinions(enemies) {
        if (!enemies) return;
        audioSystem.playBossRoar();
        particleSystem.emit({
            x: this.x,
            y: this.y,
            color: '#7e22ce',
            size: 60,
            life: 0.5,
            shape: 'ring',
            lineWidth: 5
        });

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i;
            const sx = this.x + Math.cos(angle) * 50;
            const sy = this.y + Math.sin(angle) * 50;
            enemies.push(new SmallAfreet(sx, sy, 1.2));
        }
    }

    die(player = null) {
        super.die(player);
        cameraSystem.triggerShake(22);
        audioSystem.playBossRoar();

        // Massive firework explosion
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                particleSystem.emitFireExplosion(
                    this.x + (Math.random() * 60 - 30),
                    this.y + (Math.random() * 60 - 30),
                    60
                );
            }, i * 150);
        }
    }

    createDropPickups() {
        const drops = [];
        // Super massive chest with multiple XP crystals and coins
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            drops.push(new Pickup(this.x + Math.cos(angle) * 30, this.y + Math.sin(angle) * 30, PICKUP_TYPES.XP_LARGE, 100));
            drops.push(new Pickup(this.x + Math.cos(angle) * 45, this.y + Math.sin(angle) * 45, PICKUP_TYPES.COIN, 40));
        }
        drops.push(new Pickup(this.x, this.y, PICKUP_TYPES.HEALTH, 100));
        drops.push(new Pickup(this.x, this.y + 20, PICKUP_TYPES.MAGNET, 1));
        return drops;
    }
}
