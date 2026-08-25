export const criticalChanceUpgrade = {
    id: 'general_critical_chance',
    category: 'general',
    name: 'الضربة القاصمة (Death Strike)',
    description: 'زيادة فرصة الضربة الحرجة بنسبة +8% ومضاعف الضرر بنسبة +20%.',
    icon: '👁️',
    themeColor: '#fbbf24',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.criticalChance += 0.08;
        player.criticalMultiplier += 0.20;
    }
};
