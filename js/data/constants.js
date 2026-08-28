/**
 * حارة العفاريت — Harat El Afareet
 * Global Constants (Version 5 — Pure Egyptian Arabic & Authentic Slang)
 */

export const GAME_VERSION = 'Version 5';

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
        name: 'حارة حس حس',
        badge: '🟢 حارة حس حس',
        description: 'العفاريت ضعيفة وصحتك أعلى ومناسب للتسلية وتجربة الأبطال براحتك.',
        enemyHpMult: 0.75,
        enemyDmgMult: 0.70,
        spawnIntervalMult: 1.25,
        coinRewardMult: 1.0,
        playerSpeedBonus: 1.10
    },
    NORMAL: {
        id: 'NORMAL',
        name: 'حارة هادية',
        badge: '🟡 حارة هادية',
        description: 'التجربة القياسية الأصلية.. حماس وتحدي وسرعة لعب متوازنة وممتعة.',
        enemyHpMult: 1.0,
        enemyDmgMult: 1.0,
        spawnIntervalMult: 1.0,
        coinRewardMult: 1.2,
        playerSpeedBonus: 1.0
    },
    HARD: {
        id: 'HARD',
        name: 'حارة مزعجة جدًا',
        badge: '🔴 حارة مزعجة جدًا',
        description: 'للمحترفين فقط! أمواج هائلة، عفاريت سريعة، وجوائز عملات مضاعفة +80%.',
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
    TOTAL_RUN_DURATION: 600 // 10 Minutes Total Run
};

export const UPGRADE_TIERS = {
    1: {
        level: 1,
        name: 'على قد الإيد',
        color: '#94a3b8',
        glow: 'rgba(148, 163, 184, 0.45)',
        badge: 'المستوى ١: على قد الإيد',
        textColor: '#0f172a'
    },
    2: {
        level: 2,
        name: 'شغل معلمين',
        color: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.55)',
        badge: 'المستوى ٢: شغل معلمين',
        textColor: '#0f172a'
    },
    3: {
        level: 3,
        name: 'سحر الفراعنة',
        color: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.65)',
        badge: 'المستوى ٣: سحر الفراعنة',
        textColor: '#ffffff'
    },
    4: {
        level: 4,
        name: 'بركة الأوليا',
        color: '#eab308',
        glow: 'rgba(234, 179, 8, 0.75)',
        badge: 'المستوى ٤: بركة الأوليا',
        textColor: '#0f172a'
    },
    5: {
        level: 5,
        name: 'أسطورة الحارة',
        color: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.90)',
        badge: 'المستوى ٥: أسطورة الحارة (أقصى قوة)',
        textColor: '#ffffff'
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
