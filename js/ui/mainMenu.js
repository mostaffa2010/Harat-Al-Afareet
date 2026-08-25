/**
 * حارة العفاريت — Harat El Afareet
 * Main Menu Screen (with Difficulty Mode Selector)
 */

import { DIFFICULTY_MODES } from '../data/constants.js';
import { saveSystem } from '../systems/saveSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class MainMenu {
    constructor(container, onNavigate) {
        this.container = container;
        this.onNavigate = onNavigate;
    }

    render(saveData) {
        const currentDiff = saveData.selectedDifficulty || 'NORMAL';

        this.container.innerHTML = `
            <div class="menu-screen main-menu-bg">
                <div class="menu-header">
                    <div class="ancient-symbol">𓂀</div>
                    <h1 class="game-title">حارة العفاريت</h1>
                    <h2 class="game-subtitle">Harat El Afareet</h2>
                    <p class="game-tagline">«سحر الفراعنة وجان الحارة في معركة ملحمية.. وريهم العين الحمرا!»</p>
                </div>

                <!-- Difficulty Mode Selector -->
                <div class="difficulty-picker-card">
                    <span class="diff-title">مستوى الصعوبة:</span>
                    <div class="diff-buttons-group">
                        <button class="diff-btn ${currentDiff === 'EASY' ? 'active-diff' : ''}" data-diff="EASY">
                            🟢 سهل
                        </button>
                        <button class="diff-btn ${currentDiff === 'NORMAL' ? 'active-diff' : ''}" data-diff="NORMAL">
                            🟡 متوازن
                        </button>
                        <button class="diff-btn ${currentDiff === 'HARD' ? 'active-diff' : ''}" data-diff="HARD">
                            🔴 كابوس
                        </button>
                    </div>
                    <p class="diff-desc">${DIFFICULTY_MODES[currentDiff].description}</p>
                </div>

                <div class="gold-badge">
                    <span>🪙 جيبك فيه:</span>
                    <span class="gold-amount">${saveData.coins || 0} عملة أثرية</span>
                </div>

                <div class="menu-buttons">
                    <button class="btn btn-primary btn-large btn-glow" id="btn-start-game">
                        <span class="btn-icon">⚔️</span>
                        <span>انزل الحارة وحارب (PLAY)</span>
                    </button>

                    <button class="btn btn-gold" id="btn-char-select">
                        <span class="btn-icon">🧙‍♂️</span>
                        <span>أبطال الحارة (Characters)</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-bazaar">
                        <span class="btn-icon">🏺</span>
                        <span>سوق العطارين (Bazaar)</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-achievements">
                        <span class="btn-icon">🏆</span>
                        <span>إنجازات وجوائز (Trophies)</span>
                    </button>

                    <button class="btn btn-secondary" id="btn-collection">
                        <span class="btn-icon">📜</span>
                        <span>موسوعة أسرار الجان (Lore)</span>
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
        // Difficulty Mode Toggle
        const diffBtns = this.container.querySelectorAll('.diff-btn');
        diffBtns.forEach(btn => {
            btn.onclick = () => {
                const diffKey = btn.getAttribute('data-diff');
                saveData.selectedDifficulty = diffKey;
                saveSystem.saveGame();
                audioSystem.playClick();
                this.render(saveData);
            };
        });

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
