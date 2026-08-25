export const healthRegenUpgrade = {
    id: 'player_health_regen',
    category: 'player',
    name: 'إكسير الحياة (Life Elixir)',
    description: 'تجديد +0.4 نقطة صحة في الثانية باستمرار.',
    icon: '🧪',
    themeColor: '#22c55e',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.hpRegen += 0.4;
    }
};
