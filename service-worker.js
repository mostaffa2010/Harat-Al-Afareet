/**
 * حارة العفاريت — Harat El Afareet
 * PWA Service Worker (Cache v7.0 - Full Combat & Pause Fixes)
 */

const CACHE_NAME = 'harat-afareet-v7';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './js/core/game.js',
    './js/core/gameLoop.js',
    './js/core/renderer.js',
    './js/core/assetManager.js',
    './js/data/constants.js',
    './js/data/defaultData.js',
    './js/systems/inputSystem.js',
    './js/systems/cameraSystem.js',
    './js/systems/collisionSystem.js',
    './js/systems/spawnSystem.js',
    './js/systems/waveSystem.js',
    './js/systems/difficultySystem.js',
    './js/systems/xpSystem.js',
    './js/systems/upgradeSystem.js',
    './js/systems/damageSystem.js',
    './js/systems/particleSystem.js',
    './js/systems/audioSystem.js',
    './js/systems/saveSystem.js',
    './js/systems/achievementSystem.js',
    './js/entities/player.js',
    './js/entities/projectile.js',
    './js/entities/pickup.js',
    './js/entities/baseEnemy.js',
    './js/characters/characterRegistry.js',
    './js/characters/apprentice.js',
    './js/characters/fireMage.js',
    './js/characters/amuletKeeper.js',
    './js/weapons/weaponRegistry.js',
    './js/weapons/baseWeapon.js',
    './js/weapons/magicStaff.js',
    './js/weapons/fireWand.js',
    './js/weapons/lightningRod.js',
    './js/weapons/magicalTalisman.js',
    './js/weapons/flyingClog.js',
    './js/weapons/acidFlask.js',
    './js/weapons/hunterShotgun.js',
    './js/weapons/spiritSmoke.js',
    './js/enemies/enemyRegistry.js',
    './js/enemies/smallAfreet.js',
    './js/enemies/fastAfreet.js',
    './js/enemies/rangedAfreet.js',
    './js/enemies/giantAfreet.js',
    './js/enemies/explodingGhoul.js',
    './js/enemies/djinnShaman.js',
    './js/enemies/cryptBat.js',
    './js/bosses/bossRegistry.js',
    './js/bosses/afreetKing.js',
    './js/bosses/rockBruteBoss.js',
    './js/bosses/necroShamanBoss.js',
    './js/bosses/infernalBruteBoss.js',
    './js/upgrades/upgradeRegistry.js',
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
    './js/ui/collectionModal.js',
    './js/ui/achievementsModal.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                return networkResponse;
            }).catch(() => {
                // Offline fallback if necessary
            });
        })
    );
});
