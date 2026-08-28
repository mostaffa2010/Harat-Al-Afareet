/**
 * حارة العفاريت — Harat El Afareet
 * Global Constants (Pure Egyptian Arabic & Authentic Slang)
 */

export const GAME_VERSION = 'v5.0';

export const GAME_STATES = {
    MAIN_MENU: 'MAIN_MENU',
    DIFFICULTY_SELECT: 'DIFFICULTY_SELECT',
    CHARACTER_SELECT: 'CHARACTER_SELECT',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    LEVEL_UP: 'LEVEL_UP',
    BAZAAR: 'BAZAAR',
    COLLECTION: 'COLLECTION',
    ACHIEVEMENTS: 'ACHIEVEMENTS',
    GAME_OVER: 'GAME_OVER',
    VICTORY: 'VICTORY'
};

export const DIFFICULTY_MODES = {
    EASY: {
        id: 'EASY',
        name: 'مستوى عبيط',
        badge: '🟢 عبيط',
        description: 'العفاريت ضعيفة وصحتك أعلى ومناسب للتسلية وتجربة الأبطال براحتك.',
        enemyHpMult: 0.75,
        enemyDmgMult: 0.70,
        spawnIntervalMult: 1.25,
        coinRewardMult: 1.0,
        playerSpeedBonus: 1.10
    },
    NORMAL: {
        id: 'NORMAL',
        name: 'عادي',
        badge: '🟡 عادي',
        description: 'التجربة القياسية الأصلية.. حماس وتحدي وسرعة لعب متوازنة وممتعة.',
        enemyHpMult: 1.0,
        enemyDmgMult: 1.0,
        spawnIntervalMult: 1.0,
        coinRewardMult: 1.2,
        playerSpeedBonus: 1.0
    },
    HARD: {
        id: 'HARD',
        name: 'كابوس',
        badge: '🔴 كابوس',
        description: 'للمحترفين فقط! أمواج هائلة، عفاريت سريعة، وجوائز عملات مضاعفة.',
        enemyHpMult: 1.45,
        enemyDmgMult: 1.35,
        spawnIntervalMult: 0.75,
        coinRewardMult: 1.8,
        playerSpeedBonus: 0.95
    }
};

export const WORLD_CONFIG = {
    MAP_WIDTH: 2600,
    MAP_HEIGHT: 2600,
    TILE_SIZE: 64,
    SAFE_ZONE_RADIUS: 140,
    TOTAL_RUN_DURATION: 600
};

export const UPGRADE_RARITIES = {
    COMMON: {
        id: 'COMMON',
        name: 'على قد الإيد',
        color: '#94a3b8',
        glow: 'rgba(148, 163, 184, 0.45)',
        multiplier: 1.0,
        weight: 42
    },
    UNCOMMON: {
        id: 'UNCOMMON',
        name: 'يا بختك',
        color: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.55)',
        multiplier: 1.3,
        weight: 28
    },
    RARE: {
        id: 'RARE',
        name: 'لقطة ده نادر',
        color: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.65)',
        multiplier: 1.7,
        weight: 16
    },
    EPIC: {
        id: 'EPIC',
        name: 'شغل معلمين',
        color: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.75)',
        multiplier: 2.3,
        weight: 9
    },
    LEGENDARY: {
        id: 'LEGENDARY',
        name: 'سر الفراعنة',
        color: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.85)',
        multiplier: 3.2,
        weight: 5
    },
    EVOLVED: {
        id: 'EVOLVED',
        name: 'عظمة على عظمة (المستوى الأقصى)',
        color: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.95)',
        multiplier: 4.5,
        weight: 0
    }
};

export const DAMAGE_TYPES = {
    PHYSICAL: 'PHYSICAL',
    FIRE: 'FIRE',
    LIGHTNING: 'LIGHTNING',
    ARCANE: 'ARCANE',
    POISON: 'POISON'
};

export const PICKUP_TYPES = {
    XP_SMALL: 'XP_SMALL',
    XP_MEDIUM: 'XP_MEDIUM',
    XP_LARGE: 'XP_LARGE',
    COIN: 'COIN',
    CHEST: 'CHEST',
    HEALTH: 'HEALTH',
    MAGNET: 'MAGNET'
};

export const THEME = {
    BACKGROUND_DARK: '#07090e',
    SURFACE_DARK: '#0f1422',
    EGYPT_GOLD: '#f59e0b',
    EGYPT_GOLD_LIGHT: '#fbbf24',
    EGYPT_CYAN: '#06b6d4',
    EGYPT_RED: '#ef4444',
    EGYPT_BLUE: '#2563eb',
    EGYPT_PURPLE: '#8b5cf6',
    NOIR_DARK: '#05070a',
    TEXT_MAIN: '#f8fafc',
    TEXT_MUTED: '#94a3b8',
    BORDER_GOLD: '#d97706'
};
