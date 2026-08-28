/**
 * حارة العفاريت — Harat El Afareet
 * Boss: سلطان الجان (Zero Screen Shake)
 */

import { BaseEnemy } from '../entities/baseEnemy.js';
import { Projectile } from '../entities/projectile.js';
import { Pickup } from '../entities/pickup.js';
import { PICKUP_TYPES, DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { SmallAfreet } from '../enemies/smallAfreet.js';

export class AfreetKing extends BaseEnemy {
    constructor(x, y, difficultyMultiplier = 1.0) {
        super({
            x, y,
            radius: 40,
            enemyType: 'afreetKing',
            enemyName: 'سلطان الجان (ملك العفاريت)',
            hp: Math.round(1800 * difficultyMultiplier),
            speed: 75,
            damage: Math.round(25 * difficultyMultiplier),
            xpValue: 300,
            coinDropChance: 1.0,
            coinValue: 250,
            attackCooldown: 1.6
        });
        this.bossId = 'afreetKing';
        this.isBoss = true;
        this.isEnraged = false;

        this.specialAttackTimer = 0;
        this.meteorCooldown = 7.0;
        this.summonCooldown = 12.0;
        this.summonTimer = 0;
    }

    updateAI(dt, player, projectiles, warnings = [], enemies = []) {
        if (!player || !player.alive) return;

        if (!this.isEnraged && this.hp < this.maxHp * 0.5) {
            this.isEnraged = true;
            this.speed *= 1.3;
            audioSystem.playBossRoar();
            particleSystem.emitDeathExplosion(this.x, this.y, '#dc2626', 30);
        }

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
            this.facingDirection = dx >= 0 ? 1 : -1;
        }

        this.specialAttackTimer += dt;
        if (this.specialAttackTimer >= (this.isEnraged ? 3.0 : 4.5)) {
            this.specialAttackTimer = 0;
            this.castDarkFireBreath(player, projectiles);
        }

        this.meteorCooldown -= dt;
        if (this.meteorCooldown <= 0) {
            this.meteorCooldown = this.isEnraged ? 5.5 : 8.5;
            this.telegraphMeteor(player, warnings);
        }

        if (this.isEnraged) {
            this.summonTimer += dt;
            if (this.summonTimer >= this.summonCooldown) {
                this.summonTimer = 0;
                this.summonMinions(enemies);
            }
        }

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
        const count = this.isEnraged ? 6 : 4;

        for (let i = 0; i < count; i++) {
            const spread = (i - (count - 1) / 2) * 0.22;
            const angle = baseAngle + spread;

            projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 210,
                vy: Math.sin(angle) * 210,
                speed: 210,
                radius: 10,
                damage: Math.round(this.damage * 0.5),
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
        const meteorRadius = 65;
        const warningDuration = 1.3;

        warnings.push({
            x: targetX,
            y: targetY,
            radius: meteorRadius,
            duration: warningDuration,
            timeLeft: warningDuration,
            onTrigger: (p) => {
                audioSystem.playLightning();
                particleSystem.emitFireExplosion(targetX, targetY, meteorRadius);

                if (p && p.alive) {
                    const ddx = p.x - targetX;
                    const ddy = p.y - targetY;
                    if (Math.sqrt(ddx * ddx + ddy * ddy) <= meteorRadius) {
                        p.takeDamage(Math.round(this.damage * 0.9));
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

        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i;
            const sx = this.x + Math.cos(angle) * 50;
            const sy = this.y + Math.sin(angle) * 50;
            enemies.push(new SmallAfreet(sx, sy, 1.1));
        }
    }

    die(player = null) {
        super.die(player);
        audioSystem.playBossRoar();

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
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            drops.push(new Pickup(this.x + Math.cos(angle) * 30, this.y + Math.sin(angle) * 30, PICKUP_TYPES.XP_LARGE, 100));
            drops.push(new Pickup(this.x + Math.cos(angle) * 45, this.y + Math.sin(angle) * 45, PICKUP_TYPES.COIN, 50));
        }
        drops.push(new Pickup(this.x, this.y, PICKUP_TYPES.HEALTH, 100));
        drops.push(new Pickup(this.x, this.y + 20, PICKUP_TYPES.MAGNET, 1));
        return drops;
    }
}
