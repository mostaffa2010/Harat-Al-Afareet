export const projectileCountUpgrade = {
    id: 'weapon_multishot',
    category: 'weapon',
    name: 'المقذوف المزدوج (Multi-Cast)',
    description: 'إضافة مقذوف إضافي (+1) لكل الأسلحة ذات المقذوفات.',
    icon: '✨',
    themeColor: '#06b6d4',
    maxLevel: 3,
    canApply: (player) => player.weapons.some(w => w.projectileCount !== undefined),
    apply: (player) => {
        player.weapons.forEach(w => {
            if (w.projectileCount !== undefined) w.projectileCount += 1;
        });
    }
};
