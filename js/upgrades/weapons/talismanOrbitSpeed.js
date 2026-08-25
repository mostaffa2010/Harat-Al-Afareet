export const talismanOrbitSpeedUpgrade = {
    id: 'weapon_talisman_orbit',
    category: 'weapon',
    name: 'خلاط التمائم (دوران سريع)',
    description: 'زيادة سرعة ونطاق دوران تمائم عين حورس بنسبة +35% لفرم أي عفريت.',
    icon: '🧿',
    themeColor: '#2563eb',
    maxLevel: 4,
    canApply: (player) => player.weapons.some(w => w.id === 'magicalTalisman'),
    apply: (player) => {
        const tal = player.weapons.find(w => w.id === 'magicalTalisman');
        if (tal) {
            tal.orbitSpeed *= 1.35;
            tal.orbitRadius += 15;
        }
    }
};
