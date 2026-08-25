export const armorShieldUpgrade = {
    id: 'player_armor_shield',
    category: 'player',
    name: 'درع النحاس العتيق (Bronze Armor)',
    description: 'تقليل جميع الأضرار المتلقاة بمقدار +1 نقطة إضافية.',
    icon: '🛡️',
    themeColor: '#d97706',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.armor += 1;
    }
};
