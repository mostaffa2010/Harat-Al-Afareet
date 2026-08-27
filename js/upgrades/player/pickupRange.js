export const pickupRangeUpgrade = {
    id: 'player_pickup_range',
    category: 'player',
    name: 'شفاط الجعران',
    description: 'توسيع نطاق شفط الجواهر والفلوس بمقدار +40% تلم كل اللي في الأرض.',
    icon: '🧲',
    themeColor: '#f59e0b',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.pickupRadius = Math.round(player.pickupRadius * 1.4);
    }
};
