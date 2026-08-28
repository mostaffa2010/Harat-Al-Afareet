/**
 * حارة العفاريت — Harat El Afareet
 * PWA Service Worker (v5.0 Offline Cache)
 */

const CACHE_NAME = 'harat-el-afareet-v5.1';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './assets/icon-192.png',
    './assets/icon-512.png',
    
    // Core
    './js/core/game.js',
    './js/core/gameLoop.js',
    './js/core/renderer.js',
    './js/core/assetManager.js',
    
    // Data
    './js/data/constants.js',
    './js/data/defaultData.js',
    
    // Systems
    './js/systems/inputSystem.js',
    './js/systems/cameraSystem.js',
    './js/systems/collisionSystem.js',
    './js/systems/particleSystem.js',
    './js/systems/damageSystem.js',
    './js/systems/audioSystem.js',
    './js/systems/saveSystem.js',
    './js/systems/xpSystem.js',
    './js/systems/upgradeSystem.js',
    './js/systems/waveSystem.js',
    './js/systems/spawnSystem.js',
    './js/systems/difficultySystem.js',
    './js/systems/achievementSystem.js',
    
    // Entities
    './js/entities/player.js',
    './js/entities/projectile.js',
    './js/entities/pickup.js',
    './js/entities/baseEnemy.js',
    
    // Characters
    './js/characters/characterRegistry.js',
    './js/characters/apprentice.js',
    './js/characters/fireMage.js',
    './js/characters/amuletKeeper.js',
    
    // Weapons
    './js/weapons/weaponRegistry.js',
    './js/weapons/baseWeapon.js',
    './js/weapons/magicStaff.js',
    './js/weapons/fireWand.js',
    './js/weapons/magicalTalisman.js',
    './js/weapons/lightningRod.js',
    './js/weapons/flyingClog.js',
    './js/weapons/acidFlask.js',
    './js/weapons/hunterShotgun.js',
    './js/weapons/spiritSmoke.js',
    
    // Bosses
    './js/bosses/bossRegistry.js',
    './js/bosses/afreetKing.js',
    './js/bosses/rockBruteBoss.js',
    './js/bosses/necroShamanBoss.js',
    './js/bosses/infernalBruteBoss.js',
    
    // Enemies
    './js/enemies/enemyRegistry.js',
    './js/enemies/smallAfreet.js',
    './js/enemies/fastAfreet.js',
    './js/enemies/rangedAfreet.js',
    './js/enemies/giantAfreet.js',
    './js/enemies/explodingGhoul.js',
    './js/enemies/djinnShaman.js',
    './js/enemies/cryptBat.js',
    
    // Upgrades
    './js/upgrades/upgradeRegistry.js',
    './js/upgrades/player/movementSpeed.js',
    './js/upgrades/player/maxHealth.js',
    './js/upgrades/player/pickupRange.js',
    './js/upgrades/player/armorShield.js',
    './js/upgrades/player/healthRegen.js',
    './js/upgrades/general/criticalChance.js',
    './js/upgrades/general/attackSpeed.js',
    './js/upgrades/general/areaOfEffect.js',
    './js/upgrades/general/xpBoost.js',
    './js/upgrades/general/rawDamage.js',
    
    // UI
    './js/ui/uiManager.js',
    './js/ui/mainMenu.js',
    './js/ui/difficultySelect.js',
    './js/ui/characterSelect.js',
    './js/ui/hud.js',
    './js/ui/levelUpModal.js',
    './js/ui/pauseMenu.js',
    './js/ui/gameOverModal.js',
    './js/ui/victoryModal.js',
    './js/ui/bazaarModal.js',
    './js/ui/achievementsModal.js',
    './js/ui/collectionModal.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // Offline fallback
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
