/**
 * حارة العفاريت — Harat El Afareet
 * Game Over Defeat Modal (Egyptian Colloquial Theme)
 */

import { audioSystem } from '../systems/audioSystem.js';

export class GameOverModal {
    constructor(container, onRetry, onMenu) {
        this.container = container;
        this.onRetry = onRetry;
        this.onMenu = onMenu;
    }

    render(runSummary) {
        const mins = Math.floor((runSummary.timeSurvived || 0) / 60).toString().padStart(2, '0');
        const secs = Math.floor((runSummary.timeSurvived || 0) % 60).toString().padStart(2, '0');

        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-dialog game-over-dialog">
                    <div class="dialog-skull">💀</div>
                    <h2 class="dialog-title text-red">راحت عليك يا بطل!</h2>
                    <p class="dialog-sub">العفاريت كتّرت عليك بس قاومت بشرف.. ادخل سوق العطارين طور بطل واطلع تاني!</p>

                    <div class="run-summary-card">
                        <div class="stat-row">
                            <span>مدة صمودك:</span>
                            <span class="stat-val highlight">${mins}:${secs}</span>
                        </div>
                        <div class="stat-row">
                            <span>عفاريت فرتكتها:</span>
                            <span class="stat-val highlight">${runSummary.enemiesDefeated || 0}</span>
                        </div>
                        <div class="stat-row">
                            <span>العملات اللي كسبتها:</span>
                            <span class="stat-val text-gold">🪙 +${runSummary.coinsCollected || 0} عملة</span>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary btn-large btn-glow" id="btn-gameover-retry">
                            <span>⚔️ حاول تاني واثأر لنفسك</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-gameover-menu">
                            <span>سوق العطارين والقائمة الرئيسية</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-gameover-retry').onclick = () => {
            audioSystem.playClick();
            this.onRetry();
        };

        document.getElementById('btn-gameover-menu').onclick = () => {
            audioSystem.playClick();
            this.onMenu();
        };
    }
}
