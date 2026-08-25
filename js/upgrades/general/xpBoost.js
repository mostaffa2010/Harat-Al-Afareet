export const xpBoostUpgrade = {
    id: 'general_xp_boost',
    category: 'general',
    name: 'نور المعرفة (Sage Enlightenment)',
    description: 'زيادة نقاط الخبرة المكتسبة من جميع العفاريت بنسبة +20%.',
    icon: '📜',
    themeColor: '#06b6d4',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.xpMultiplier += 0.20;
    }
};
