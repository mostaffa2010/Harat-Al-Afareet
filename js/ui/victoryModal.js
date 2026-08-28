/**
 * حارة العفاريت — Harat El Afareet
 * Victory Triumph Modal (Egyptian Colloquial Theme)
 */

import { audioSystem } from '../systems/audioSystem.js';

export class VictoryModal {
    constructor(container, onPlayAgain, onMenu) {
        this.container = container;
        this.onPlayAgain = onPlayAgain;
        this.onMenu = onMenu;
    }

    render(runSummary) {
        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-dialog victory-dialog">
                    <div class="dialog-trophy">👑✨</div>
                    <h2 class="dialog-title text-gold">يا جمالو.. طهرت الحارة وفرتكت سلطان الجان!</h2>
                    <p class="dialog-sub">مبروك يا معلم، كسبت معركة الـ 10 دقايق والفلوس هلت عليك!</p>

                    <div class="run-summary-card">
                        <div class="stat-row">
                            <span>الصمود الكامل:</span>
                            <span class="stat-val highlight">10:00 (10 دقائق بالتمام)</span>
                        </div>
                        <div class="stat-row">
                            <span>العفاريت المهزومة:</span>
                            <span class="stat-val highlight">${runSummary.enemiesDefeated || 0}</span>
                        </div>
                        <div class="stat-row">
                            <span>مكافأة الفوز الكبيرة:</span>
                            <span class="stat-val text-gold">🪙 +${runSummary.coinsCollected || 0} عملة</span>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary btn-large btn-glow" id="btn-victory-again">
                            <span>⚔️ جولة تانية ببطل تاني</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-victory-menu">
                            <span>سوق العطارين والقائمة الرئيسية</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-victory-again').onclick = () => {
            audioSystem.playClick();
            this.onPlayAgain();
        };

        document.getElementById('btn-victory-menu').onclick = () => {
            audioSystem.playClick();
            this.onMenu();
        };
    }
}
