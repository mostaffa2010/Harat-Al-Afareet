export const areaOfEffectUpgrade = {
    id: 'general_area_of_effect',
    category: 'general',
    name: 'هالة وسيعة',
    description: 'زيادة حجم ونطاق تأثير الانفجارات والصواعق والتمائم بنسبة +25%.',
    icon: '💫',
    themeColor: '#ec4899',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.areaMultiplier += 0.25;
    }
};
