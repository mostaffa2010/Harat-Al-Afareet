/**
 * حارة العفاريت — Harat El Afareet
 * Global Constants & Configurations (Egyptian Colloquial Theme)
 */

export const GAME_STATES = {
    MAIN_MENU: 'MAIN_MENU',
    CHARACTER_SELECT: 'CHARACTER_SELECT',
    PLAYING: 'PLAYING',
    COUNTDOWN: 'COUNTDOWN',
    PAUSED: 'PAUSED',
    LEVEL_UP: 'LEVEL_UP',
    BAZAAR: 'BAZAAR',
    COLLECTION: 'COLLECTION',
    GAME_OVER: 'GAME_OVER',
    VICTORY: 'VICTORY'
};

export const WORLD_CONFIG = {
    MAP_WIDTH: 2600,
    MAP_HEIGHT: 2600,
    TILE_SIZE: 64,
    SAFE_ZONE_RADIUS: 140,
    TOTAL_RUN_DURATION: 600, // 10 minutes in seconds (600s)
};

export const UPGRADE_RARITIES = {
    COMMON: {
        id: 'COMMON',
        name: 'شائع (على قد الإيد)',
        color: '#a0aec0',
        glow: 'rgba(160, 174, 192, 0.4)',
        multiplier: 1.0,
        weight: 58
    },
    RARE: {
        id: 'RARE',
        name: 'نادر (لقطة يا بختك)',
        color: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.55)',
        multiplier: 1.5,
        weight: 26
    },
    EPIC: {
        id: 'EPIC',
        name: 'ملحمي (حاجة فاخرة)',
        color: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.65)',
        multiplier: 2.2,
        weight: 13
    },
    LEGENDARY: {
        id: 'LEGENDARY',
        name: 'أسطوري (شغل معلمين)',
        color: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.85)',
        multiplier: 3.2,
        weight: 3
    }
};

export const DAMAGE_TYPES = {
    PHYSICAL: 'PHYSICAL',
    FIRE: 'FIRE',
    LIGHTNING: 'LIGHTNING',
    ARCANE: 'ARCANE'
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
    BACKGROUND_DARK: '#0b0f19',
    SURFACE_DARK: '#121826',
    EGYPT_GOLD: '#f59e0b',
    EGYPT_GOLD_LIGHT: '#fbbf24',
    EGYPT_CYAN: '#06b6d4',
    EGYPT_RED: '#ef4444',
    EGYPT_BLUE: '#2563eb',
    EGYPT_PURPLE: '#8b5cf6',
    SAND_BG: '#1a1815',
    TEXT_MAIN: '#f8fafc',
    TEXT_MUTED: '#94a3b8',
    BORDER_GOLD: '#d97706'
};
