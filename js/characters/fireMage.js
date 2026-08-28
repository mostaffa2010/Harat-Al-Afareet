/**
 * حارة العفاريت — Harat El Afareet
 * Character: الأسطى ريان
 */

export const fireMage = {
    id: 'fireMage',
    name: 'الأسطى ريان',
    title: 'معلم ألسنة اللهب وحرايق الجان',
    description: 'مابيتفاهمش، بيولع في الحارة كلها والعفاريت بتشوي وتسوي بعضها.',
    themePrimary: '#ef4444',
    themeSecondary: '#f59e0b',
    startingWeaponId: 'fireWand',
    passive: {
        id: 'embers',
        name: 'جمر وشظايا',
        description: 'أي عفريت يولع بيولع في اللي جنبه، مع ضربات نارية أقوى بنسبة 30%.'
    },
    baseStats: {
        maxHp: 155,
        hpRegen: 0.3,
        movementSpeed: 215,
        damageMultiplier: 1.35,
        attackSpeedMultiplier: 1.10,
        criticalChance: 0.12,
        criticalMultiplier: 2.1,
        pickupRadius: 95,
        armor: 1,
        xpMultiplier: 1.0,
        dashCooldown: 3.0
    }
};
