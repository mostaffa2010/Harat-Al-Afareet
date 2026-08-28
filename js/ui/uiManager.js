/**
 * حارة العفاريت — Harat El Afareet
 * Master UI Manager (Full Screen Routing & Modal Coordination)
 */

import { GAME_STATES } from '../data/constants.js';
import { MainMenu } from './mainMenu.js';
import { DifficultySelect } from './difficultySelect.js';
import { CharacterSelect } from './characterSelect.js';
import { HUD } from './hud.js';
import { LevelUpModal } from './levelUpModal.js';
import { PauseMenu } from './pauseMenu.js';
import { GameOverModal } from './gameOverModal.js';
import { VictoryModal } from './victoryModal.js';
import { BazaarModal } from './bazaarModal.js';
import { CollectionModal } from './collectionModal.js';
import { AchievementsModal } from './achievementsModal.js';
import { saveSystem } from '../systems/saveSystem.js';
import { xpSystem } from '../systems/xpSystem.js';
import { waveSystem } from '../systems/waveSystem.js';

export class UIManager {
    constructor(overlayContainer) {
        this.container = overlayContainer;
        this.hudContainer = document.getElementById('hud-container');

        this.callbacks = {};
        this.currentScreen = null;

        this.mainMenu = new MainMenu(this.container, (state) => {
            if (state === 'DIFFICULTY_SELECT') {
                this.setScreen(GAME_STATES.DIFFICULTY_SELECT);
            } else if (state === 'BAZAAR') {
                this.setScreen(GAME_STATES.BAZAAR);
            } else if (state === 'ACHIEVEMENTS') {
                this.setScreen(GAME_STATES.ACHIEVEMENTS);
            } else if (state === 'COLLECTION') {
                this.setScreen(GAME_STATES.COLLECTION);
            } else if (this.callbacks.onNavigate) {
                this.callbacks.onNavigate(state);
            }
        });

        this.difficultySelect = new DifficultySelect(
            this.container,
            (diff) => {
                if (this.callbacks.onStartGame) {
                    this.callbacks.onStartGame(diff);
                } else {
                    this.setScreen(GAME_STATES.CHARACTER_SELECT);
                }
            },
            () => {
                this.setScreen(GAME_STATES.MAIN_MENU);
            }
        );

        this.characterSelect = new CharacterSelect(
            this.container,
            (char) => {
                if (this.callbacks.onSelectCharacterAndPlay) {
                    this.callbacks.onSelectCharacterAndPlay(char);
                } else if (this.callbacks.onStartRun) {
                    this.callbacks.onStartRun(char);
                }
            },
            () => {
                this.setScreen(GAME_STATES.DIFFICULTY_SELECT);
            }
        );

        this.hud = new HUD(this.hudContainer, () => {
            if (this.callbacks.onPause) {
                this.callbacks.onPause();
            } else if (this.callbacks.onPauseClick) {
                this.callbacks.onPauseClick();
            }
        });

        this.levelUpModal = new LevelUpModal(this.container, (upgrade) => {
            if (this.callbacks.onSelectUpgrade) {
                this.callbacks.onSelectUpgrade(upgrade);
            }
        });

        this.pauseMenu = new PauseMenu(
            this.container,
            () => {
                if (this.callbacks.onResumeGame) this.callbacks.onResumeGame();
                else if (this.callbacks.onResume) this.callbacks.onResume();
            },
            () => {
                if (this.callbacks.onRestartGame) this.callbacks.onRestartGame();
                else if (this.callbacks.onRestart) this.callbacks.onRestart();
            },
            () => {
                if (this.callbacks.onReturnToMenu) this.callbacks.onReturnToMenu();
                else if (this.callbacks.onQuit) this.callbacks.onQuit();
                else this.setScreen(GAME_STATES.MAIN_MENU);
            }
        );

        this.gameOverModal = new GameOverModal(
            this.container,
            () => {
                if (this.callbacks.onRestartGame) this.callbacks.onRestartGame();
                else if (this.callbacks.onRestart) this.callbacks.onRestart();
                else if (this.callbacks.onRetry) this.callbacks.onRetry();
            },
            () => {
                if (this.callbacks.onReturnToMenu) this.callbacks.onReturnToMenu();
                else if (this.callbacks.onQuit) this.callbacks.onQuit();
                else if (this.callbacks.onMenu) this.callbacks.onMenu();
                else this.setScreen(GAME_STATES.MAIN_MENU);
            }
        );

        this.victoryModal = new VictoryModal(
            this.container,
            () => {
                if (this.callbacks.onStartGame) this.callbacks.onStartGame();
                else if (this.callbacks.onPlayAgain) this.callbacks.onPlayAgain();
                else this.setScreen(GAME_STATES.DIFFICULTY_SELECT);
            },
            () => {
                if (this.callbacks.onReturnToMenu) this.callbacks.onReturnToMenu();
                else if (this.callbacks.onQuit) this.callbacks.onQuit();
                else if (this.callbacks.onMenu) this.callbacks.onMenu();
                else this.setScreen(GAME_STATES.MAIN_MENU);
            }
        );

        this.bazaarModal = new BazaarModal(this.container, () => {
            this.setScreen(GAME_STATES.MAIN_MENU);
        });

        this.collectionModal = new CollectionModal(this.container, () => {
            this.setScreen(GAME_STATES.MAIN_MENU);
        });

        this.achievementsModal = new AchievementsModal(this.container, () => {
            this.setScreen(GAME_STATES.MAIN_MENU);
        });
    }

    init(callbacks) {
        this.callbacks = callbacks || {};
        if (this.hudContainer) {
            this.hud.render();
        }
    }

    showState(state, game) {
        this.setScreen(state, {
            player: game ? game.player : null,
            xpSystem: xpSystem,
            waveSystem: waveSystem,
            summary: game ? game.runStats : null
        });
    }

    showLevelUpModal(cards) {
        this.setScreen(GAME_STATES.LEVEL_UP, { cards });
    }

    setScreen(state, extraData = {}) {
        this.currentScreen = state;

        if (!this.hudContainer) {
            this.hudContainer = document.getElementById('hud-container');
            if (this.hudContainer && !this.hudContainer.innerHTML.trim()) {
                this.hud.container = this.hudContainer;
                this.hud.render();
            }
        }

        if (state === GAME_STATES.PLAYING) {
            this.container.innerHTML = '';
            if (this.hudContainer) this.hudContainer.style.display = 'block';
        } else if (state === GAME_STATES.MAIN_MENU) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.mainMenu.render(saveSystem.data);
        } else if (state === GAME_STATES.DIFFICULTY_SELECT) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.difficultySelect.render();
        } else if (state === GAME_STATES.CHARACTER_SELECT) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.characterSelect.render();
        } else if (state === GAME_STATES.BAZAAR) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.bazaarModal.render();
        } else if (state === GAME_STATES.COLLECTION) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.collectionModal.render();
        } else if (state === GAME_STATES.ACHIEVEMENTS) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.achievementsModal.render();
        } else if (state === GAME_STATES.LEVEL_UP) {
            this.levelUpModal.render(extraData.cards || []);
        } else if (state === GAME_STATES.PAUSED) {
            this.pauseMenu.render(extraData.player, extraData.xpSystem || xpSystem, extraData.waveSystem || waveSystem);
        } else if (state === GAME_STATES.GAME_OVER) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.gameOverModal.render(extraData.summary || {});
        } else if (state === GAME_STATES.VICTORY) {
            if (this.hudContainer) this.hudContainer.style.display = 'none';
            this.victoryModal.render(extraData.summary || {});
        }
    }

    updateHUD(player, xpSys, waveSys, boss) {
        if (this.currentScreen === GAME_STATES.PLAYING) {
            this.hud.update(player, xpSys || xpSystem, waveSys || waveSystem, boss);
        }
    }
}
