/**
 * حارة العفاريت — Harat El Afareet
 * Upgrade Registry (3 Clear Card Types, 5 Max Levels, 5 Tier Colors)
 */

import { UPGRADE_TIERS } from '../data/constants.js';

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
                desc: 'صواعق ورعود كهربائية تسقط من السماء على أقرب العفاريت وتصعقهم.',
                icon: '⚡'
            },
            flyingClog: {
                id: 'flyingClog',
                name: 'قبضة الفتوات',
                desc: 'قبضات شبحية تطير وتضرب العفاريت في مسار بيضاوي وتدفعها للخلف.',
                icon: '🥊'
            },
            spiritSmoke: {
                id: 'spiritSmoke',
                name: 'بخور طرد الشياطين',
                desc: 'سحابة بخور عطرية حارقة حول البطل تذيب وتبعد العفاريت وتسممها.',
                icon: '🪔'
            },
            hunterShotgun: {
                id: 'hunterShotgun',
                name: 'شفرات النحاس الطايرة',
                desc: 'شفرات نحاسية سحرية تنتشر بزاوية واسعة وتقطع صفوف العفاريت.',
                icon: '🗡️'
            },
            acidFlask: {
                id: 'acidFlask',
                name: 'جراب الرمال المسحورة',
                desc: 'قوارير رمال مسحورة تنفجر على الأرض وتذيب وتبطئ العفاريت.',
                icon: '🏺'
            }
        };
    }

    getEligibleUpgrades(player, playerUpgradeLevels = {}) {
        const eligible = [];

        // 1. Primary Weapon Upgrade (Exclusive to player's starting weapon, max level 5)
        if (player.weapons && player.weapons.length > 0) {
            const primaryWep = player.weapons[0];
            if (primaryWep.level < 5) {
                const nextLvl = primaryWep.level + 1;
                const tier = UPGRADE_TIERS[nextLvl] || UPGRADE_TIERS[1];
                const isMax = nextLvl >= 5;

                eligible.push({
                    type: 'PRIMARY_UPGRADE',
                    categoryTag: '[سلاح أساسي]',
                    categoryBadge: isMax ? '👑 أسطورة السلاح الأساسي' : '🗡️ ترقية السلاح الأساسي',
                    categoryColor: '#0284c7',
                    id: `primary_${primaryWep.id}`,
                    name: isMax ? `تطور ${primaryWep.name} (أسطورة الحارة)` : `ترقية ${primaryWep.name}`,
                    description: isMax ? `إطلاق القوة الأسطورية الكاملة للحد الأقصى مع زيادة هائلة في الضرر وسرعة الضرب!` : `رفع قوة وسرعة ${primaryWep.name} إلى المستوى ${nextLvl} (${tier.name}).`,
                    icon: isMax ? '✨' + primaryWep.icon : primaryWep.icon,
                    level: nextLvl,
                    maxLevel: 5,
                    tier: tier,
                    apply: () => {
                        primaryWep.upgrade();
                    }
                });
            }
        }

        // 2. Equipped Secondary Weapons Upgrades (max level 5)
        if (player.weapons && player.weapons.length > 1) {
            for (let i = 1; i < player.weapons.length; i++) {
                const secWep = player.weapons[i];
                if (secWep.level < 5) {
                    const nextLvl = secWep.level + 1;
                    const tier = UPGRADE_TIERS[nextLvl] || UPGRADE_TIERS[1];
                    const isMax = nextLvl >= 5;

                    eligible.push({
                        type: 'SECONDARY_UPGRADE',
                        categoryTag: '[سلاح فرعي]',
                        categoryBadge: isMax ? '👑 أسطورة السلاح الفرعي' : '🪄 ترقية سلاح فرعي',
                        categoryColor: '#8b5cf6',
                        id: `secondary_${secWep.id}`,
                        name: isMax ? `تطور ${secWep.name} (أسطورة الحارة)` : `ترقية ${secWep.name}`,
                        description: isMax ? `تحويل السلاح لنسخته الأسطورية الفتاكة بأعلى ضرر ممكن!` : `زيادة قوة وسرعة ${secWep.name} إلى المستوى ${nextLvl} (${tier.name}).`,
                        icon: isMax ? '✨' + secWep.icon : secWep.icon,
                        level: nextLvl,
                        maxLevel: 5,
                        tier: tier,
                        apply: () => {
                            secWep.upgrade();
                        }
                    });
                }
            }
        }

        // 3. New Secondary Weapon Unlocks (from the 5 auxiliary weapons, unlocks at level 1)
        const currentWepIds = player.weapons.map(w => w.id);
        const secondaryIds = Object.keys(this.secondaryWeaponsMeta);
        const availableSecondaries = secondaryIds.filter(id => !currentWepIds.includes(id));

        for (let i = 0; i < availableSecondaries.length; i++) {
            const secId = availableSecondaries[i];
            const meta = this.secondaryWeaponsMeta[secId];
            const tier = UPGRADE_TIERS[1];

            if (meta) {
                eligible.push({
                    type: 'SECONDARY_NEW',
                    categoryTag: '[سلاح فرعي]',
                    categoryBadge: '🪄 سلاح فرعي جديد',
                    categoryColor: '#8b5cf6',
                    id: `new_secondary_${secId}`,
                    name: meta.name,
                    description: `${meta.desc} (سلاح جديد يُضاف لعتادك)`,
                    icon: meta.icon,
                    level: 1,
                    maxLevel: 5,
                    tier: tier,
                    apply: () => {
                        player.addWeapon(secId);
                    }
                });
            }
        }

        // 4. Hero Stat Passives (10 Passives, max level 5)
        for (let i = 0; i < this.heroStatUpgrades.length; i++) {
            const up = this.heroStatUpgrades[i];
            const currentLvl = playerUpgradeLevels[up.id] || 0;
            if (currentLvl < 5 && up.canApply(player)) {
                const nextLvl = currentLvl + 1;
                const tier = UPGRADE_TIERS[nextLvl] || UPGRADE_TIERS[1];
                const isMax = nextLvl >= 5;

                eligible.push({
                    type: 'HERO_STAT',
                    categoryTag: '[ميزة بطل]',
                    categoryBadge: isMax ? '⭐ أسطورة ميزة البطل' : '⭐ ميزة للبطل',
                    categoryColor: '#10b981',
                    id: up.id,
                    name: up.name,
                    description: up.description,
                    icon: up.icon,
                    level: nextLvl,
                    maxLevel: 5,
                    tier: tier,
                    apply: () => {
                        up.apply(player);
                        playerUpgradeLevels[up.id] = nextLvl;
                    }
                });
            }
        }

        return eligible;
    }
}

export const upgradeRegistry = new UpgradeRegistry();
