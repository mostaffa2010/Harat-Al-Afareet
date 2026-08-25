export const lightningForkUpgrade = {
    id: 'weapon_lightning_fork',
    category: 'weapon',
    name: 'كهربا متشعبة (رعد يفرتك)',
    description: 'صاعقة السماء تضرب عفريت زيادة (+1) مع توسيع نطاق الصعق +25%.',
    icon: '⚡',
    themeColor: '#67e8f9',
    maxLevel: 4,
    canApply: (player) => player.weapons.some(w => w.id === 'lightningRod'),
    apply: (player) => {
        const rod = player.weapons.find(w => w.id === 'lightningRod');
        if (rod) {
            rod.projectileCount += 1;
            rod.strikeRadius = Math.round(rod.strikeRadius * 1.25);
        }
    }
};
