/**
 * حارة العفاريت — Harat El Afareet
 * Upgrade Registry (Clear 3-Category Distinction: New Weapon, Weapon Upgrade, Hero Stat)
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

        // Category 1: Player Stats & Passives (ميزة وقوة للبطل)
        for (let i = 0; i < this.upgrades.length; i++) {
            const up = this.upgrades[i];
            const currentLvl = playerUpgradeLevels[up.id] || 0;
            if (currentLvl < up.maxLevel && up.canApply(player)) {
                eligible.push({
                    type: 'STAT',
                    categoryName: 'ميزة وقوة للبطل',
                    categoryBadge: '🛡️ ميزة للبطل',
                    categoryColor: '#10b981',
                    id: up.id,
                    name: up.name,
                    description: up.description,
                    icon: up.icon,
                    themeColor: up.themeColor || '#10b981',
                    level: currentLvl + 1,
                    maxLevel: up.maxLevel,
                    apply: () => {
                        up.apply(player);
                        playerUpgradeLevels[up.id] = currentLvl + 1;
                    }
                });
            }
        }

        // Category 2: Existing Weapon Level-Ups (ترقية سلاحك)
        for (let i = 0; i < player.weapons.length; i++) {
            const wep = player.weapons[i];
            if (wep.level < wep.maxLevel) {
                eligible.push({
                    type: 'WEAPON_UPGRADE',
                    categoryName: 'ترقية سلاح حالي',
                    categoryBadge: '🔄 ترقية سلاحك',
                    categoryColor: '#f59e0b',
                    id: `weapon_${wep.id}`,
                    name: `ترقية ${wep.name}`,
                    description: `رفع مستوى ${wep.name} للمستوى ${wep.level + 1} لزيادة الضرر والسرعة.`,
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

        // Category 3: New Weapon Unlocks (سلاح هجومي جديد)
        const allWeaponIds = ['magicStaff', 'fireWand', 'lightningRod', 'magicalTalisman'];
        const currentWeaponIds = player.weapons.map(w => w.id);
        const availableNewWeapons = allWeaponIds.filter(id => !currentWeaponIds.includes(id));

        const weaponMeta = {
            magicStaff: { name: 'الخرزانة السحرية', desc: 'سلاح يطلق طلقات ذكية تطارد العفاريت لوحدها.', icon: '🪄' },
            fireWand: { name: 'ولاعة الجان', desc: 'كرات نارية متفجرة وحرائق متسلسلة في الحشود.', icon: '🔥' },
            lightningRod: { name: 'كهربا الحارة', desc: 'صواعق ورعود كهربائية مدمرة من السماء.', icon: '⚡' },
            magicalTalisman: { name: 'حجاب عين حورس', desc: 'تمائم سحرية تدور كخلاط وتصد أي عفريت يقرب.', icon: '🧿' }
        };

        for (let i = 0; i < availableNewWeapons.length; i++) {
            const wepId = availableNewWeapons[i];
            const meta = weaponMeta[wepId];
            if (meta) {
                eligible.push({
                    type: 'NEW_WEAPON',
                    categoryName: 'سلاح هجومي جديد',
                    categoryBadge: '⚔️ سلاح جديد',
                    categoryColor: '#06b6d4',
                    id: `new_weapon_${wepId}`,
                    name: meta.name,
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
