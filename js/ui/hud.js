/**
 * حارة العفاريت — Harat El Afareet
 * In-Game Mobile Touch HUD
 */

import { inputSystem } from '../systems/inputSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class HUD {
    constructor(container, onPauseClick) {
        this.container = container;
        this.onPauseClick = onPauseClick;
    }

    render() {
        this.container.innerHTML = `
            <div class="game-hud">
                <!-- Top Status Header -->
                <div class="hud-top-bar">
                    <div class="hud-level-badge">
                        <span class="level-label">المستوى</span>
                        <span class="level-val" id="hud-player-level">1</span>
                    </div>

                    <div class="hud-bars-container">
                        <!-- XP Bar -->
                        <div class="bar-wrapper xp-bar-wrapper">
                            <div class="bar-fill xp-fill" id="hud-xp-fill" style="width: 0%;"></div>
                            <span class="bar-text" id="hud-xp-text">XP: 0 / 20</span>
                        </div>

                        <!-- HP Bar -->
                        <div class="bar-wrapper hp-bar-wrapper">
                            <div class="bar-fill hp-fill" id="hud-hp-fill" style="width: 100%;"></div>
                            <span class="bar-text" id="hud-hp-text">HP: 100 / 100</span>
                        </div>
                    </div>

                    <div class="hud-meta-group">
                        <div class="hud-timer" id="hud-timer">00:00</div>
                        <div class="hud-coins">
                            <span>🪙</span>
                            <span id="hud-coins-val">0</span>
                        </div>
                        <button class="hud-btn hud-pause-btn" id="hud-btn-pause">⏸</button>
                    </div>
                </div>

                <!-- Boss Health Bar (Hidden until boss active) -->
                <div class="hud-boss-bar-container" id="hud-boss-container" style="display: none;">
                    <div class="boss-title" id="hud-boss-title">👑 ملك العفاريت (Sultan El-Ghan)</div>
                    <div class="bar-wrapper boss-bar-wrapper">
                        <div class="bar-fill boss-fill" id="hud-boss-fill" style="width: 100%;"></div>
                    </div>
                </div>

                <!-- Bottom Action Controls -->
                <div class="hud-bottom-bar">
                    <!-- Active Weapons Icons -->
                    <div class="hud-weapons-list" id="hud-weapons-list">
                        <!-- Dynamically populated -->
                    </div>

                    <!-- Touch Action Buttons (Dash) -->
                    <div class="hud-action-buttons">
                        <button class="hud-action-btn dash-btn" id="hud-btn-dash">
                            <span class="action-icon">💨</span>
                            <span class="action-label">اندفاع</span>
                            <div class="cooldown-overlay" id="hud-dash-cooldown"></div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const pauseBtn = document.getElementById('hud-btn-pause');
        if (pauseBtn) {
            pauseBtn.onclick = (e) => {
                e.stopPropagation();
                audioSystem.playClick();
                this.onPauseClick();
            };
        }

        const dashBtn = document.getElementById('hud-btn-dash');
        if (dashBtn) {
            dashBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                inputSystem.triggerDash();
            });
            dashBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                inputSystem.triggerDash();
            });
        }
    }

    update(player, xpSystem, waveSystem, boss) {
        if (!player) return;

        // Update Level & XP
        const lvlElem = document.getElementById('hud-player-level');
        if (lvlElem) lvlElem.textContent = xpSystem.level;

        const xpFill = document.getElementById('hud-xp-fill');
        const xpText = document.getElementById('hud-xp-text');
        const reqXp = xpSystem.getXpRequired();
        const xpPercent = Math.min(100, Math.round((xpSystem.currentXp / reqXp) * 100));
        if (xpFill) xpFill.style.width = `${xpPercent}%`;
        if (xpText) xpText.textContent = `XP: ${xpSystem.currentXp} / ${reqXp}`;

        // Update HP
        const hpFill = document.getElementById('hud-hp-fill');
        const hpText = document.getElementById('hud-hp-text');
        const hpPercent = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100)));
        if (hpFill) hpFill.style.width = `${hpPercent}%`;
        if (hpText) hpText.textContent = `HP: ${Math.round(player.hp)} / ${player.maxHp}`;

        // Update Timer
        const timerElem = document.getElementById('hud-timer');
        if (timerElem) {
            const mins = Math.floor(waveSystem.runTime / 60).toString().padStart(2, '0');
            const secs = Math.floor(waveSystem.runTime % 60).toString().padStart(2, '0');
            timerElem.textContent = `${mins}:${secs}`;
        }

        // Update Coins
        const coinsElem = document.getElementById('hud-coins-val');
        if (coinsElem) coinsElem.textContent = xpSystem.runCoins;

        // Update Dash Cooldown
        const dashOverlay = document.getElementById('hud-dash-cooldown');
        if (dashOverlay) {
            if (player.dashCooldownTimer > 0) {
                const ratio = player.dashCooldownTimer / player.dashCooldown;
                dashOverlay.style.height = `${Math.round(ratio * 100)}%`;
            } else {
                dashOverlay.style.height = '0%';
            }
        }

        // Update Weapons List Icons
        const wepList = document.getElementById('hud-weapons-list');
        if (wepList && player.weapons) {
            wepList.innerHTML = player.weapons.map(w => `
                <div class="weapon-slot" title="${w.name}">
                    <span class="weapon-icon">${w.icon}</span>
                    <span class="weapon-lvl">Lv.${w.level}</span>
                </div>
            `).join('');
        }

        // Boss Health Bar
        const bossContainer = document.getElementById('hud-boss-container');
        if (bossContainer) {
            if (boss && boss.alive) {
                bossContainer.style.display = 'block';
                const bossFill = document.getElementById('hud-boss-fill');
                if (bossFill) {
                    const bossHpPercent = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));
                    bossFill.style.width = `${bossHpPercent}%`;
                }
            } else {
                bossContainer.style.display = 'none';
            }
        }
    }
}
