/**
 * حارة العفاريت — Harat El Afareet
 * Playable Character: The Apprentice (المبتدئ)
 */

export const apprentice = {
    id: 'apprentice',
    name: 'المبتدئ (Zaki)',
    title: 'تلميذ السحر الأزهري القديم',
    description: 'ساحر شاب يدرس أسرار العفاريت في دروب الحارة العتيقة. متوازن وسريع التعلم.',
    themePrimary: '#06b6d4',
    themeSecondary: '#f59e0b',
    startingWeaponId: 'magicStaff',
    passive: {
        id: 'quick_study',
        name: 'سرعة التعلم (Quick Study)',
        description: 'يكتسب بطاقة ترقية إضافية (4 خيارات) في قائمة الترقية وزيادة 15% في نقاط الخبرة.'
    },
    baseStats: {
        maxHp: 100,
        hpRegen: 0.2,
        movementSpeed: 215,
        damageMultiplier: 1.0,
        attackSpeedMultiplier: 1.0,
        criticalChance: 0.05,
        criticalMultiplier: 1.8,
        pickupRadius: 95,
        armor: 0,
        xpMultiplier: 1.15,
        dashCooldown: 3.2,
        extraChoiceChance: true
    }
};
