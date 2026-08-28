/**
 * حارة العفاريت — Harat El Afareet
 * Pause Menu Screen (Egyptian Colloquial Theme)
 */

import { audioSystem } from '../systems/audioSystem.js';

export class PauseMenu {
    constructor(container, onResume, onRestart, onQuit) {
        this.container = container;
        this.onResume = onResume;
        this.onRestart = onRestart;
        this.onQuit = onQuit;
    }

    render(player, xpSystem, waveSystem) {
        const mins = Math.floor(waveSystem.runTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(waveSystem.runTime % 60).toString().padStart(2, '0');

        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="menu-dialog">
                    <h2 class="dialog-title">⏸ مريح شوية</h2>
                    <p class="dialog-sub">خد نفسك.. العفاريت مستنياك ترجع تدوس!</p>

                    <div class="pause-stats-card">
                        <div class="stat-row">
                            <span>البطل اللي نازل بيه:</span>
                            <span class="stat-val" style="color: ${player.themePrimary}">${player.characterName}</span>
                        </div>
                        <div class="stat-row">
                            <span>وقت الصمود في الحارة:</span>
                            <span class="stat-val">${mins}:${secs}</span>
                        </div>
                        <div class="stat-row">
                            <span>المستوى الحالي:</span>
                            <span class="stat-val">${xpSystem.level}</span>
                        </div>
                        <div class="stat-row">
                            <span>الفلوس اللي جمعتها:</span>
                            <span class="stat-val">🪙 ${xpSystem.runCoins}</span>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary btn-large" id="btn-pause-resume">
                            <span>كمل المعركة</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-pause-restart">
                            <span>ابدأ الجولة من الأول</span>
                        </button>
                        <button class="btn btn-muted" id="btn-pause-quit">
                            <span>ارجع للقائمة وسوق العطارين</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-pause-resume').onclick = () => {
            audioSystem.playClick();
            this.onResume();
        };

        document.getElementById('btn-pause-restart').onclick = () => {
            audioSystem.playClick();
            this.onRestart();
        };

        document.getElementById('btn-pause-quit').onclick = () => {
            audioSystem.playClick();
            this.onQuit();
        };
    }
}
