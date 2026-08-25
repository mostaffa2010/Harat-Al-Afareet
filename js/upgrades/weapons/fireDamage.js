export const fireDamageUpgrade = {
    id: 'weapon_fire_damage',
    category: 'weapon',
    name: 'حرايق متأججة (نار يا حبيبي نار)',
    description: 'زيادة ضرر وانفجارات النيران بنسبة +30% تشوي العفاريت شواء.',
    icon: '🔥',
    themeColor: '#ef4444',
    maxLevel: 5,
    canApply: (player) => player.weapons.some(w => w.id === 'fireWand'),
    apply: (player) => {
        const wand = player.weapons.find(w => w.id === 'fireWand');
        if (wand) wand.damage = Math.round(wand.damage * 1.30);
    }
};
