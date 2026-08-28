/**
 * حارة العفاريت — Harat El Afareet
 * In-Game Mobile Touch HUD (Fixed Flex Layout & Zero Text Wrapping)
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
                <div class="hud-top-bar">
                    <!-- Clean Level Pill -->
                    <div class="hud-level-badge">
                        <span class="level-icon">💎</span>
                        <span class="level-val" id="hud-player-level">Lv.1</span>
                    </div>

                    <!-- Clean Single-Line HP & XP Bars -->
                    <div class="hud-bars-container">
                        <div class="bar-wrapper hp-bar-wrapper">
                            <div class="bar-fill hp-fill" id="hud-hp-fill" style="width: 100%;"></div>
                            <span class="bar-text" id="hud-hp-text">❤️ 190 / 190</span>
                        </div>

                        <div class="bar-wrapper xp-bar-wrapper">
                            <div class="bar-fill xp-fill" id="hud-xp-fill" style="width: 0%;"></div>
                            <span class="bar-text" id="hud-xp-text">XP: 0 / 20</span>
                        </div>
                    </div>

                    <!-- Meta Group -->
                    <div class="hud-meta-group">
                        <div class="hud-timer" id="hud-timer">00:00</div>
                        <div class="hud-coins">
                            <span>🪙</span>
                            <span id="hud-coins-val">0</span>
                        </div>
                        <button class="hud-btn hud-pause-btn" id="hud-btn-pause" title="إيقاف مؤقت">⏸</button>
                    </div>
                </div>

                <!-- Boss Health Bar -->
                <div class="hud-boss-bar-container" id="hud-boss-container" style="display: none;">
                    <div class="boss-title" id="hud-boss-title">👑 سلطان الجان (ملك العفاريت)</div>
                    <div class="bar-wrapper boss-bar-wrapper">
                        <div class="bar-fill boss-fill" id="hud-boss-fill" style="width: 100%;"></div>
                    </div>
                </div>

                <!-- Bottom Action Controls -->
                <div class="hud-bottom-bar">
                    <div class="hud-weapons-list" id="hud-weapons-list"></div>

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

        // Level Pill
        const lvlElem = document.getElementById('hud-player-level');
        if (lvlElem) lvlElem.textContent = `Lv.${xpSystem.level}`;

        // XP Bar
        const xpFill = document.getElementById('hud-xp-fill');
        const xpText = document.getElementById('hud-xp-text');
        const reqXp = xpSystem.getXpRequired();
        const xpPercent = Math.min(100, Math.round((xpSystem.currentXp / reqXp) * 100));
        if (xpFill) xpFill.style.width = `${xpPercent}%`;
        if (xpText) xpText.textContent = `XP: ${xpSystem.currentXp}/${reqXp} (${xpPercent}%)`;

        // HP Bar
        const hpFill = document.getElementById('hud-hp-fill');
        const hpText = document.getElementById('hud-hp-text');
        const hpPercent = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100)));
        if (hpFill) hpFill.style.width = `${hpPercent}%`;
        if (hpText) hpText.textContent = `❤️ ${Math.round(player.hp)} / ${player.maxHp}`;

        // Timer
        const timerElem = document.getElementById('hud-timer');
        if (timerElem) {
            const mins = Math.floor(waveSystem.runTime / 60).toString().padStart(2, '0');
            const secs = Math.floor(waveSystem.runTime % 60).toString().padStart(2, '0');
            timerElem.textContent = `${mins}:${secs}`;
        }

        // Coins
        const coinsElem = document.getElementById('hud-coins-val');
        if (coinsElem) coinsElem.textContent = xpSystem.runCoins;

        // Dash Cooldown
        const dashOverlay = document.getElementById('hud-dash-cooldown');
        if (dashOverlay) {
            if (player.dashCooldownTimer > 0) {
                const ratio = player.dashCooldownTimer / player.dashCooldown;
                dashOverlay.style.height = `${Math.round(ratio * 100)}%`;
            } else {
                dashOverlay.style.height = '0%';
            }
        }

        // Active Weapons
        const wepList = document.getElementById('hud-weapons-list');
        if (wepList && player.weapons) {
            wepList.innerHTML = player.weapons.map(w => `
                <div class="weapon-slot" title="${w.name}">
                    <span class="weapon-icon">${w.icon}</span>
                    <span class="weapon-lvl">Lv.${w.level}</span>
                </div>
            `).join('');
        }

        // Boss Bar
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
