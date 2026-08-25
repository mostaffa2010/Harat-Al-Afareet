/**
 * حارة العفاريت — Harat El Afareet
 * Playable Character: The Amulet Keeper (حارسة التميمة)
 */

export const amuletKeeper = {
    id: 'amuletKeeper',
    name: 'حارسة التميمة (Layla)',
    title: 'حامية أسرار عين حورس',
    description: 'تحمل تمائم الأجداد وتتصدى لأعتى ضربات المردة بدرع سحري متجدد وصحة فولاذية.',
    themePrimary: '#2563eb',
    themeSecondary: '#f59e0b',
    startingWeaponId: 'magicalTalisman',
    passive: {
        id: 'protective_talisman',
        name: 'التميمة الحامية (Protective Barrier)',
        description: 'تولد درعاً سحرياً يمتص 35 نقطة ضرر ويتجدد تلقائياً كل 6 ثوانٍ، مع درع حديدي +2.'
    },
    baseStats: {
        maxHp: 130,
        hpRegen: 0.4,
        movementSpeed: 195,
        damageMultiplier: 0.95,
        attackSpeedMultiplier: 1.0,
        criticalChance: 0.05,
        criticalMultiplier: 1.8,
        pickupRadius: 100,
        armor: 2,
        xpMultiplier: 1.0,
        dashCooldown: 3.8
    }
};
