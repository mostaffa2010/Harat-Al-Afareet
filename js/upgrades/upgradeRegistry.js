/**
 * حارة العفاريت — Harat El Afareet
 * Upgrade Registry (Exclusive Primary, 5 Secondaries, 10 Hero Passives, 6 Rarity Tiers)
 */

import { UPGRADE_RARITIES } from '../data/constants.js';

import { movementSpeedUpgrade } from './player/movementSpeed.js';
import { maxHealthUpgrade } from './player/maxHealth.js';
import { pickupRangeUpgrade } from './player/pickupRange.js';
import { armorShieldUpgrade } from './player/armorShield.js';
import { healthRegenUpgrade } from './player/healthRegen.js';

import { criticalChanceUpgrade } from './general/criticalChance.js';
import { attackSpeedUpgrade } from './general/attackSpeed.js';
import { areaOfEffectUpgrade } from './general/areaOfEffect.js';
import { xpBoostUpgrade } from './general/xpBoost.js';
import { rawDamageUpgrade } from './general/rawDamage.js';

export class UpgradeRegistry {
    constructor() {
        this.heroStatUpgrades = [
            movementSpeedUpgrade,
            maxHealthUpgrade,
            pickupRangeUpgrade,
            armorShieldUpgrade,
            healthRegenUpgrade,
            criticalChanceUpgrade,
            attackSpeedUpgrade,
            areaOfEffectUpgrade,
            xpBoostUpgrade,
            rawDamageUpgrade
        ];

        this.secondaryWeaponsMeta = {
            lightningRod: {
                id: 'lightningRod',
                name: 'كهربا الحارة',
                desc: 'صواعق ورعود كهربائية مدمرة تسقط من السماء على أقرب العفاريت.',
                icon: '⚡'
            },
            flyingClog: {
                id: 'flyingClog',
                name: 'قبقاب الفتوة',
                desc: 'قبقاب خشب سحري يطير ويلف ويدور في مسار بيضاوي يكسر عظام أي عفريت.',
                icon: '🪵'
            },
            acidFlask: {
                id: 'acidFlask',
                name: 'مية النار السحرية',
                desc: 'قزازة مية نار تترمى على الأرض وتعمل بقعة كاوية تحرق وتذيب العفاريت.',
                icon: '🧪'
            },
            hunterShotgun: {
                id: 'hunterShotgun',
                name: 'خرطوش الصياد',
                desc: 'طلقات خردق سحرية تنتشر بزاوية واسعة تصد الحشود وتعمل زقة قوية لورا.',
                icon: '🔫'
            },
            spiritSmoke: {
                id: 'spiritSmoke',
                name: 'شيشة الأرواح',
                desc: 'سحابة دخان معسل سحري حوالين اللاعب تسمم وتبطئ العفاريت اللي تقرب.',
                icon: '💨'
            }
        };
    }

    rollRarity() {
        const roll = Math.random() * 100;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight) return UPGRADE_RARITIES.LEGENDARY;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight + UPGRADE_RARITIES.EPIC.weight) return UPGRADE_RARITIES.EPIC;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight + UPGRADE_RARITIES.EPIC.weight + UPGRADE_RARITIES.RARE.weight) return UPGRADE_RARITIES.RARE;
        if (roll < UPGRADE_RARITIES.LEGENDARY.weight + UPGRADE_RARITIES.EPIC.weight + UPGRADE_RARITIES.RARE.weight + UPGRADE_RARITIES.UNCOMMON.weight) return UPGRADE_RARITIES.UNCOMMON;
        return UPGRADE_RARITIES.COMMON;
    }

    getEligibleUpgrades(player, playerUpgradeLevels = {}) {
        const eligible = [];

        // 1. Primary Weapon Upgrade (Only for player's starting primary weapon)
        if (player.weapons && player.weapons.length > 0) {
            const primaryWep = player.weapons[0];
            if (primaryWep.level < primaryWep.maxLevel) {
                const nextLvl = primaryWep.level + 1;
                const isEvolution = nextLvl >= 8;
                eligible.push({
                    type: 'PRIMARY_UPGRADE',
                    categoryTag: '[سلاح أساسي]',
                    categoryBadge: isEvolution ? '👑 تطور أسطوري' : '🗡️ ترقية السلاح الأساسي',
                    categoryColor: '#0284c7',
                    id: `primary_${primaryWep.id}`,
                    name: isEvolution ? `تطور ${primaryWep.name} (عظمة على عظمة)` : `ترقية ${primaryWep.name}`,
                    description: isEvolution ? `إطلاق القوة الأسطورية الكاملة وتغيير شكل وقوة الضربات للحد الأقصى!` : `رفع قوة ${primaryWep.name} للمستوى ${nextLvl} لزيادة الضرر وسرعة الضرب.`,
                    icon: isEvolution ? '✨' + primaryWep.icon : primaryWep.icon,
                    level: nextLvl,
                    maxLevel: primaryWep.maxLevel,
                    forceRarity: isEvolution ? UPGRADE_RARITIES.EVOLVED : null,
                    apply: () => {
                        primaryWep.upgrade();
                    }
                });
            }
        }

        // 2. Equipped Secondary Weapons Upgrades
        if (player.weapons && player.weapons.length > 1) {
            for (let i = 1; i < player.weapons.length; i++) {
                const secWep = player.weapons[i];
                if (secWep.level < secWep.maxLevel) {
                    const nextLvl = secWep.level + 1;
                    const isEvolution = nextLvl >= 8;
                    eligible.push({
                        type: 'SECONDARY_UPGRADE',
                        categoryTag: '[سلاح فرعي]',
                        categoryBadge: isEvolution ? '👑 تطور أسطوري' : '🪄 ترقية سلاح فرعي',
                        categoryColor: '#8b5cf6',
                        id: `secondary_${secWep.id}`,
                        name: isEvolution ? `تطور ${secWep.name} (عظمة على عظمة)` : `ترقية ${secWep.name}`,
                        description: isEvolution ? `تحويل السلاح لنسخته الأسطورية الفتاكة بأعلى ضرر ممكن!` : `زيادة قوة وسرعة ${secWep.name} للمستوى ${nextLvl}.`,
                        icon: isEvolution ? '✨' + secWep.icon : secWep.icon,
                        level: nextLvl,
                        maxLevel: secWep.maxLevel,
                        forceRarity: isEvolution ? UPGRADE_RARITIES.EVOLVED : null,
                        apply: () => {
                            secWep.upgrade();
                        }
                    });
                }
            }
        }

        // 3. New Secondary Weapon Unlocks (from the 5 auxiliary weapons)
        const currentWepIds = player.weapons.map(w => w.id);
        const secondaryIds = Object.keys(this.secondaryWeaponsMeta);
        const availableSecondaries = secondaryIds.filter(id => !currentWepIds.includes(id));

        for (let i = 0; i < availableSecondaries.length; i++) {
            const secId = availableSecondaries[i];
            const meta = this.secondaryWeaponsMeta[secId];
            if (meta) {
                eligible.push({
                    type: 'NEW_SECONDARY',
                    categoryTag: '[سلاح فرعي]',
                    categoryBadge: '🪄 سلاح فرعي جديد',
                    categoryColor: '#a855f7',
                    id: `new_secondary_${secId}`,
                    name: meta.name,
                    description: meta.desc,
                    icon: meta.icon,
                    level: 1,
                    maxLevel: 8,
                    forceRarity: null,
                    apply: () => {
                        player.addWeapon(secId);
                    }
                });
            }
        }

        // 4. Hero Stat Passives (10 Passives)
        for (let i = 0; i < this.heroStatUpgrades.length; i++) {
            const up = this.heroStatUpgrades[i];
            const currentLvl = playerUpgradeLevels[up.id] || 0;
            if (currentLvl < up.maxLevel && up.canApply(player)) {
                eligible.push({
                    type: 'HERO_STAT',
                    categoryTag: '[ميزة بطل]',
                    categoryBadge: '⭐ ميزة للبطل',
                    categoryColor: '#10b981',
                    id: up.id,
                    name: up.name,
                    description: up.description,
                    icon: up.icon,
                    level: currentLvl + 1,
                    maxLevel: up.maxLevel,
                    forceRarity: null,
                    apply: () => {
                        up.apply(player);
                        playerUpgradeLevels[up.id] = currentLvl + 1;
                    }
                });
            }
        }

        return eligible;
    }
}

export const upgradeRegistry = new UpgradeRegistry();
