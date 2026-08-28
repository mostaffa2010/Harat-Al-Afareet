/**
 * حارة العفاريت — Harat El Afareet
 * Base Weapon Class (Max 5 Levels)
 */

import { DAMAGE_TYPES } from '../data/constants.js';

export class BaseWeapon {
    constructor(player, config = {}) {
        this.player = player;
        this.id = config.id || 'baseWeapon';
        this.name = config.name || 'سلاح';
        this.description = config.description || '';
        this.icon = config.icon || '🪄';
        this.level = 1;
        this.maxLevel = 5; // Exactly 5 levels max per design

        // Base Combat Stats
        this.damage = config.damage || 15;
        this.cooldown = config.cooldown || 1.2;
        this.cooldownTimer = 0;
        this.projectileSpeed = config.projectileSpeed || 320;
        this.projectileCount = config.projectileCount || 1;
        this.range = config.range || 400;
        this.critChance = config.critChance || 0.05;
        this.knockback = config.knockback || 150;
        this.area = config.area || 1.0;
        this.pierce = config.pierce || 1;
        this.damageType = config.damageType || DAMAGE_TYPES.ARCANE;
    }

    update(dt, enemies, projectiles) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= dt * (this.player.attackSpeedMultiplier || 1.0);
        }

        if (this.cooldownTimer <= 0) {
            if (this.canFire(enemies)) {
                this.fire(enemies, projectiles);
                this.cooldownTimer = this.cooldown;
            }
        }
    }

    canFire(enemies) {
        return enemies && enemies.length > 0;
    }

    fire(enemies, projectiles) {
        // Subclasses implement fire mechanics
    }

    upgrade() {
        if (this.level < this.maxLevel) {
            this.level += 1;
            this.applyLevelStats(this.level);
        }
    }

    applyLevelStats(level) {
        // Default upgrade progression
        this.damage = Math.round(this.damage * 1.30);
        this.cooldown = Math.max(0.35, this.cooldown * 0.90);
    }

    findClosestEnemies(enemies, count = 1, maxRange = 600) {
        const inRange = [];
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!e.alive) continue;
            const dx = e.x - this.player.x;
            const dy = e.y - this.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= maxRange) {
                inRange.push({ enemy: e, dist });
            }
        }

        inRange.sort((a, b) => a.dist - b.dist);
        return inRange.slice(0, count).map(item => item.enemy);
    }

    findRandomEnemies(enemies, count = 1, maxRange = 500) {
        const inRange = enemies.filter(e => {
            if (!e.alive) return false;
            const dx = e.x - this.player.x;
            const dy = e.y - this.player.y;
            return Math.sqrt(dx * dx + dy * dy) <= maxRange;
        });

        // Shuffle
        for (let i = inRange.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [inRange[i], inRange[j]] = [inRange[j], inRange[i]];
        }
        return inRange.slice(0, count);
    }
}
