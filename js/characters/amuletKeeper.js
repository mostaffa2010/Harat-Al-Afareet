/**
 * حارة العفاريت — Harat El Afareet
 * Playable Character: The Amulet Keeper (الست ليلى)
 */

export const amuletKeeper = {
    id: 'amuletKeeper',
    name: 'الست ليلى (حارسة التميمة)',
    title: 'كبيرة حراس تمائم الفراعنة وعين حورس',
    description: 'واخدة بركة الأجداد، درعها ماينكسرش وصحتها زي البمب تفرتك أي مارد.',
    themePrimary: '#2563eb',
    themeSecondary: '#f59e0b',
    startingWeaponId: 'magicalTalisman',
    passive: {
        id: 'protective_talisman',
        name: 'حجاب حورس الحامي (Protective Shield)',
        description: 'درع سحري أزرق بيتجدد كل 5 ثواني يصد 45 نقطة ضرر مع صحة حديدية 220 HP.'
    },
    baseStats: {
        maxHp: 220,
        hpRegen: 0.8,
        movementSpeed: 205,
        damageMultiplier: 1.05,
        attackSpeedMultiplier: 1.0,
        criticalChance: 0.08,
        criticalMultiplier: 1.8,
        pickupRadius: 115,
        armor: 2,
        xpMultiplier: 1.0,
        dashCooldown: 3.2
    }
};
