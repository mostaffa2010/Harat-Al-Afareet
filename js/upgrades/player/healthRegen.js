export const healthRegenUpgrade = {
    id: 'player_health_regen',
    category: 'player',
    name: 'إكسير المعلم',
    description: 'تجديد +0.5 نقطة صحة كل ثانية تلقائياً طول المعركة.',
    icon: '🧪',
    themeColor: '#22c55e',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.hpRegen += 0.5;
    }
};
