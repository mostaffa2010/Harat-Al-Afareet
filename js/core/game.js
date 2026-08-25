/**
 * حارة العفاريت — Harat El Afareet
 * Central Game Orchestrator & State Machine
 */

import { GAME_STATES } from '../data/constants.js';
import { assetManager } from './assetManager.js';
import { Renderer } from './renderer.js';
import { GameLoop } from './gameLoop.js';
import { inputSystem } from '../systems/inputSystem.js';
import { cameraSystem } from '../systems/cameraSystem.js';
import { collisionSystem } from '../systems/collisionSystem.js';
import { particleSystem } from '../systems/particleSystem.js';
import { damageSystem } from '../systems/damageSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { saveSystem } from '../systems/saveSystem.js';
import { xpSystem } from '../systems/xpSystem.js';
import { upgradeSystem } from '../systems/upgradeSystem.js';
import { waveSystem } from '../systems/waveSystem.js';
import { spawnSystem } from '../systems/spawnSystem.js';
import { characterRegistry } from '../characters/characterRegistry.js';
import { UIManager } from '../ui/uiManager.js';
import { Player } from '../entities/player.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.overlay = document.getElementById('ui-overlay');

        this.renderer = new Renderer(this.canvas);
        this.uiManager = new UIManager(this.overlay);
        this.loop = new GameLoop(
            (dt) => this.update(dt),
            () => this.render()
        );

        this.state = GAME_STATES.MAIN_MENU;

        // Active Run Entities & Arrays
        this.player = null;
        this.enemies = [];
        this.boss = null;
        this.projectiles = [];
        this.pickups = [];
        this.warnings = [];

        this.enemiesDefeatedCount = 0;
    }

    async init() {
        // 1. Initialize Save Data
        saveSystem.init();

        // 2. Initialize Audio System
        audioSystem.init();
        audioSystem.setSoundEnabled(saveSystem.data.audio.soundEnabled);

        // 3. Bake and generate procedural pixel-art assets
        await assetManager.init();

        // 4. Initialize Controls
        inputSystem.init(this.canvas);

        // 5. Setup Window Resize Handler
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => setTimeout(() => this.handleResize(), 100));

        // 6. Initialize UI Callbacks
        this.uiManager.init({
            onNavigate: (targetState) => this.setState(targetState),
            onStartRun: (charConfig) => this.startRun(charConfig),
            onPause: () => this.pauseRun(),
            onResume: () => this.resumeRun(),
            onRestart: () => this.restartRun(),
            onQuit: () => this.quitToMenu(),
            onSelectUpgrade: (upgradeCard) => this.applyLevelUpUpgrade(upgradeCard)
        });

        // 7. Start in Main Menu
        this.setState(GAME_STATES.MAIN_MENU);

        // 8. Start loop (always running for smooth menus / particles / transitions)
        this.loop.start();
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.resize(width, height);
    }

    setState(newState, extraData = {}) {
        this.state = newState;
        this.uiManager.setScreen(newState, extraData);
    }

    startRun(characterConfig) {
        // Reset sub-systems
        xpSystem.reset();
        upgradeSystem.reset();
        waveSystem.reset();
        spawnSystem.reset();
        particleSystem.clear();
        damageSystem.clear();
        inputSystem.reset();

        this.enemies = [];
        this.boss = null;
        this.projectiles = [];
        this.pickups = [];
        this.warnings = [];
        this.enemiesDefeatedCount = 0;

        // Spawn Player with saved permanent upgrades bonuses
        this.player = new Player(characterConfig, saveSystem.data.permanentUpgrades);

        // Center camera immediately
        cameraSystem.x = this.player.x;
        cameraSystem.y = this.player.y;
        cameraSystem.targetX = this.player.x;
        cameraSystem.targetY = this.player.y;

        this.setState(GAME_STATES.PLAYING);
    }

    pauseRun() {
        if (this.state === GAME_STATES.PLAYING) {
            this.setState(GAME_STATES.PAUSED, {
                player: this.player,
                xpSystem: xpSystem,
                waveSystem: waveSystem
            });
        }
    }

    resumeRun() {
        if (this.state === GAME_STATES.PAUSED) {
            inputSystem.reset();
            this.setState(GAME_STATES.PLAYING);
        }
    }

    restartRun() {
        const charId = saveSystem.data.selectedCharacterId || 'apprentice';
        const charConfig = characterRegistry.get(charId);
        this.startRun(charConfig);
    }

    quitToMenu() {
        this.setState(GAME_STATES.MAIN_MENU);
    }

    applyLevelUpUpgrade(card) {
        upgradeSystem.applyUpgrade(card);
        xpSystem.levelUpPending = false;
        inputSystem.reset();
        this.setState(GAME_STATES.PLAYING);
    }

    // ==========================================
    // GAME UPDATE LOOP
    // ==========================================
    update(dt) {
        // Handle input pause key
        if (inputSystem.consumePause()) {
            if (this.state === GAME_STATES.PLAYING) {
                this.pauseRun();
                return;
            } else if (this.state === GAME_STATES.PAUSED) {
                this.resumeRun();
                return;
            }
        }

        // Camera & Particles always update (for screen shake & background mood)
        cameraSystem.update(dt);
        particleSystem.update(dt);
        damageSystem.update(dt);

        if (this.state !== GAME_STATES.PLAYING) return;

        // Check for Level-Up trigger
        if (xpSystem.levelUpPending) {
            const choices = upgradeSystem.generateChoices(this.player, 3);
            this.setState(GAME_STATES.LEVEL_UP, { cards: choices });
            return;
        }

        // 1. Update Player
        if (this.player && this.player.alive) {
            this.player.update(dt, this.enemies, this.projectiles);
        } else if (this.player && !this.player.alive) {
            this.handleGameOver();
            return;
        }

        // 2. Update Wave Progression & Boss Spawn Check
        const newBoss = waveSystem.update(dt, this.player, this.enemies, this.boss);
        if (newBoss) {
            this.boss = newBoss;
        }

        // 3. Update Enemy Spawning
        spawnSystem.update(dt, this.player, this.enemies);

        // 4. Update Boss Attacks & AI
        if (this.boss && this.boss.alive) {
            this.boss.updateAI(dt, this.player, this.projectiles, this.warnings, this.enemies);
        } else if (this.boss && !this.boss.alive && !waveSystem.bossDefeated) {
            waveSystem.bossDefeated = true;
            const drops = this.boss.createDropPickups();
            this.pickups.push(...drops);
            this.enemiesDefeatedCount += 1;
            setTimeout(() => this.handleVictory(), 2000);
        }

        // 5. Update Warning Telegraphs
        for (let i = this.warnings.length - 1; i >= 0; i--) {
            const w = this.warnings[i];
            w.timeLeft -= dt;
            if (w.timeLeft <= 0) {
                w.onTrigger(this.player);
                this.warnings.splice(i, 1);
            }
        }

        // 6. Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt, this.player, this.enemies);
            if (!p.alive) {
                this.projectiles.splice(i, 1);
            }
        }

        // 7. Update Pickups
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const pickup = this.pickups[i];
            pickup.update(dt, this.player);
            if (!pickup.alive) {
                this.pickups.splice(i, 1);
            }
        }

        // 8. Build Spatial Collision Grid
        collisionSystem.clear();
        for (let i = 0; i < this.enemies.length; i++) {
            collisionSystem.insert(this.enemies[i]);
        }

        // 9. Resolve Collisions: Projectiles vs Enemies / Boss
        for (let i = 0; i < this.projectiles.length; i++) {
            const p = this.projectiles[i];
            if (!p.alive) continue;

            if (p.isEnemy) {
                // Enemy projectile hitting Player
                if (this.player && this.player.alive && collisionSystem.checkCircleOverlap(p.x, p.y, p.radius, this.player.x, this.player.y, this.player.radius)) {
                    this.player.takeDamage(p.damage);
                    p.alive = false;
                }
            } else {
                // Player projectile hitting Boss
                if (this.boss && this.boss.alive && p.canHit(this.boss)) {
                    if (collisionSystem.checkCircleOverlap(p.x, p.y, p.radius, this.boss.x, this.boss.y, this.boss.radius)) {
                        p.onHit(this.boss);
                        const result = damageSystem.calculateDamage(p.damage, this.player, this.boss, p.damageType);
                        this.boss.takeDamage(result.damage, this.player, true);
                        damageSystem.spawnText(this.boss.x, this.boss.y, result.damage, result.isCrit, p.color);
                    }
                }

                // Player projectile hitting regular enemies
                const candidates = collisionSystem.queryRadius(p.x, p.y, p.radius + 32);
                for (let j = 0; j < candidates.length; j++) {
                    const e = candidates[j];
                    if (!e.alive || !p.canHit(e)) continue;

                    if (collisionSystem.checkCircleOverlap(p.x, p.y, p.radius, e.x, e.y, e.radius)) {
                        p.onHit(e);

                        const result = damageSystem.calculateDamage(p.damage, this.player, e, p.damageType);
                        const knockDir = {
                            x: (e.x - this.player.x) || 1,
                            y: (e.y - this.player.y) || 0,
                            force: 150
                        };
                        const len = Math.sqrt(knockDir.x * knockDir.x + knockDir.y * knockDir.y);
                        knockDir.x /= len; knockDir.y /= len;

                        e.takeDamage(result.damage, this.player, true, knockDir);
                        damageSystem.spawnText(e.x, e.y, result.damage, result.isCrit, p.color);

                        if (p.appliesBurn) {
                            e.applyBurn(p.burnDamage, p.burnDuration, this.player);
                        }

                        if (!p.alive) break;
                    }
                }
            }
        }

        // 10. Update & Prune Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update(dt, this.player, this.projectiles);

            if (!e.alive) {
                this.enemiesDefeatedCount += 1;
                const drops = e.createDropPickups();
                this.pickups.push(...drops);
                this.enemies.splice(i, 1);
            }
        }

        // 11. Check Player vs Pickups (Magnet Collection)
        for (let i = 0; i < this.pickups.length; i++) {
            const p = this.pickups[i];
            if (p.alive && collisionSystem.checkCircleOverlap(this.player.x, this.player.y, this.player.radius, p.x, p.y, p.radius)) {
                xpSystem.handlePickupCollection(p, this.player, this.pickups);
            }
        }

        // 12. Update In-Game HUD
        this.uiManager.updateHUD(this.player, xpSystem, waveSystem, this.boss);
    }

    handleGameOver() {
        const survivalTime = Math.floor(waveSystem.runTime);
        const coinsEarned = xpSystem.runCoins;
        const enemiesDefeated = this.enemiesDefeatedCount;

        saveSystem.recordRun(survivalTime, enemiesDefeated, coinsEarned);

        this.setState(GAME_STATES.GAME_OVER, {
            summary: {
                survivalTime,
                level: xpSystem.level,
                enemiesDefeated,
                coinsEarned
            }
        });
    }

    handleVictory() {
        const survivalTime = Math.floor(waveSystem.runTime);
        const coinsEarned = xpSystem.runCoins + 250; // Victory bonus
        const enemiesDefeated = this.enemiesDefeatedCount;

        saveSystem.recordRun(survivalTime, enemiesDefeated, coinsEarned);
        audioSystem.playLevelUp();

        this.setState(GAME_STATES.VICTORY, {
            summary: {
                characterName: this.player.characterName,
                survivalTime,
                enemiesDefeated,
                coinsEarned
            }
        });
    }

    // ==========================================
    // RENDER DISPATCH
    // ==========================================
    render() {
        this.renderer.render({
            player: this.player,
            enemies: this.enemies,
            boss: this.boss,
            projectiles: this.projectiles,
            pickups: this.pickups,
            particles: particleSystem.particles,
            damageNumbers: damageSystem.damageNumbers,
            warnings: this.warnings
        });
    }
}
