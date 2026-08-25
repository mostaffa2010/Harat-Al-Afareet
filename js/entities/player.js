/**
 * حارة العفاريت — Harat El Afareet
 * Player Character Entity
 */

import { WORLD_CONFIG } from '../data/constants.js';
import { DEFAULT_PLAYER_STATS } from '../data/defaultData.js';
import { inputSystem } from '../systems/inputSystem.js';
import { cameraSystem } from '../systems/cameraSystem.js';
import { particleSystem } from '../systems/particleSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { damageSystem } from '../systems/damageSystem.js';
import { weaponRegistry } from '../weapons/weaponRegistry.js';

export class Player {
    constructor(characterConfig, permanentUpgrades = {}) {
        this.x = WORLD_CONFIG.MAP_WIDTH / 2;
        this.y = WORLD_CONFIG.MAP_HEIGHT / 2;
        this.radius = 16;
        this.alive = true;

        // Character Identity
        this.characterId = characterConfig.id || 'apprentice';
        this.characterName = characterConfig.name || 'المبتدئ';
        this.themePrimary = characterConfig.themePrimary || '#06b6d4';
        this.themeSecondary = characterConfig.themeSecondary || '#f59e0b';
        this.passive = characterConfig.passive || null;

        // Base Stats initialized
        this.initStats(characterConfig, permanentUpgrades);

        // Movement & Animation
        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;
        this.facingDirection = 1; // 1 = right, -1 = left

        // Dash Ability
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.isDashing = false;
        this.isInvulnerable = false;

        // Hit flash
        this.hurtTimer = 0;

        // Shield (Amulet Keeper passive or upgrade)
        this.shieldHp = 0;
        this.maxShieldHp = (this.characterId === 'amuletKeeper') ? 35 : 0;
        this.shieldRegenTimer = 0;

        // Weapons Arsenal
        this.weapons = [];
        this.initStartingWeapon(characterConfig.startingWeaponId);
    }

    initStats(characterConfig, permanentUpgrades) {
        // Base multipliers + character custom baseline
        const charStats = characterConfig.baseStats || {};

        // Permanent Upgrades bonuses from save data
        const hpBonus = 1 + (permanentUpgrades.vitality || 0) * 0.10;
        const dmgBonus = 1 + (permanentUpgrades.vigor || 0) * 0.08;
        const spdBonus = 1 + (permanentUpgrades.swiftness || 0) * 0.05;
        const pickupBonus = 1 + (permanentUpgrades.talisman_magnet || 0) * 0.20;
        const xpBonus = 1 + (permanentUpgrades.ancient_wisdom || 0) * 0.10;
        const armorBonus = (permanentUpgrades.iron_will || 0) * 1.0;
        const critBonus = (permanentUpgrades.critical_eye || 0) * 0.03;

        this.maxHp = Math.round((charStats.maxHp || DEFAULT_PLAYER_STATS.maxHp || 100) * hpBonus);
        this.hp = this.maxHp;
        this.hpRegen = charStats.hpRegen || DEFAULT_PLAYER_STATS.hpRegen || 0.2;
        this.movementSpeed = (charStats.movementSpeed || DEFAULT_PLAYER_STATS.movementSpeed || 210) * spdBonus;
        this.damageMultiplier = (charStats.damageMultiplier || 1.0) * dmgBonus;
        this.attackSpeedMultiplier = charStats.attackSpeedMultiplier || 1.0;
        this.criticalChance = (charStats.criticalChance || DEFAULT_PLAYER_STATS.criticalChance || 0.05) + critBonus;
        this.criticalMultiplier = charStats.criticalMultiplier || DEFAULT_PLAYER_STATS.criticalMultiplier || 1.8;
        this.pickupRadius = (charStats.pickupRadius || DEFAULT_PLAYER_STATS.pickupRadius || 90) * pickupBonus;
        this.armor = (charStats.armor || 0) + armorBonus;
        this.xpMultiplier = (charStats.xpMultiplier || 1.0) * xpBonus;
        this.dashCooldown = charStats.dashCooldown || DEFAULT_PLAYER_STATS.dashCooldown || 3.5;
        this.dashSpeed = charStats.dashSpeed || DEFAULT_PLAYER_STATS.dashSpeed || 520;
        this.dashDuration = charStats.dashDuration || DEFAULT_PLAYER_STATS.dashDuration || 0.22;
        this.areaMultiplier = 1.0;
        this.projectileSpeedMultiplier = 1.0;
    }

    initStartingWeapon(weaponId) {
        const weaponClass = weaponRegistry.get(weaponId);
        if (weaponClass) {
            const startingWeapon = new weaponClass(this);
            this.weapons.push(startingWeapon);
        }
    }

    addWeapon(weaponId) {
        const existing = this.weapons.find(w => w.id === weaponId);
        if (existing) {
            existing.upgrade();
            return existing;
        } else {
            const weaponClass = weaponRegistry.get(weaponId);
            if (weaponClass) {
                const newWep = new weaponClass(this);
                this.weapons.push(newWep);
                return newWep;
            }
        }
        return null;
    }

    update(dt, enemies, projectiles) {
        if (!this.alive) return;

        // 1. Passive Health Regeneration
        if (this.hpRegen > 0 && this.hp < this.maxHp) {
            this.heal(this.hpRegen * dt, false);
        }

        // 2. Amulet Keeper Passive Shield Regeneration
        if (this.characterId === 'amuletKeeper') {
            this.shieldRegenTimer += dt;
            if (this.shieldRegenTimer >= 6.0) { // Every 6s restores shield
                this.shieldRegenTimer = 0;
                if (this.shieldHp < this.maxShieldHp) {
                    this.shieldHp = Math.min(this.maxShieldHp, this.shieldHp + 15);
                    particleSystem.emitHitSparks(this.x, this.y, '#38bdf8', 10);
                }
            }
        }

        // 3. Timers
        if (this.hurtTimer > 0) this.hurtTimer -= dt;
        if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= dt;

        // 4. Dash Handling
        if (inputSystem.consumeDash() && this.dashCooldownTimer <= 0 && !this.isDashing) {
            this.startDash();
        }

        if (this.isDashing) {
            this.dashTimer -= dt;
            particleSystem.emitDashTrail(this.x, this.y, this.themePrimary);

            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.isInvulnerable = false;
                this.dashCooldownTimer = this.dashCooldown;
            }
        }

        // 5. Movement Update
        const move = inputSystem.getMovement();
        const currentSpeed = this.isDashing ? this.dashSpeed : this.movementSpeed;

        if (move.x !== 0 || move.y !== 0) {
            this.isMoving = true;
            this.vx = move.x * currentSpeed;
            this.vy = move.y * currentSpeed;

            if (move.x > 0) this.facingDirection = 1;
            else if (move.x < 0) this.facingDirection = -1;
        } else if (!this.isDashing) {
            this.isMoving = false;
            this.vx = 0;
            this.vy = 0;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Clamp to map bounds
        this.x = Math.max(32, Math.min(WORLD_CONFIG.MAP_WIDTH - 32, this.x));
        this.y = Math.max(32, Math.min(WORLD_CONFIG.MAP_HEIGHT - 32, this.y));

        // Smooth Camera Follow
        cameraSystem.follow(this.x, this.y);

        // 6. Update Weapons & Auto-Fire
        for (let i = 0; i < this.weapons.length; i++) {
            this.weapons[i].update(dt, enemies, projectiles);
        }
    }

    startDash() {
        this.isDashing = true;
        this.isInvulnerable = true;
        this.dashTimer = this.dashDuration;
        audioSystem.playDash();
        cameraSystem.triggerShake(4);
    }

    takeDamage(rawDamage) {
        if (!this.alive || this.isInvulnerable) return;

        let dmgToTake = Math.max(1, rawDamage - this.armor);

        // Absorb with shield if present
        if (this.shieldHp > 0) {
            if (this.shieldHp >= dmgToTake) {
                this.shieldHp -= dmgToTake;
                damageSystem.spawnText(this.x, this.y, `🛡️ ${dmgToTake}`, false, '#38bdf8');
                particleSystem.emitHitSparks(this.x, this.y, '#38bdf8', 6);
                audioSystem.playTalismanHit();
                return;
            } else {
                dmgToTake -= this.shieldHp;
                damageSystem.spawnText(this.x, this.y, `🛡️ انكسار الدرع!`, false, '#38bdf8');
                this.shieldHp = 0;
            }
        }

        this.hp -= dmgToTake;
        this.hurtTimer = 0.2;
        damageSystem.spawnText(this.x, this.y, `-${dmgToTake}`, false, '#ef4444');
        particleSystem.emitHitSparks(this.x, this.y, '#ef4444', 8);
        audioSystem.playHit();
        cameraSystem.triggerShake(8);

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    heal(amount, showText = true) {
        if (!this.alive) return;
        const prevHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        if (showText && Math.round(this.hp - prevHp) > 0) {
            damageSystem.spawnText(this.x, this.y, `+${Math.round(this.hp - prevHp)}`, false, '#22c55e');
        }
    }

    die() {
        this.alive = false;
        particleSystem.emitDeathExplosion(this.x, this.y, this.themePrimary, 25);
        cameraSystem.triggerShake(18);
    }
}
