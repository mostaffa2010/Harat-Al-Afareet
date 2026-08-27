export const movementSpeedUpgrade = {
    id: 'player_movement_speed',
    category: 'player',
    name: 'خفة ورشاقة',
    description: 'زيادة سرعة حركة بطل الحارة بنسبة +15% لتفادي الحشود بسهولة.',
    icon: '👟',
    themeColor: '#10b981',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.movementSpeed *= 1.15;
    }
};
