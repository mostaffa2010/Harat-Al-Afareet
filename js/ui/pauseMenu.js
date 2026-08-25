/**
 * حارة العفاريت — Harat El Afareet
 * Pause Menu Screen
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
                    <h2 class="dialog-title">⏸ اللعبة متوقفة مؤقتاً</h2>

                    <div class="pause-stats-card">
                        <div class="stat-row">
                            <span>البطل:</span>
                            <span class="stat-val" style="color: ${player.themePrimary}">${player.characterName}</span>
                        </div>
                        <div class="stat-row">
                            <span>وقت الصمود:</span>
                            <span class="stat-val">${mins}:${secs}</span>
                        </div>
                        <div class="stat-row">
                            <span>المستوى:</span>
                            <span class="stat-val">${xpSystem.level}</span>
                        </div>
                        <div class="stat-row">
                            <span>العملات المجمعة:</span>
                            <span class="stat-val">🪙 ${xpSystem.runCoins}</span>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary" id="btn-pause-resume">
                            <span>استئناف المعركة (Resume)</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-pause-restart">
                            <span>إعادة المحاولة (Restart)</span>
                        </button>
                        <button class="btn btn-muted" id="btn-pause-quit">
                            <span>العودة للقائمة الرئيسية (Menu)</span>
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
