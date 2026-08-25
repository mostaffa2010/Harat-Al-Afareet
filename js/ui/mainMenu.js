/**
 * حارة العفاريت — Harat El Afareet
 * Main Menu Screen
 */

import { audioSystem } from '../systems/audioSystem.js';

export class MainMenu {
    constructor(container, onNavigate) {
        this.container = container;
        this.onNavigate = onNavigate;
    }

    render(saveData) {
        this.container.innerHTML = `
            <div class="menu-screen main-menu-bg">
                <div class="menu-header">
                    <div class="ancient-symbol">𓂀</div>
                    <h1 class="game-title">حارة العفاريت</h1>
                    <h2 class="game-subtitle">Harat El Afareet</h2>
                    <p class="game-tagline">«سحر الفراعنة وجان الحارة في مواجهة ملحمية»</p>
                </div>

                <div class="gold-badge">
                    <span>🪙 العملات الأثرية:</span>
                    <span class="gold-amount">${saveData.coins || 0}</span>
                </div>

                <div class="menu-buttons">
                    <button class="btn btn-primary btn-large" id="btn-start-game">
                        <span class="btn-icon">⚔️</span>
                        <span>ابدأ المعركة (PLAY)</span>
                    </button>

                    <button class="btn btn-gold" id="btn-char-select">
                        <span class="btn-icon">🧙‍♂️</span>
                        <span>الأبطال (Characters)</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-bazaar">
                        <span class="btn-icon">🏺</span>
                        <span>سوق العطارين (Bazaar)</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-collection">
                        <span class="btn-icon">📜</span>
                        <span>موسوعة الحارة (Lore)</span>
                    </button>

                    <button class="btn btn-muted" id="btn-sound-toggle">
                        <span class="btn-icon">🔊</span>
                        <span>الصوت: ${saveData.audio.soundEnabled ? 'مفعل' : 'مكتوم'}</span>
                    </button>
                </div>

                <div class="menu-footer">
                    <span>أطول صمود: ${Math.floor((saveData.highScoreTime || 0) / 60)}د ${(saveData.highScoreTime || 0) % 60}ث</span>
                    <span>|</span>
                    <span>عفاريت مهزومة: ${saveData.totalEnemiesDefeated || 0}</span>
                </div>
            </div>
        `;

        this.bindEvents(saveData);
    }

    bindEvents(saveData) {
        document.getElementById('btn-start-game').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('CHARACTER_SELECT');
        };

        document.getElementById('btn-char-select').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('CHARACTER_SELECT');
        };

        document.getElementById('btn-bazaar').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('BAZAAR');
        };

        document.getElementById('btn-collection').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('COLLECTION');
        };

        document.getElementById('btn-sound-toggle').onclick = () => {
            saveData.audio.soundEnabled = !saveData.audio.soundEnabled;
            audioSystem.setSoundEnabled(saveData.audio.soundEnabled);
            audioSystem.playClick();
            this.render(saveData);
        };
    }
}
