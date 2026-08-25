/**
 * حارة العفاريت — Harat El Afareet
 * Game Over Defeat Modal
 */

import { audioSystem } from '../systems/audioSystem.js';

export class GameOverModal {
    constructor(container, onRetry, onMenu) {
        this.container = container;
        this.onRetry = onRetry;
        this.onMenu = onMenu;
    }

    render(runSummary) {
        const mins = Math.floor(runSummary.survivalTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(runSummary.survivalTime % 60).toString().padStart(2, '0');

        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="menu-dialog game-over-dialog">
                    <div class="dialog-skull">💀</div>
                    <h2 class="dialog-title text-red">سقطت في قبضة العفاريت!</h2>
                    <p class="dialog-sub">لقد قاومت بشجاعة في دروب الحارة القديمة</p>

                    <div class="run-summary-card">
                        <div class="stat-row">
                            <span>مدة الصمود:</span>
                            <span class="stat-val highlight">${mins}:${secs}</span>
                        </div>
                        <div class="stat-row">
                            <span>المستوى الذي وصلت إليه:</span>
                            <span class="stat-val highlight">${runSummary.level}</span>
                        </div>
                        <div class="stat-row">
                            <span>العفاريت المهزومة:</span>
                            <span class="stat-val">${runSummary.enemiesDefeated}</span>
                        </div>
                        <div class="stat-row">
                            <span>العملات المكتسبة:</span>
                            <span class="stat-val text-gold">🪙 +${runSummary.coinsEarned}</span>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary btn-large" id="btn-gameover-retry">
                            <span>⚔️ حاول مرة أخرى (Retry)</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-gameover-menu">
                            <span>العودة للقائمة وسوق العطارين</span>
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
