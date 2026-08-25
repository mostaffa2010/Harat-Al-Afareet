export const maxHealthUpgrade = {
    id: 'player_max_health',
    category: 'player',
    name: 'بركة العافية (Heart of Fortitude)',
    description: 'زيادة الحد الأقصى للصحة بمقدار +25 واستعادة 25 نقطة صحة.',
    icon: '❤️',
    themeColor: '#ef4444',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.maxHp += 25;
        player.heal(25);
    }
};
