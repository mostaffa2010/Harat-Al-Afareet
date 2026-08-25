export const lightningForkUpgrade = {
    id: 'weapon_lightning_fork',
    category: 'weapon',
    name: 'صاعقة متشعبة (Forked Lightning)',
    description: 'تضرب صاعقة السماء هدفاً إضافياً (+1) وتزيد نطاق الانفجار بنسبة +20%.',
    icon: '⚡',
    themeColor: '#67e8f9',
    maxLevel: 4,
    canApply: (player) => player.weapons.some(w => w.id === 'lightningRod'),
    apply: (player) => {
        const rod = player.weapons.find(w => w.id === 'lightningRod');
        if (rod) {
            rod.projectileCount += 1;
            rod.strikeRadius = Math.round(rod.strikeRadius * 1.2);
        }
    }
};
