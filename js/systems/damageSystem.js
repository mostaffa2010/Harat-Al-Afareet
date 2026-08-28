/**
 * حارة العفاريت — Harat El Afareet
 * Combat Damage & Floating Text Engine
 */

import { DAMAGE_TYPES } from '../data/constants.js';

export class DamageSystem {
    constructor() {
        this.damageNumbers = [];
    }

    get floatingTexts() {
        return this.damageNumbers;
    }

    /**
     * Compute actual damage considering crits, multipliers, and armor
     */
    calculateDamage(baseDamage, attacker, defender, damageType = DAMAGE_TYPES.ARCANE) {
        let multiplier = (attacker && attacker.damageMultiplier) ? attacker.damageMultiplier : 1.0;
        let rawDamage = baseDamage * multiplier;

        // Roll Critical Strike
        let isCrit = false;
        const critChance = (attacker && attacker.criticalChance) ? attacker.criticalChance : 0.05;
        const critMult = (attacker && attacker.criticalMultiplier) ? attacker.criticalMultiplier : 1.8;

        if (Math.random() < critChance) {
            isCrit = true;
            rawDamage *= critMult;
        }

        // Apply Armor mitigation (if defender has armor)
        const armor = (defender && defender.armor) ? defender.armor : 0;
        const finalDamage = Math.max(1, Math.round(rawDamage - armor));

        return {
            damage: finalDamage,
            isCrit,
            damageType
        };
    }

    /**
     * Spawn floating damage number
     */
    spawnText(x, y, text, isCrit = false, color = '#ffffff') {
        this.damageNumbers.push({
            x: x + (Math.random() * 16 - 8),
            y: y - 10,
            text: String(text),
            isCrit,
            color: isCrit ? '#fde047' : color,
            life: 0.6,
            maxLife: 0.6,
            vy: -45 - (isCrit ? 20 : 0),
            alive: true
        });
    }

    update(dt) {
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const dn = this.damageNumbers[i];
            dn.life -= dt;
            if (dn.life <= 0) {
                this.damageNumbers.splice(i, 1);
                continue;
            }

            dn.y += dn.vy * dt;
            dn.vy *= 0.94; // Decelerate float
        }
    }

    reset() {
        this.clear();
    }

    clear() {
        this.damageNumbers.length = 0;
    }
}

export const damageSystem = new DamageSystem();
