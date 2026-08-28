/**
 * حارة العفاريت — Harat El Afareet
 * Upgrade Registry (Pure Egyptian Colloquial)
 */

import { fireDamageUpgrade } from './weapons/fireDamage.js';
import { projectileCountUpgrade } from './weapons/projectileCount.js';
import { lightningForkUpgrade } from './weapons/lightningFork.js';
import { talismanOrbitSpeedUpgrade } from './weapons/talismanOrbitSpeed.js';
import { staffHomingUpgrade } from './weapons/staffHoming.js';

import { movementSpeedUpgrade } from './player/movementSpeed.js';
import { maxHealthUpgrade } from './player/maxHealth.js';
import { pickupRangeUpgrade } from './player/pickupRange.js';
import { armorShieldUpgrade } from './player/armorShield.js';
import { healthRegenUpgrade } from './player/healthRegen.js';

import { criticalChanceUpgrade } from './general/criticalChance.js';
import { attackSpeedUpgrade } from './general/attackSpeed.js';
import { projectileSpeedUpgrade } from './general/projectileSpeed.js';
import { areaOfEffectUpgrade } from './general/areaOfEffect.js';
import { xpBoostUpgrade } from './general/xpBoost.js';
import { goldDiggerUpgrade } from './general/goldDigger.js';

export class UpgradeRegistry {
    constructor() {
        this.upgrades = [];
        this.registerAll();
    }

    registerAll() {
        this.upgrades = [
            fireDamageUpgrade,
            projectileCountUpgrade,
            lightningForkUpgrade,
            talismanOrbitSpeedUpgrade,
            staffHomingUpgrade,
            movementSpeedUpgrade,
            maxHealthUpgrade,
            pickupRangeUpgrade,
            armorShieldUpgrade,
            healthRegenUpgrade,
            criticalChanceUpgrade,
            attackSpeedUpgrade,
            projectileSpeedUpgrade,
            areaOfEffectUpgrade,
            xpBoostUpgrade,
            goldDiggerUpgrade
        ];
    }

    getEligibleUpgrades(player, playerUpgradeLevels = {}) {
        const eligible = [];

        // 1. Passive & Stat Upgrades
        for (let i = 0; i < this.upgrades.length; i++) {
            const up = this.upgrades[i];
            const currentLvl = playerUpgradeLevels[up.id] || 0;
            if (currentLvl < up.maxLevel && up.canApply(player)) {
                eligible.push({
                    type: 'STAT',
                    id: up.id,
                    name: up.name,
                    description: up.description,
                    icon: up.icon,
                    themeColor: up.themeColor,
                    level: currentLvl + 1,
                    maxLevel: up.maxLevel,
                    apply: () => {
                        up.apply(player);
                        playerUpgradeLevels[up.id] = currentLvl + 1;
                    }
                });
            }
        }

        // 2. Existing Weapon Level-Ups
        for (let i = 0; i < player.weapons.length; i++) {
            const wep = player.weapons[i];
            if (wep.level < wep.maxLevel) {
                eligible.push({
                    type: 'WEAPON_UPGRADE',
                    id: `weapon_${wep.id}`,
                    name: `ترقية ${wep.name}`,
                    description: `رفع مستوى السلاح لمستوى ${wep.level + 1} لزيادة الضرر وسرعة الضرب.`,
                    icon: wep.icon,
                    themeColor: '#f59e0b',
                    level: wep.level + 1,
                    maxLevel: wep.maxLevel,
                    apply: () => {
                        wep.upgrade();
                    }
                });
            }
        }

        // 3. New Weapon Unlocks
        const allWeaponIds = ['magicStaff', 'fireWand', 'lightningRod', 'magicalTalisman'];
        const currentWeaponIds = player.weapons.map(w => w.id);
        const availableNewWeapons = allWeaponIds.filter(id => !currentWeaponIds.includes(id));

        const weaponMeta = {
            magicStaff: { name: 'الخرزانة السحرية', desc: 'سلاح موجه يطلق قذائف ذكية تطارد العفاريت.', icon: '🪄' },
            fireWand: { name: 'ولاعة الجان', desc: 'كرات نارية متفجرة وحرائق متسلسلة في الحارة.', icon: '🔥' },
            lightningRod: { name: 'كهربا الحارة', desc: 'صواعق ورعود تكهرب وتفرتك العفاريت من السماء.', icon: '⚡' },
            magicalTalisman: { name: 'حجاب عين حورس', desc: 'تمائم سحرية تدور حولك وتصد العفاريت كفرامة.', icon: '🧿' }
        };

        for (let i = 0; i < availableNewWeapons.length; i++) {
            const wepId = availableNewWeapons[i];
            const meta = weaponMeta[wepId];
            if (meta) {
                eligible.push({
                    type: 'NEW_WEAPON',
                    id: `new_weapon_${wepId}`,
                    name: `سلاح جديد: ${meta.name}`,
                    description: meta.desc,
                    icon: meta.icon,
                    themeColor: '#06b6d4',
                    level: 1,
                    maxLevel: 8,
                    apply: () => {
                        player.addWeapon(wepId);
                    }
                });
            }
        }

        return eligible;
    }
}

export const upgradeRegistry = new UpgradeRegistry();
