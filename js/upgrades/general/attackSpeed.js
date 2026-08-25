export const attackSpeedUpgrade = {
    id: 'general_attack_speed',
    category: 'general',
    name: 'تعويذة السرعة (رش ورا بعضه)',
    description: 'تسريع وتيرة هجوم وضرب كل أسلحتك بنسبة +18%.',
    icon: '⏳',
    themeColor: '#38bdf8',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.attackSpeedMultiplier += 0.18;
    }
};
