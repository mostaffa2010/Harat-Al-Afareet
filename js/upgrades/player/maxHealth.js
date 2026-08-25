export const maxHealthUpgrade = {
    id: 'player_max_health',
    category: 'player',
    name: 'شاي بحليب بلدي (صحة إضافية)',
    description: 'زيادة الحد الأقصى للصحة +35 واستعادة 35 نقطة صحة في الحال.',
    icon: '❤️',
    themeColor: '#ef4444',
    maxLevel: 5,
    canApply: () => true,
    apply: (player) => {
        player.maxHp += 35;
        player.heal(35);
    }
};
