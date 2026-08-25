export const movementSpeedUpgrade = {
    id: 'player_movement_speed',
    category: 'player',
    name: 'خفة الخطى (Alley Agility)',
    description: 'زيادة سرعة حركة اللاعب بنسبة +12%.',
    icon: '👟',
    themeColor: '#10b981',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.movementSpeed *= 1.12;
    }
};
