/**
 * حارة العفاريت — Harat El Afareet
 * Central Game Orchestrator & State Machine (v5.0)
 */

import { GAME_STATES, DIFFICULTY_MODES } from '../data/constants.js';
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
import { difficultySystem } from '../systems/difficultySystem.js';
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

        // Active Game Entities
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];
        this.activeBoss = null;
        this.activeMiniBosses = [];
        this.telegraphedWarnings = [];

        // 20 Minutes Till Dawn Style Grace Period after Level-Up / Unpause
        this.graceTimer = 0;

        // Statistics for current run
        this.runStats = {
            enemiesDefeated: 0,
            coinsCollected: 0,
            damageDealt: 0,
            timeSurvived: 0
        };
    }

    async init() {
        await assetManager.init();
        saveSystem.loadGame();
        inputSystem.init(this.canvas);
        audioSystem.init();

        this.uiManager.init({
            onStartGame: (difficultyKey) => this.handleDifficultySelect(difficultyKey),
            onSelectCharacterAndPlay: (charConfig) => this.startRun(charConfig),
            onSelectUpgrade: (upgradeCard) => this.handleUpgradeChosen(upgradeCard),
            onResumeGame: () => this.resumeGame(),
            onRestartGame: () => this.restartRun(),
            onReturnToMenu: () => this.returnToMenu(),
            onOpenBazaar: () => this.openBazaar(),
            onOpenAchievements: () => this.openAchievements(),
            onOpenCollection: () => this.openCollection()
        });

        this.setState(GAME_STATES.MAIN_MENU);
        this.loop.start();
    }

    setState(newState) {
        this.state = newState;
        this.uiManager.showState(newState, this);
    }

    handleDifficultySelect(difficultyKey) {
        difficultySystem.setDifficulty(difficultyKey || 'NORMAL');
        saveSystem.data.selectedDifficulty = difficultyKey || 'NORMAL';
        saveSystem.saveGame();
        this.setState(GAME_STATES.CHARACTER_SELECT);
    }

    startRun(characterConfig) {
        const charData = characterConfig || characterRegistry.get(saveSystem.data.selectedCharacter || 'apprentice');
        this.player = new Player(charData);

        // Apply Permanent Bazaar Upgrades from Save
        this.applyPermanentProgression(this.player);

        // Clear active entities
        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];
        this.activeBoss = null;
        this.activeMiniBosses = [];
        this.telegraphedWarnings = [];
        this.graceTimer = 0;

        // Reset systems
        waveSystem.reset();
        spawnSystem.reset();
        xpSystem.reset();
        upgradeSystem.reset();
        damageSystem.reset();
        particleSystem.reset();
        cameraSystem.reset(this.player.x, this.player.y);

        this.runStats = {
            enemiesDefeated: 0,
            coinsCollected: 0,
            damageDealt: 0,
            timeSurvived: 0
        };

        this.setState(GAME_STATES.PLAYING);
        audioSystem.playLevelUp();
    }

    applyPermanentProgression(player) {
        const p = saveSystem.data.permanentUpgrades || {};
        if (p.maxHealth) player.maxHp += p.maxHealth * 15;
        player.hp = player.maxHp;
        if (p.damage) player.damageMultiplier += p.damage * 0.05;
        if (p.speed) player.movementSpeed += p.speed * 10;
        if (p.pickupRange) player.pickupRadius += p.pickupRange * 15;
        if (p.armor) player.armor += p.armor * 1;
        if (p.xpBoost) player.xpMultiplier += p.xpBoost * 0.05;
        if (p.critChance) player.criticalChance += p.critChance * 0.02;
    }

    handleUpgradeChosen(card) {
        upgradeSystem.applyUpgrade(card);
        this.setState(GAME_STATES.PLAYING);

        // 20 Minutes Till Dawn style 0.35s grace buffer & 1.2s invulnerability
        this.graceTimer = 0.35;
        if (this.player) {
            this.player.invulnerableTimer = 1.2;
            particleSystem.emitLevelUpPulse(this.player.x, this.player.y);
        }
    }

    resumeGame() {
        this.setState(GAME_STATES.PLAYING);
        this.graceTimer = 0.35;
    }

    restartRun() {
        const charData = characterRegistry.get(saveSystem.data.selectedCharacter || 'apprentice');
        this.startRun(charData);
    }

    returnToMenu() {
        this.setState(GAME_STATES.MAIN_MENU);
    }

    openBazaar() {
        this.setState(GAME_STATES.BAZAAR);
    }

    openAchievements() {
        this.setState(GAME_STATES.ACHIEVEMENTS);
    }

    openCollection() {
        this.setState(GAME_STATES.COLLECTION);
    }

    pauseGame() {
        if (this.state === GAME_STATES.PLAYING) {
            this.setState(GAME_STATES.PAUSED);
        }
    }

    triggerLevelUp() {
        audioSystem.playLevelUp();
        if (this.player) {
            particleSystem.emitLevelUpPulse(this.player.x, this.player.y);
        }
        const choices = upgradeSystem.generateChoices(this.player, 3);
        this.setState(GAME_STATES.LEVEL_UP);
        this.uiManager.showLevelUpModal(choices);
    }

    onPlayerDied() {
        this.runStats.timeSurvived = Math.floor(waveSystem.runTime);
        this.runStats.coinsCollected = xpSystem.runCoins;

        saveSystem.recordRunStats(
            this.runStats.timeSurvived,
            this.runStats.enemiesDefeated,
            this.runStats.coinsCollected,
            this.player.characterId
        );

        this.setState(GAME_STATES.GAME_OVER);
    }

    onBossDefeated(boss) {
        audioSystem.playBossRoar();
        particleSystem.emitDeathExplosion(boss.x, boss.y, '#fbbf24', 50);

        if (boss.bossId === 'afreetKing') {
            this.runStats.timeSurvived = Math.floor(waveSystem.runTime);
            this.runStats.coinsCollected = xpSystem.runCoins + 250;

            saveSystem.recordRunStats(
                this.runStats.timeSurvived,
                this.runStats.enemiesDefeated,
                this.runStats.coinsCollected,
                this.player.characterId
            );

            setTimeout(() => {
                this.setState(GAME_STATES.VICTORY);
            }, 1200);
        }
    }

    update(dt) {
        if (this.state === GAME_STATES.PLAYING) {
            // Check Pause key
            if (inputSystem.consumePause()) {
                this.pauseGame();
                return;
            }

            // Always update camera & HUD
            cameraSystem.update(this.player.x, this.player.y, dt);
            this.uiManager.updateHUD(this.player, xpSystem, waveSystem, this.activeBoss || (this.activeMiniBosses.length > 0 ? this.activeMiniBosses[0] : null));

            // Grace period: allow camera/visuals, but freeze game simulation briefly
            if (this.graceTimer > 0) {
                this.graceTimer -= dt;
                damageSystem.update(dt);
                particleSystem.update(dt);
                return;
            }

            // 1. Update Player
            const movement = inputSystem.getMovement();
            this.player.update(dt, movement, inputSystem.consumeDash());

            if (!this.player.alive) {
                this.onPlayerDied();
                return;
            }

            // 2. Update Weapons
            if (this.player.weapons) {
                for (const wep of this.player.weapons) {
                    wep.update(dt, this.enemies, this.projectiles);
                }
            }

            // 3. Update Wave System & Bosses
            const newlySpawnedBoss = waveSystem.update(dt, this.player, this.enemies, this.activeBoss);
            if (newlySpawnedBoss) {
                if (newlySpawnedBoss.isMiniBoss) {
                    this.activeMiniBosses.push(newlySpawnedBoss);
                } else {
                    this.activeBoss = newlySpawnedBoss;
                }
            }

            // 4. Update Spawner
            const availableTypes = waveSystem.getAvailableEnemyTypes(waveSystem.runTime);
            spawnSystem.update(dt, this.player, this.enemies, availableTypes, difficultySystem.currentDifficulty);

            // 5. Update Enemies
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                enemy.update(dt, this.player, this.projectiles);

                if (!enemy.alive) {
                    this.runStats.enemiesDefeated += 1;
                    const drops = enemy.createDropPickups();
                    for (const d of drops) this.pickups.push(d);
                    this.enemies.splice(i, 1);
                }
            }

            // 6. Update Mini-Bosses
            for (let i = this.activeMiniBosses.length - 1; i >= 0; i--) {
                const miniBoss = this.activeMiniBosses[i];
                miniBoss.update(dt, this.player, this.projectiles, this.telegraphedWarnings, this.enemies);
                if (!miniBoss.alive) {
                    this.runStats.enemiesDefeated += 1;
                    const drops = miniBoss.createDropPickups();
                    for (const d of drops) this.pickups.push(d);
                    this.activeMiniBosses.splice(i, 1);
                }
            }

            // 7. Update Big Boss
            if (this.activeBoss) {
                this.activeBoss.update(dt, this.player, this.projectiles, this.telegraphedWarnings, this.enemies);
                if (!this.activeBoss.alive) {
                    this.onBossDefeated(this.activeBoss);
                    this.activeBoss = null;
                }
            }

            // 8. Update Projectiles
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const proj = this.projectiles[i];
                proj.update(dt, this.player, this.enemies);
                if (!proj.alive) {
                    this.projectiles.splice(i, 1);
                }
            }

            // 9. Update Pickups
            for (let i = this.pickups.length - 1; i >= 0; i--) {
                const pickup = this.pickups[i];
                pickup.update(dt, this.player);
                if (!pickup.alive) {
                    this.pickups.splice(i, 1);
                }
            }

            // 10. Update Warnings & Traps
            for (let i = this.telegraphedWarnings.length - 1; i >= 0; i--) {
                const w = this.telegraphedWarnings[i];
                w.timeLeft -= dt;
                if (w.timeLeft <= 0) {
                    if (typeof w.onTrigger === 'function') {
                        w.onTrigger(this.player);
                    }
                    this.telegraphedWarnings.splice(i, 1);
                }
            }

            // 11. Collisions
            const allHostiles = [...this.enemies, ...this.activeMiniBosses];
            if (this.activeBoss) allHostiles.push(this.activeBoss);

            collisionSystem.checkAll(this.player, allHostiles, this.projectiles, this.pickups);

            // 12. Check Level Up
            if (xpSystem.checkLevelUp()) {
                this.triggerLevelUp();
            }

            // 13. Update VFX & Floating Damage Numbers
            damageSystem.update(dt);
            particleSystem.update(dt);
        }
    }

    render() {
        const allHostiles = [...this.enemies, ...this.activeMiniBosses];
        if (this.activeBoss) allHostiles.push(this.activeBoss);

        this.renderer.render({
            state: this.state,
            player: this.player,
            enemies: allHostiles,
            boss: this.activeBoss,
            projectiles: this.projectiles,
            pickups: this.pickups,
            particles: particleSystem.particles,
            damageNumbers: damageSystem.damageNumbers,
            warnings: this.telegraphedWarnings,
            camera: cameraSystem
        });
    }
}
