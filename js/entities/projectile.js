/**
 * حارة العفاريت — Harat El Afareet
 * Modular Projectile Entity
 */

import { DAMAGE_TYPES } from '../data/constants.js';
import { particleSystem } from '../systems/particleSystem.js';

export class Projectile {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.speed = config.speed || 300;
        this.radius = config.radius || 8;
        this.damage = config.damage || 15;
        this.damageType = config.damageType || DAMAGE_TYPES.ARCANE;
        this.pierce = config.pierce !== undefined ? config.pierce : 1;
        this.duration = config.duration || 3.0;
        this.maxDuration = this.duration;
        this.weaponId = config.weaponId || 'magicStaff';
        this.spriteKey = config.spriteKey || 'magicStaffBolt';
        this.color = config.color || '#06b6d4';
        this.isEnemy = config.isEnemy || false;
        this.alive = true;
        this.rotation = config.rotation || 0;

        // Orbiting weapon mechanics (e.g. Magical Talisman)
        this.isOrbiting = config.isOrbiting || false;
        this.orbitRadius = config.orbitRadius || 80;
        this.orbitSpeed = config.orbitSpeed || 3.0; // Radians per sec
        this.orbitAngle = config.orbitAngle || 0;

        // Homing mechanics
        this.isHoming = config.isHoming || false;
        this.target = config.target || null;
        this.homingStrength = config.homingStrength || 5.0;

        // Explosion on hit / end
        this.explodeOnHit = config.explodeOnHit || false;
        this.explosionRadius = config.explosionRadius || 45;
        this.appliesBurn = config.appliesBurn || false;
        this.burnDamage = config.burnDamage || 5;
        this.burnDuration = config.burnDuration || 3.0;

        // Hit tracking to avoid multi-hitting same enemy on same frame
        this.hitEntities = new Set();
        this.hitCooldowns = new Map(); // entity -> cooldown
    }

    update(dt, player, enemies) {
        if (!this.alive) return;

        // Manage hit cooldowns for persistent / orbiting projectiles
        for (const [entity, cd] of this.hitCooldowns.entries()) {
            const nextCd = cd - dt;
            if (nextCd <= 0) {
                this.hitCooldowns.delete(entity);
            } else {
                this.hitCooldowns.set(entity, nextCd);
            }
        }

        // 1. Orbiting Projectile Behavior
        if (this.isOrbiting && player) {
            this.orbitAngle += this.orbitSpeed * dt;
            this.x = player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
            this.y = player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
            this.rotation = this.orbitAngle + Math.PI / 2;
            return;
        }

        // 2. Linear / Homing Projectile Behavior
        this.duration -= dt;
        if (this.duration <= 0) {
            this.expire();
            return;
        }

        // Homing steering
        if (this.isHoming && this.target && this.target.alive) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const targetAngle = Math.atan2(dy, dx);
            let currentAngle = Math.atan2(this.vy, this.vx);

            // Interpolate angle
            let diff = targetAngle - currentAngle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            currentAngle += diff * Math.min(1.0, this.homingStrength * dt);
            this.vx = Math.cos(currentAngle) * this.speed;
            this.vy = Math.sin(currentAngle) * this.speed;
            this.rotation = currentAngle;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Particle trail
        if (this.weaponId === 'fireWand' && Math.random() < 0.4) {
            particleSystem.emit({
                x: this.x,
                y: this.y,
                color: '#f97316',
                size: 2.5,
                life: 0.18,
                drag: 0.85
            });
        }
    }

    canHit(entity) {
        if (!this.alive) return false;
        if (this.hitCooldowns.has(entity)) return false;
        if (this.isOrbiting) return true;
        return !this.hitEntities.has(entity);
    }

    onHit(entity) {
        if (this.isOrbiting) {
            this.hitCooldowns.set(entity, 0.4); // 0.4s hit immunity for orbiting talisman
            return;
        }

        this.hitEntities.add(entity);
        this.pierce -= 1;

        if (this.explodeOnHit) {
            this.triggerExplosion();
        }

        if (this.pierce <= 0) {
            this.alive = false;
        }
    }

    expire() {
        if (this.explodeOnHit) {
            this.triggerExplosion();
        }
        this.alive = false;
    }

    triggerExplosion() {
        particleSystem.emitFireExplosion(this.x, this.y, this.explosionRadius);
    }
}
