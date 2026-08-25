/**
 * حارة العفاريت — Harat El Afareet
 * Default Data & Permanent Progression Schema
 */

export const DEFAULT_PLAYER_STATS = {
    maxHp: 100,
    hp: 100,
    hpRegen: 0.2,          // HP restored per second
    movementSpeed: 210,    // Pixels per second
    damageMultiplier: 1.0,
    attackSpeedMultiplier: 1.0,
    criticalChance: 0.05,  // 5% default
    criticalMultiplier: 1.8,
    pickupRadius: 90,      // Magnet radius in px
    armor: 0,              // Flat damage reduction
    xpMultiplier: 1.0,
    dashCooldown: 3.5,     // Seconds
    dashSpeed: 520,        // Speed during dash
    dashDuration: 0.22,    // Seconds
    areaMultiplier: 1.0,
    projectileSpeedMultiplier: 1.0
};

export const PERMANENT_UPGRADES = [
    {
        id: 'vitality',
        name: 'قوة العزيمة (Vitality)',
        description: 'زيادة الحد الأقصى للصحة بنسبة 10% لكل مستوى.',
        icon: '❤️',
        maxLevel: 5,
        baseCost: 50,
        costMultiplier: 1.6,
        statKey: 'maxHpBonus',
        valuePerLevel: 0.10
    },
    {
        id: 'vigor',
        name: 'الضرر الروحي (Spiritual Might)',
        description: 'زيادة قوة كل الهجمات والتعاويذ بنسبة 8% لكل مستوى.',
        icon: '⚔️',
        maxLevel: 5,
        baseCost: 75,
        costMultiplier: 1.7,
        statKey: 'damageBonus',
        valuePerLevel: 0.08
    },
    {
        id: 'swiftness',
        name: 'خفة الحارة (Alley Swiftness)',
        description: 'زيادة سرعة الحركة بنسبة 5% لكل مستوى.',
        icon: '👟',
        maxLevel: 5,
        baseCost: 40,
        costMultiplier: 1.5,
        statKey: 'speedBonus',
        valuePerLevel: 0.05
    },
    {
        id: 'talisman_magnet',
        name: 'جاذبية التميمة (Talisman Pull)',
        description: 'زيادة نطاق جذب الجواهر والعملات بنسبة 20% لكل مستوى.',
        icon: '🧲',
        maxLevel: 5,
        baseCost: 35,
        costMultiplier: 1.5,
        statKey: 'pickupRadiusBonus',
        valuePerLevel: 0.20
    },
    {
        id: 'ancient_wisdom',
        name: 'حكمة الأجداد (Ancient Wisdom)',
        description: 'زيادة نقاط الخبرة المكتسبة بنسبة 10% لكل مستوى.',
        icon: '📜',
        maxLevel: 5,
        baseCost: 60,
        costMultiplier: 1.8,
        statKey: 'xpBonus',
        valuePerLevel: 0.10
    },
    {
        id: 'iron_will',
        name: 'درع الفولاذ (Iron Resolve)',
        description: 'تقليل الضرر المتلقى بمقدار 1 نقطة لكل مستوى.',
        icon: '🛡️',
        maxLevel: 5,
        baseCost: 80,
        costMultiplier: 1.7,
        statKey: 'armorBonus',
        valuePerLevel: 1.0
    },
    {
        id: 'critical_eye',
        name: 'عين الصقر (Eagle Eye)',
        description: 'زيادة فرصة الضربة الحرجة بنسبة 3% لكل مستوى.',
        icon: '👁️',
        maxLevel: 5,
        baseCost: 90,
        costMultiplier: 1.8,
        statKey: 'critBonus',
        valuePerLevel: 0.03
    }
];

export const INITIAL_SAVE_DATA = {
    coins: 0,
    totalCoinsEarned: 0,
    highScoreTime: 0,
    totalEnemiesDefeated: 0,
    selectedCharacterId: 'apprentice',
    unlockedCharacterIds: ['apprentice', 'fireMage', 'amuletKeeper'],
    unlockedWeaponIds: ['magicStaff', 'fireWand', 'lightningRod', 'magicalTalisman'],
    permanentUpgrades: {
        vitality: 0,
        vigor: 0,
        swiftness: 0,
        talisman_magnet: 0,
        ancient_wisdom: 0,
        iron_will: 0,
        critical_eye: 0
    },
    audio: {
        soundEnabled: true,
        musicEnabled: true,
        masterVolume: 0.8,
        sfxVolume: 0.9
    },
    settings: {
        screenShake: true,
        damageNumbers: true,
        joystickDynamic: true
    }
};
