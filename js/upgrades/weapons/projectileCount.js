export const projectileCountUpgrade = {
    id: 'weapon_multishot',
    category: 'weapon',
    name: 'رشقة مضاعفة (طلقة زيادة)',
    description: 'إضافة مقذوف زيادة (+1) لكل الأسلحة اللي بتحدف قذائف.',
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
