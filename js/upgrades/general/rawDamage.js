/**
 * حارة العفاريت — Harat El Afareet
 * Upgrade: حجر جير وقوة (Raw Damage Boost)
 */

export const rawDamageUpgrade = {
    id: 'rawDamage',
    name: 'حجر جير وقوة',
    description: 'زيادة قوة وتأثير ضرر كل أسلحتك بنسبة +15%.',
    icon: '💥',
    themeColor: '#ef4444',
    maxLevel: 5,
    canApply: (player) => true,
    apply: (player) => {
        player.damageMultiplier = (player.damageMultiplier || 1.0) + 0.15;
    }
};
