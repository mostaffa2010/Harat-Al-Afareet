export const staffHomingUpgrade = {
    id: 'weapon_staff_homing',
    category: 'weapon',
    name: 'بصيرة الخرزانة (صياد العفاريت)',
    description: 'طلقات العصا السحرية تجري أسرع وتضرب أقوى بنسبة +25%.',
    icon: '🪄',
    themeColor: '#06b6d4',
    maxLevel: 4,
    canApply: (player) => player.weapons.some(w => w.id === 'magicStaff'),
    apply: (player) => {
        const staff = player.weapons.find(w => w.id === 'magicStaff');
        if (staff) {
            staff.damage = Math.round(staff.damage * 1.25);
            staff.projectileSpeed += 60;
        }
    }
};
