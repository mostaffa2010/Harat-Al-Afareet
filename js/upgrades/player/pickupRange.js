export const pickupRangeUpgrade = {
    id: 'player_pickup_range',
    category: 'player',
    name: 'عين الحورس الجاذبة (Scarab Magnet)',
    description: 'مضاعفة نطاق جذب الجواهر والعملات بنسبة +35%.',
    icon: '🧲',
    themeColor: '#f59e0b',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.pickupRadius = Math.round(player.pickupRadius * 1.35);
    }
};
