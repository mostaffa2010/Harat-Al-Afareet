/**
 * حارة العفاريت — Harat El Afareet
 * Player Character Entity (Zero Dash, Zero Screen Shake, Red Hurt Flash)
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
        this.radius = 18;
        this.alive = true;

        this.characterId = characterConfig.id || 'apprentice';
        this.characterName = characterConfig.name || 'الواد زكي';
        this.themePrimary = characterConfig.themePrimary || '#06b6d4';
        this.themeSecondary = characterConfig.themeSecondary || '#f59e0b';
        this.passive = characterConfig.passive || null;

        this.initStats(characterConfig, permanentUpgrades);

        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;
        this.facingDirection = 1;

        this.castAnimationTimer = 0;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.hurtTimer = 0; // Red hurt flash timer (0.25s)

        this.shieldHp = 0;
        this.maxShieldHp = (this.characterId === 'amuletKeeper') ? 45 : 0;
        this.shieldRegenTimer = 0;

        this.weapons = [];
        this.initStartingWeapon(characterConfig.startingWeaponId);
    }

    initStats(characterConfig, permanentUpgrades) {
        const charStats = characterConfig.baseStats || {};

        const hpBonus = 1 + (permanentUpgrades.vitality || 0) * 0.15;
        const dmgBonus = 1 + (permanentUpgrades.vigor || 0) * 0.10;
        const spdBonus = 1 + (permanentUpgrades.swiftness || 0) * 0.08;
        const pickupBonus = 1 + (permanentUpgrades.talisman_magnet || 0) * 0.25;
        const xpBonus = 1 + (permanentUpgrades.ancient_wisdom || 0) * 0.15;
        const armorBonus = (permanentUpgrades.iron_will || 0) * 1.0;
        const critBonus = (permanentUpgrades.critical_eye || 0) * 0.04;

        this.maxHp = Math.round((charStats.maxHp || DEFAULT_PLAYER_STATS.maxHp || 190) * hpBonus);
        this.hp = this.maxHp;
        this.hpRegen = charStats.hpRegen || DEFAULT_PLAYER_STATS.hpRegen || 0.5;
        this.movementSpeed = (charStats.movementSpeed || DEFAULT_PLAYER_STATS.movementSpeed || 220) * spdBonus;
        this.damageMultiplier = (charStats.damageMultiplier || 1.15) * dmgBonus;
        this.attackSpeedMultiplier = charStats.attackSpeedMultiplier || 1.0;
        this.criticalChance = (charStats.criticalChance || DEFAULT_PLAYER_STATS.criticalChance || 0.08) + critBonus;
        this.criticalMultiplier = charStats.criticalMultiplier || DEFAULT_PLAYER_STATS.criticalMultiplier || 1.85;
        this.pickupRadius = (charStats.pickupRadius || DEFAULT_PLAYER_STATS.pickupRadius || 110) * pickupBonus;
        this.armor = (charStats.armor || 1) + armorBonus;
        this.xpMultiplier = (charStats.xpMultiplier || 1.0) * xpBonus;
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

    triggerCastAnimation() {
        this.castAnimationTimer = 0.22;
        particleSystem.emit({
            x: this.x + this.facingDirection * 14,
            y: this.y - 6,
            color: this.themePrimary,
            size: 3.5,
            life: 0.18,
            drag: 0.85
        });
    }

    update(dt) {
        if (!this.alive) return;

        if (this.hpRegen > 0 && this.hp < this.maxHp) {
            this.heal(this.hpRegen * dt, false);
        }

        if (this.characterId === 'amuletKeeper') {
            this.shieldRegenTimer += dt;
            if (this.shieldRegenTimer >= 5.0) {
                this.shieldRegenTimer = 0;
                if (this.shieldHp < this.maxShieldHp) {
                    this.shieldHp = Math.min(this.maxShieldHp, this.shieldHp + 20);
                    particleSystem.emitHitSparks(this.x, this.y, '#38bdf8', 12);
                }
            }
        }

        if (this.hurtTimer > 0) this.hurtTimer -= dt;
        if (this.castAnimationTimer > 0) this.castAnimationTimer -= dt;

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
            if (this.invulnerableTimer <= 0) {
                this.isInvulnerable = false;
            }
        }

        const move = inputSystem.getMovement();
        if (move.x !== 0 || move.y !== 0) {
            this.isMoving = true;
            this.vx = move.x * this.movementSpeed;
            this.vy = move.y * this.movementSpeed;

            if (move.x > 0) this.facingDirection = 1;
            else if (move.x < 0) this.facingDirection = -1;
        } else {
            this.isMoving = false;
            this.vx = 0;
            this.vy = 0;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.x = Math.max(32, Math.min(WORLD_CONFIG.MAP_WIDTH - 32, this.x));
        this.y = Math.max(32, Math.min(WORLD_CONFIG.MAP_HEIGHT - 32, this.y));

        cameraSystem.follow(this.x, this.y);
    }

    takeDamage(rawDamage) {
        if (!this.alive || this.isInvulnerable) return;

        let dmgToTake = Math.max(1, rawDamage - this.armor);

        if (this.shieldHp > 0) {
            if (this.shieldHp >= dmgToTake) {
                this.shieldHp -= dmgToTake;
                damageSystem.spawnText(this.x, this.y, `🛡️ صـد ${dmgToTake}`, false, '#38bdf8');
                particleSystem.emitHitSparks(this.x, this.y, '#38bdf8', 8);
                audioSystem.playTalismanHit();
                this.grantInvulnerability(0.3);
                return;
            } else {
                dmgToTake -= this.shieldHp;
                damageSystem.spawnText(this.x, this.y, `🛡️ انكسر الدرع!`, false, '#38bdf8');
                this.shieldHp = 0;
            }
        }

        this.hp -= dmgToTake;
        this.hurtTimer = 0.25; // Red hurt flash for 0.25s
        this.grantInvulnerability(0.45);

        damageSystem.spawnText(this.x, this.y, `-${dmgToTake}`, false, '#ef4444');
        particleSystem.emitHitSparks(this.x, this.y, '#ef4444', 10);
        audioSystem.playHit();
        // ZERO SCREEN SHAKE

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    grantInvulnerability(duration = 0.45) {
        this.isInvulnerable = true;
        this.invulnerableTimer = Math.max(this.invulnerableTimer, duration);
    }

    heal(amount, showText = true) {
        if (!this.alive) return;
        const prevHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        if (showText && Math.round(this.hp - prevHp) > 0) {
            damageSystem.spawnText(this.x, this.y, `+${Math.round(this.hp - prevHp)} صحة 🌿`, false, '#22c55e');
        }
    }

    die() {
        this.alive = false;
        particleSystem.emitDeathExplosion(this.x, this.y, this.themePrimary, 30);
    }
}
