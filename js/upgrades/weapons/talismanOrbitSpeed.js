export const talismanOrbitSpeedUpgrade = {
    id: 'weapon_talisman_orbit',
    category: 'weapon',
    name: 'دوران التمائم السريع (Swift Orbit)',
    description: 'زيادة سرعة ونطاق دوران التمائم بنسبة +30%.',
    icon: '🧿',
    themeColor: '#2563eb',
    maxLevel: 4,
    canApply: (player) => player.weapons.some(w => w.id === 'magicalTalisman'),
    apply: (player) => {
        const tal = player.weapons.find(w => w.id === 'magicalTalisman');
        if (tal) {
            tal.orbitSpeed *= 1.3;
            tal.orbitRadius += 12;
        }
    }
};
