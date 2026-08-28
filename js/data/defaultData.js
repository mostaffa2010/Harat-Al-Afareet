/**
 * حارة العفاريت — Harat El Afareet
 * Default Data & Pure Egyptian Progression
 */

export const DEFAULT_PLAYER_STATS = {
    maxHp: 190,
    hp: 190,
    hpRegen: 0.5,
    movementSpeed: 220,
    damageMultiplier: 1.15,
    attackSpeedMultiplier: 1.0,
    criticalChance: 0.08,
    criticalMultiplier: 1.85,
    pickupRadius: 110,
    armor: 1,
    xpMultiplier: 1.0,
    dashCooldown: 2.8,
    dashSpeed: 560,
    dashDuration: 0.25,
    areaMultiplier: 1.0,
    projectileSpeedMultiplier: 1.0
};

export const PERMANENT_UPGRADES = [
    {
        id: 'vitality',
        name: 'صحة حديد',
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
        name: 'عزم وشقاوة',
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
        name: 'جري الوحوش',
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
        name: 'شفاط الجواهر',
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
        name: 'دماغ أستاذ',
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
        name: 'قلب ميت',
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
        name: 'ضربة في مقتل',
        description: 'فرصة تفرتك العفريت بضربة حظ مضاعفة بنسبة +4%.',
        icon: '👁️',
        maxLevel: 5,
        baseCost: 70,
        costMultiplier: 1.7,
        statKey: 'critBonus',
        valuePerLevel: 0.04
    }
];

export const ACHIEVEMENTS = [
    {
        id: 'first_blood',
        name: 'أول قطرة دم',
        description: 'فرتك أول 50 عفريت في الحارة.',
        icon: '🩸',
        rewardCoins: 50,
        target: 50,
        statKey: 'totalEnemiesDefeated'
    },
    {
        id: 'monster_slayer',
        name: 'سفاح العفاريت',
        description: 'اهزم 500 عفريت في المعارك.',
        icon: '⚔️',
        rewardCoins: 150,
        target: 500,
        statKey: 'totalEnemiesDefeated'
    },
    {
        id: 'legendary_slayer',
        name: 'رعب الجان الأعظم',
        description: 'اهزم 2000 عفريت.',
        icon: '👑',
        rewardCoins: 400,
        target: 2000,
        statKey: 'totalEnemiesDefeated'
    },
    {
        id: 'survivor_5min',
        name: 'صمود الفتوات',
        description: 'اصمد لمدة 5 دقائق كاملة في جولة واحدة.',
        icon: '⏳',
        rewardCoins: 100,
        target: 300,
        statKey: 'highScoreTime'
    },
    {
        id: 'survivor_10min',
        name: 'سيد الحارة الخالد',
        description: 'اهزم سلطان الجان واصمد لـ 10 دقائق كاملة!',
        icon: '🏆',
        rewardCoins: 350,
        target: 600,
        statKey: 'highScoreTime'
    },
    {
        id: 'rich_magician',
        name: 'قارون الحارة',
        description: 'اجمع أكثر من 500 عملة أثرية.',
        icon: '🪙',
        rewardCoins: 150,
        target: 500,
        statKey: 'totalCoinsEarned'
    }
];

export const INITIAL_SAVE_DATA = {
    coins: 0,
    totalCoinsEarned: 0,
    highScoreTime: 0,
    totalEnemiesDefeated: 0,
    selectedCharacterId: 'apprentice',
    selectedDifficulty: 'NORMAL',
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
    claimedAchievements: {},
    audio: {
        soundEnabled: true,
        musicEnabled: true,
        masterVolume: 0.8,
        sfxVolume: 0.9
    },
    settings: {
        screenShake: false,
        damageNumbers: true,
        joystickDynamic: true
    }
};
