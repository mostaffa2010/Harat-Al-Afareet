/**
 * حارة العفاريت — Harat El Afareet
 * Character: الواد زكي
 * Passive: فالح وسريع الفهم (+25% XP bonus)
 */

export const apprentice = {
    id: 'apprentice',
    name: 'الواد زكي',
    title: 'طالب سحر أزهري مجتهد وسريع البديهة',
    description: 'شاب روش وذكي، بيفهم لغة العفاريت وبياخد خبرة زيادة بنسبة 25% من كل جوهرة يلمها.',
    themePrimary: '#06b6d4',
    themeSecondary: '#f59e0b',
    startingWeaponId: 'magicStaff',
    passive: {
        id: 'quick_study',
        name: 'فالح وسريع الفهم',
        description: 'بياخد خبرة زيادة بنسبة 25% مع كل جوهرة يلمها من العفاريت لسرعة التلفيل.'
    },
    baseStats: {
        maxHp: 180,
        hpRegen: 0.5,
        movementSpeed: 225,
        damageMultiplier: 1.1,
        attackSpeedMultiplier: 1.05,
        criticalChance: 0.08,
        criticalMultiplier: 1.85,
        pickupRadius: 110,
        armor: 1,
        xpMultiplier: 1.25
    }
};
