export const armorShieldUpgrade = {
    id: 'player_armor_shield',
    category: 'player',
    name: 'جلابية مدرعة (درع بلدي)',
    description: 'تقليل جميع الأضرار المتلقاة من العفاريت بمقدار +1 نقطة إضافية.',
    icon: '🛡️',
    themeColor: '#d97706',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.armor += 1;
    }
};
