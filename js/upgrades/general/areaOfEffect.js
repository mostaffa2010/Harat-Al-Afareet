export const areaOfEffectUpgrade = {
    id: 'general_area_of_effect',
    category: 'general',
    name: 'اتساع الهالة (Grand Aura)',
    description: 'زيادة نطاق تأثير جميع الانفجارات والصواعق والتمائم بنسبة +20%.',
    icon: '💫',
    themeColor: '#ec4899',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.areaMultiplier += 0.20;
    }
};
