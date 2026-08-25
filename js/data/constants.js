/**
 * حارة العفاريت — Harat El Afareet
 * Global Constants & Configurations
 */

export const GAME_STATES = {
    MAIN_MENU: 'MAIN_MENU',
    CHARACTER_SELECT: 'CHARACTER_SELECT',
    PLAYING: 'PLAYING',
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
    SAFE_ZONE_RADIUS: 120,
    TOTAL_RUN_DURATION: 600, // 10 minutes in seconds (600s)
};

export const UPGRADE_RARITIES = {
    COMMON: {
        id: 'COMMON',
        name: 'شائع (Common)',
        color: '#a0aec0',
        glow: 'rgba(160, 174, 192, 0.4)',
        multiplier: 1.0,
        weight: 60
    },
    RARE: {
        id: 'RARE',
        name: 'نادر (Rare)',
        color: '#4299e1',
        glow: 'rgba(66, 153, 225, 0.5)',
        multiplier: 1.5,
        weight: 25
    },
    EPIC: {
        id: 'EPIC',
        name: 'ملحمي (Epic)',
        color: '#9f7aea',
        glow: 'rgba(159, 122, 234, 0.6)',
        multiplier: 2.2,
        weight: 12
    },
    LEGENDARY: {
        id: 'LEGENDARY',
        name: 'أسطوري (Legendary)',
        color: '#ecc94b',
        glow: 'rgba(236, 201, 75, 0.8)',
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
