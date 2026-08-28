/**
 * حارة العفاريت — Harat El Afareet
 * Experience & Leveling System
 */

import { PICKUP_TYPES } from '../data/constants.js';
import { audioSystem } from './audioSystem.js';
import { particleSystem } from './particleSystem.js';
import { damageSystem } from './damageSystem.js';

export class XpSystem {
    constructor() {
        this.level = 1;
        this.currentXp = 0;
        this.baseXpRequirement = 20;
        this.xpScalingFactor = 1.35;
        this.runCoins = 0;
        this.levelUpPending = false;
    }

    reset() {
        this.level = 1;
        this.currentXp = 0;
        this.runCoins = 0;
        this.levelUpPending = false;
    }

    getXpForLevel(level) {
        return Math.round(this.baseXpRequirement * Math.pow(level, this.xpScalingFactor));
    }

    getXpRequired() {
        return this.getXpForLevel(this.level);
    }

    checkLevelUp() {
        if (this.levelUpPending) {
            this.levelUpPending = false;
            return true;
        }
        return false;
    }

    addXp(amount, player) {
        const bonus = (player && player.xpMultiplier) ? player.xpMultiplier : 1.0;
        const totalAmount = Math.max(1, Math.round(amount * bonus));
        this.currentXp += totalAmount;

        let req = this.getXpRequired();
        while (this.currentXp >= req) {
            this.currentXp -= req;
            this.level += 1;
            this.levelUpPending = true;
            req = this.getXpRequired();

            // Trigger visual & audio celebration
            if (player) {
                if (typeof particleSystem.emitLevelUpPulse === 'function') {
                    particleSystem.emitLevelUpPulse(player.x, player.y);
                } else if (typeof particleSystem.emitLevelUp === 'function') {
                    particleSystem.emitLevelUp(player.x, player.y);
                }
            }
            audioSystem.playLevelUp();
        }
    }

    addCoins(amount) {
        this.runCoins += amount;
        audioSystem.playPickupCoin();
    }

    /**
     * Handle pickup collection effects
     */
    handlePickupCollection(pickup, player, allPickups = null) {
        if (!pickup) return;

        switch (pickup.type) {
            case PICKUP_TYPES.XP_SMALL:
            case PICKUP_TYPES.XP_MEDIUM:
            case PICKUP_TYPES.XP_LARGE:
                this.addXp(pickup.value, player);
                audioSystem.playPickupXp();
                particleSystem.emitHitSparks(pickup.x, pickup.y, '#06b6d4', 6);
                break;

            case PICKUP_TYPES.COIN:
                this.addCoins(pickup.value);
                damageSystem.spawnText(pickup.x, pickup.y, `+${pickup.value}🪙`, false, '#fbbf24');
                particleSystem.emitHitSparks(pickup.x, pickup.y, '#f59e0b', 6);
                break;

            case PICKUP_TYPES.HEALTH:
                player.heal(pickup.value);
                damageSystem.spawnText(pickup.x, pickup.y, `+${pickup.value} HP`, false, '#22c55e');
                particleSystem.emitHitSparks(pickup.x, pickup.y, '#22c55e', 8);
                break;

            case PICKUP_TYPES.MAGNET:
                // Attract all existing pickups on map
                if (allPickups && Array.isArray(allPickups)) {
                    for (let i = 0; i < allPickups.length; i++) {
                        allPickups[i].isAttracted = true;
                    }
                }
                damageSystem.spawnText(player.x, player.y, '🧲 مغناطيس!', false, '#38bdf8');
                particleSystem.emitHitSparks(player.x, player.y, '#38bdf8', 12);
                break;
        }
    }
}

export const xpSystem = new XpSystem();
