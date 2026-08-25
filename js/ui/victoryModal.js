/**
 * حارة العفاريت — Harat El Afareet
 * Victory Triumph Modal
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
                <div class="menu-dialog victory-dialog">
                    <div class="dialog-trophy">👑✨</div>
                    <h2 class="dialog-title text-gold">نصرٌ أسطوري! (VICTORY)</h2>
                    <p class="dialog-sub">لقد هزمت ملك العفاريت وطهرت الحارة من الظلام!</p>

                    <div class="run-summary-card">
                        <div class="stat-row">
                            <span>البطل المنتصر:</span>
                            <span class="stat-val highlight">${runSummary.characterName}</span>
                        </div>
                        <div class="stat-row">
                            <span>الصمود الكامل:</span>
                            <span class="stat-val highlight">10:00 (10 دقائق)</span>
                        </div>
                        <div class="stat-row">
                            <span>العفاريت المهزومة:</span>
                            <span class="stat-val">${runSummary.enemiesDefeated}</span>
                        </div>
                        <div class="stat-row">
                            <span>جائزة الانتصار الكبرى:</span>
                            <span class="stat-val text-gold">🪙 +${runSummary.coinsEarned} عملة</span>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary btn-large btn-glow" id="btn-victory-again">
                            <span>⚔️ جولة جديدة ببطل آخر</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-victory-menu">
                            <span>العودة للقائمة وسوق العطارين</span>
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
