export const goldDiggerUpgrade = {
    id: 'general_gold_digger',
    category: 'general',
    name: 'كنز الفتوات (شخللة فلوس)',
    description: 'زيادة إسقاط العملات الأثرية وقيمتها بمقدار +60%.',
    icon: '🪙',
    themeColor: '#f59e0b',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.damageMultiplier += 0.08;
    }
};
