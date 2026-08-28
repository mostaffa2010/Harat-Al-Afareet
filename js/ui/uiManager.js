/**
 * حارة العفاريت — Harat El Afareet
 * Master UI Manager (Streamlined Flow)
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

export class UIManager {
    constructor(overlayContainer) {
        this.container = overlayContainer;
        this.hudContainer = document.getElementById('hud-container');

        this.callbacks = {};
        this.currentScreen = null;

        this.mainMenu = new MainMenu(this.container, (state) => this.callbacks.onNavigate(state));
        this.difficultySelect = new DifficultySelect(
            this.container,
            (diff) => this.callbacks.onNavigate(GAME_STATES.CHARACTER_SELECT),
            () => this.callbacks.onNavigate(GAME_STATES.MAIN_MENU)
        );
        this.characterSelect = new CharacterSelect(
            this.container,
            (char) => this.callbacks.onStartRun(char),
            () => this.callbacks.onNavigate(GAME_STATES.DIFFICULTY_SELECT)
        );
        this.hud = new HUD(this.hudContainer, () => this.callbacks.onPause());
        this.levelUpModal = new LevelUpModal(this.container, (upgrade) => this.callbacks.onSelectUpgrade(upgrade));
        this.pauseMenu = new PauseMenu(
            this.container,
            () => this.callbacks.onResume(),
            () => this.callbacks.onRestart(),
            () => this.callbacks.onQuit()
        );
        this.gameOverModal = new GameOverModal(
            this.container,
            () => this.callbacks.onRestart(),
            () => this.callbacks.onQuit()
        );
        this.victoryModal = new VictoryModal(
            this.container,
            () => this.callbacks.onNavigate(GAME_STATES.DIFFICULTY_SELECT),
            () => this.callbacks.onQuit()
        );
        this.bazaarModal = new BazaarModal(this.container, () => this.callbacks.onNavigate(GAME_STATES.MAIN_MENU));
        this.collectionModal = new CollectionModal(this.container, () => this.callbacks.onNavigate(GAME_STATES.MAIN_MENU));
        this.achievementsModal = new AchievementsModal(this.container, () => this.callbacks.onNavigate(GAME_STATES.MAIN_MENU));
    }

    init(callbacks) {
        this.callbacks = callbacks;
        this.hud.render();
    }

    setScreen(state, extraData = {}) {
        this.currentScreen = state;

        if (state === GAME_STATES.PLAYING) {
            this.container.innerHTML = '';
            this.hudContainer.style.display = 'block';
        } else if (state === GAME_STATES.MAIN_MENU) {
            this.hudContainer.style.display = 'none';
            this.mainMenu.render(saveSystem.data);
        } else if (state === GAME_STATES.DIFFICULTY_SELECT) {
            this.hudContainer.style.display = 'none';
            this.difficultySelect.render();
        } else if (state === GAME_STATES.CHARACTER_SELECT) {
            this.hudContainer.style.display = 'none';
            this.characterSelect.render();
        } else if (state === GAME_STATES.BAZAAR) {
            this.hudContainer.style.display = 'none';
            this.bazaarModal.render();
        } else if (state === GAME_STATES.COLLECTION) {
            this.hudContainer.style.display = 'none';
            this.collectionModal.render();
        } else if (state === GAME_STATES.ACHIEVEMENTS) {
            this.hudContainer.style.display = 'none';
            this.achievementsModal.render();
        } else if (state === GAME_STATES.LEVEL_UP) {
            this.levelUpModal.render(extraData.cards || []);
        } else if (state === GAME_STATES.PAUSED) {
            this.pauseMenu.render(extraData.player, extraData.xpSystem, extraData.waveSystem);
        } else if (state === GAME_STATES.GAME_OVER) {
            this.hudContainer.style.display = 'none';
            this.gameOverModal.render(extraData.summary || {});
        } else if (state === GAME_STATES.VICTORY) {
            this.hudContainer.style.display = 'none';
            this.victoryModal.render(extraData.summary || {});
        }
    }

    updateHUD(player, xpSystem, waveSystem, boss) {
        if (this.currentScreen === GAME_STATES.PLAYING) {
            this.hud.update(player, xpSystem, waveSystem, boss);
        }
    }
}
