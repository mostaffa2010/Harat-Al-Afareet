export const criticalChanceUpgrade = {
    id: 'general_critical_chance',
    category: 'general',
    name: 'ضربة معلم',
    description: 'زيادة فرصة الضربة الحرجة بنسبة +10% ومضاعف الضرر بنسبة +25%.',
    icon: '👁️',
    themeColor: '#fbbf24',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.criticalChance += 0.10;
        player.criticalMultiplier += 0.25;
    }
};
