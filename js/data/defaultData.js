/**
 * حارة العفاريت — Harat El Afareet
 * Default Data & Permanent Progression Schema (Egyptian Colloquial Theme)
 */

export const DEFAULT_PLAYER_STATS = {
    maxHp: 180,            // Boosted base health so players survive easily
    hp: 180,
    hpRegen: 0.5,          // Natural passive regeneration per sec
    movementSpeed: 220,    // Pixels per second
    damageMultiplier: 1.15,
    attackSpeedMultiplier: 1.0,
    criticalChance: 0.08,  // 8% default
    criticalMultiplier: 1.85,
    pickupRadius: 105,     // Generous magnet radius in px
    armor: 1,              // Base flat damage reduction
    xpMultiplier: 1.0,
    dashCooldown: 3.0,     // Snappier dash
    dashSpeed: 560,
    dashDuration: 0.25,
    areaMultiplier: 1.0,
    projectileSpeedMultiplier: 1.0
};

export const PERMANENT_UPGRADES = [
    {
        id: 'vitality',
        name: 'صحة حديد (عفية)',
        description: 'زيادة شريط الصحة 15% عشان تستحمل خبطات العفاريت.',
        icon: '❤️',
        maxLevel: 5,
        baseCost: 40,
        costMultiplier: 1.5,
        statKey: 'maxHpBonus',
        valuePerLevel: 0.15
    },
    {
        id: 'vigor',
        name: 'عزم وشقاوة (ضرر أعلى)',
        description: 'تقوية كل الضربات والتعاويذ بنسبة 10% لكل مستوى.',
        icon: '⚔️',
        maxLevel: 5,
        baseCost: 50,
        costMultiplier: 1.6,
        statKey: 'damageBonus',
        valuePerLevel: 0.10
    },
    {
        id: 'swiftness',
        name: 'جري الوحوش (سرعة رجل)',
        description: 'خفة وسرعة حركة في الحارة بنسبة 8% لكل مستوى.',
        icon: '👟',
        maxLevel: 5,
        baseCost: 30,
        costMultiplier: 1.4,
        statKey: 'speedBonus',
        valuePerLevel: 0.08
    },
    {
        id: 'talisman_magnet',
        name: 'شفاط الجواهر (مغناطيس)',
        description: 'توسيع نطاق شفط الجواهر والفلوس 25% لكل مستوى.',
        icon: '🧲',
        maxLevel: 5,
        baseCost: 30,
        costMultiplier: 1.4,
        statKey: 'pickupRadiusBonus',
        valuePerLevel: 0.25
    },
    {
        id: 'ancient_wisdom',
        name: 'دماغ أستاذ (خبرة سريعة)',
        description: 'تجميع إكس بي أسرع 15% وتلفيل طاير في المعركة.',
        icon: '📜',
        maxLevel: 5,
        baseCost: 45,
        costMultiplier: 1.6,
        statKey: 'xpBonus',
        valuePerLevel: 0.15
    },
    {
        id: 'iron_will',
        name: 'قلب ميت (درع بلدي)',
        description: 'تقليل أي ضربة تاخدها بمقدار 1 نقطة إضافية.',
        icon: '🛡️',
        maxLevel: 5,
        baseCost: 60,
        costMultiplier: 1.6,
        statKey: 'armorBonus',
        valuePerLevel: 1.0
    },
    {
        id: 'critical_eye',
        name: 'ضربة في مقتل (كريتيكال)',
        description: 'فرصة تفرتك العفريت بضربة حظ مضاعفة بنسبة +4%.',
        icon: '👁️',
        maxLevel: 5,
        baseCost: 70,
        costMultiplier: 1.7,
        statKey: 'critBonus',
        valuePerLevel: 0.04
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
