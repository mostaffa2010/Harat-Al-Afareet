export const projectileSpeedUpgrade = {
    id: 'general_projectile_speed',
    category: 'general',
    name: 'رياح الخماسين',
    description: 'زيادة سرعة طيران المقذوفات السحرية بنسبة +30%.',
    icon: '💨',
    themeColor: '#a855f7',
    maxLevel: 4,
    canApply: () => true,
    apply: (player) => {
        player.projectileSpeedMultiplier += 0.30;
    }
};
