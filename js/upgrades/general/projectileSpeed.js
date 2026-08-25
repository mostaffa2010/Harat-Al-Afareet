export const projectileSpeedUpgrade = {
    id: 'general_projectile_speed',
    category: 'general',
    name: 'رياح الشرق (East Wind)',
    description: 'زيادة سرعة حركة كل المقذوفات السحرية بنسبة +25%.',
    icon: '💨',
    themeColor: '#a855f7',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.projectileSpeedMultiplier += 0.25;
    }
};
