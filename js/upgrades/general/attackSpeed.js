export const attackSpeedUpgrade = {
    id: 'general_attack_speed',
    category: 'general',
    name: 'تعويذة السرعة (Haste Incantation)',
    description: 'تسريع وتيرة هجوم وإطلاق جميع الأسلحة بنسبة +15%.',
    icon: '⏳',
    themeColor: '#38bdf8',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.attackSpeedMultiplier += 0.15;
    }
};
