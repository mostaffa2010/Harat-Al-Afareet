/**
 * حارة العفاريت — Harat El Afareet
 * Pause Menu Screen with Complete Run Stats & Active Weapons Breakdown
 */

import { audioSystem } from '../systems/audioSystem.js';

export class PauseMenu {
    constructor(container, onResume, onRestart, onQuit) {
        this.container = container;
        this.onResume = onResume;
        this.onRestart = onRestart;
        this.onQuit = onQuit;
    }

    render(player, xpSystem, waveSystem, runStats = {}) {
        const time = (waveSystem && waveSystem.runTime !== undefined) ? waveSystem.runTime : 0;
        const mins = Math.floor(time / 60).toString().padStart(2, '0');
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        const lvl = (xpSystem && xpSystem.level !== undefined) ? xpSystem.level : 1;
        const coins = (xpSystem && xpSystem.runCoins !== undefined) ? xpSystem.runCoins : 0;
        const charName = (player && player.characterName) ? player.characterName : 'البطل';
        const charColor = (player && player.themePrimary) ? player.themePrimary : '#fbbf24';
        const enemiesKilled = runStats.enemiesDefeated || 0;

        const weaponsList = (player && player.weapons) ? player.weapons.map(w => `
            <div class="pause-weapon-pill">
                <span>${w.icon}</span>
                <span>${w.name} (مستوى ${w.level}/${w.maxLevel})</span>
            </div>
        `).join('') : '<p class="text-muted">مفيش أسلحة</p>';

        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-dialog pause-dialog">
                    <h2 class="dialog-title">⏸ مريح شوية</h2>
                    <p class="dialog-sub">خد نفسك.. العفاريت مستنياك ترجع تدوس وتفرتكهم!</p>

                    <div class="pause-stats-card">
                        <div class="stat-row">
                            <span>البطل المحارب:</span>
                            <span class="stat-val" style="color: ${charColor}">${charName}</span>
                        </div>
                        <div class="stat-row">
                            <span>وقت الصمود في الحارة:</span>
                            <span class="stat-val highlight">${mins}:${secs} / 10:00</span>
                        </div>
                        <div class="stat-row">
                            <span>المستوى الحالي:</span>
                            <span class="stat-val highlight">⭐ ليفل ${lvl}</span>
                        </div>
                        <div class="stat-row">
                            <span>عفاريت مفرتكة:</span>
                            <span class="stat-val text-gold">💀 ${enemiesKilled}</span>
                        </div>
                        <div class="stat-row">
                            <span>العملات المجمعة:</span>
                            <span class="stat-val text-gold">🪙 +${coins}</span>
                        </div>

                        <div class="pause-weapons-section">
                            <span class="detail-label">العتاد والأسلحة النشطة:</span>
                            <div class="pause-weapons-grid">
                                ${weaponsList}
                            </div>
                        </div>
                    </div>

                    <div class="dialog-buttons">
                        <button class="btn btn-primary btn-large btn-glow" id="btn-pause-resume">
                            <span>⚔️ كمل المعركة</span>
                        </button>
                        <button class="btn btn-secondary" id="btn-pause-restart">
                            <span>🔄 إعادة المحاولة</span>
                        </button>
                        <button class="btn btn-muted" id="btn-pause-quit">
                            <span>🏠 القائمة الرئيسية</span>
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
