/**
 * حارة العفاريت — Harat El Afareet
 * Playable Character: The Fire Mage (ساحر النار)
 */

export const fireMage = {
    id: 'fireMage',
    name: 'ساحر النار (Rayan)',
    title: 'سيد ألسنة اللهب والجان',
    description: 'يتحكم بنيران الجان المحرقة، يمتلك هجوماً مدمراً وحرائق متسلسلة ضد الحشود.',
    themePrimary: '#ef4444',
    themeSecondary: '#f59e0b',
    startingWeaponId: 'fireWand',
    passive: {
        id: 'embers',
        name: 'الجمر المتطاير (Embers)',
        description: 'الأعداء المحترقون يطلقون شظايا نارية تشعل الأعداء القريبين، وزيادة 25% في الضرر.'
    },
    baseStats: {
        maxHp: 85,
        hpRegen: 0.1,
        movementSpeed: 205,
        damageMultiplier: 1.25,
        attackSpeedMultiplier: 1.05,
        criticalChance: 0.10,
        criticalMultiplier: 2.0,
        pickupRadius: 85,
        armor: 0,
        xpMultiplier: 1.0,
        dashCooldown: 3.5
    }
};
