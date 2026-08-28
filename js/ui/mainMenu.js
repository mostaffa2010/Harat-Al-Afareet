/**
 * حارة العفاريت — Harat El Afareet
 * Main Menu Screen (Pure Egyptian Colloquial)
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
                    <h2 class="game-subtitle">حرب السحرة والمردة</h2>
                    <p class="game-tagline">«سحر الفراعنة وجان الحارة في معركة ملحمية.. وريهم العين الحمرا!»</p>
                </div>

                <div class="gold-badge">
                    <span>🪙 جيبك فيه:</span>
                    <span class="gold-amount">${saveData.coins || 0} عملة أثرية</span>
                </div>

                <div class="menu-buttons">
                    <button class="btn btn-primary btn-large btn-glow" id="btn-start-game">
                        <span class="btn-icon">⚔️</span>
                        <span>انزل الحارة وحارب</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-bazaar">
                        <span class="btn-icon">🏺</span>
                        <span>سوق العطارين والبركات</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-achievements">
                        <span class="btn-icon">🏆</span>
                        <span>إنجازات وجوائز الحارة</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-collection">
                        <span class="btn-icon">📜</span>
                        <span>موسوعة أسرار الجان والأسلحة</span>
                    </button>

                    <button class="btn btn-muted" id="btn-sound-toggle">
                        <span class="btn-icon">🔊</span>
                        <span>صوت اللعبة: ${saveData.audio.soundEnabled ? 'شغال تمام' : 'مكتوم'}</span>
                    </button>
                </div>

                <div class="menu-footer">
                    <span>أطول صمود: ${Math.floor((saveData.highScoreTime || 0) / 60)}د ${(saveData.highScoreTime || 0) % 60}ث</span>
                    <span>|</span>
                    <span>عفاريت مفرتكة: ${saveData.totalEnemiesDefeated || 0}</span>
                </div>
            </div>
        `;

        this.bindEvents(saveData);
    }

    bindEvents(saveData) {
        document.getElementById('btn-start-game').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('DIFFICULTY_SELECT');
        };

        document.getElementById('btn-bazaar').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('BAZAAR');
        };

        document.getElementById('btn-achievements').onclick = () => {
            audioSystem.playClick();
            this.onNavigate('ACHIEVEMENTS');
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
