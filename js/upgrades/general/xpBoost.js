export const xpBoostUpgrade = {
    id: 'general_xp_boost',
    category: 'general',
    name: 'بركة الأجداد (تلفيل في السحاب)',
    description: 'زيادة نقاط الخبرة المكتسبة من العفاريت بنسبة +25%.',
    icon: '📜',
    themeColor: '#06b6d4',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.xpMultiplier += 0.25;
    }
};
