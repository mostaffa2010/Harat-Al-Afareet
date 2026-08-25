export const goldDiggerUpgrade = {
    id: 'general_gold_digger',
    category: 'general',
    name: 'كنز القلعة (Fortress Treasure)',
    description: 'زيادة فرصة إسقاط العملات الأثرية وقيمتها بمقدار +50%.',
    icon: '🪙',
    themeColor: '#f59e0b',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.damageMultiplier += 0.05; // Small bonus
    }
};
