/**
 * حارة العفاريت — Harat El Afareet
 * In-Game HUD with Responsive Top Bar & Non-Intrusive Stage Pill
 */

import { audioSystem } from '../systems/audioSystem.js';

export class HUD {
    constructor(container, onPauseClick) {
        this.container = container;
        this.onPauseClick = onPauseClick;
        this.lastStageName = '';
        this.stageBannerTimer = 0;
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="game-hud">
                <div class="hud-top-section">
                    <div class="hud-top-bar">
                        <!-- Clean Upward Level Badge -->
                        <div class="hud-level-badge">
                            <span class="level-icon">⚡</span>
                            <span class="level-val" id="hud-player-level">ليفل 1</span>
                        </div>

                        <!-- Clean Single-Line HP & XP Bars (Bidi Protected) -->
                        <div class="hud-bars-container">
                            <div class="bar-wrapper hp-bar-wrapper">
                                <div class="bar-fill hp-fill" id="hud-hp-fill" style="width: 100%;"></div>
                                <span class="bar-text hp-bar-text" id="hud-hp-text">
                                    <span class="bidi-val" id="hud-hp-num">180 / 180</span>
                                    <span>❤️</span>
                                </span>
                            </div>

                            <div class="bar-wrapper xp-bar-wrapper">
                                <div class="bar-fill xp-fill" id="hud-xp-fill" style="width: 0%;"></div>
                                <span class="bar-text xp-bar-text" id="hud-xp-text">
                                    <span>الخبرة:</span>
                                    <span class="bidi-val" id="hud-xp-num">0 / 20 (0%)</span>
                                </span>
                            </div>
                        </div>

                        <!-- Meta Group & Pause Button -->
                        <div class="hud-meta-group">
                            <div class="hud-timer" id="hud-timer">00:00</div>
                            <div class="hud-coins">
                                <span>🪙</span>
                                <span id="hud-coins-val">0</span>
                            </div>
                            <button class="hud-btn hud-pause-btn" id="hud-btn-pause" type="button" aria-label="إيقاف مؤقت">⏸</button>
                        </div>
                    </div>

                    <!-- Stage Announcement Pill (Positioned right below top bar, animated) -->
                    <div class="hud-stage-banner" id="hud-stage-banner">
                        <span class="stage-name-text" id="hud-stage-name">المرحلة 1: حارة السيدة</span>
                    </div>

                    <!-- Boss Health Bar -->
                    <div class="hud-boss-bar-container" id="hud-boss-container" style="display: none;">
                        <div class="boss-title" id="hud-boss-title">👑 سلطان الجان (ملك العفاريت)</div>
                        <div class="bar-wrapper boss-bar-wrapper">
                            <div class="bar-fill boss-fill" id="hud-boss-fill" style="width: 100%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Bar: Active Weapons Only -->
                <div class="hud-bottom-bar">
                    <div class="hud-weapons-list" id="hud-weapons-list"></div>
                    <div></div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const pauseBtn = document.getElementById('hud-btn-pause');
        if (pauseBtn) {
            const handlePause = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                audioSystem.playClick();
                if (typeof this.onPauseClick === 'function') {
                    this.onPauseClick();
                }
            };

            pauseBtn.onclick = handlePause;
            pauseBtn.ontouchstart = handlePause;
        }
    }

    update(player, xpSystem, waveSystem, boss) {
        if (!player) return;

        const lvlElem = document.getElementById('hud-player-level');
        if (lvlElem) lvlElem.textContent = `ليفل ${xpSystem.level}`;

        const xpFill = document.getElementById('hud-xp-fill');
        const xpNum = document.getElementById('hud-xp-num');
        const reqXp = xpSystem.getXpRequired();
        const xpPercent = Math.min(100, Math.round((xpSystem.currentXp / reqXp) * 100));
        if (xpFill) xpFill.style.width = `${xpPercent}%`;
        if (xpNum) xpNum.textContent = `${xpSystem.currentXp} / ${reqXp} (${xpPercent}%)`;

        const hpFill = document.getElementById('hud-hp-fill');
        const hpNum = document.getElementById('hud-hp-num');
        const currentHp = Math.max(0, Math.round(player.hp));
        const maxHp = Math.round(player.maxHp);
        const hpPercent = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));
        if (hpFill) hpFill.style.width = `${hpPercent}%`;
        if (hpNum) hpNum.textContent = `${currentHp} / ${maxHp}`;

        const timerElem = document.getElementById('hud-timer');
        if (timerElem) {
            const mins = Math.floor(waveSystem.runTime / 60).toString().padStart(2, '0');
            const secs = Math.floor(waveSystem.runTime % 60).toString().padStart(2, '0');
            timerElem.textContent = `${mins}:${secs}`;
        }

        const stageElem = document.getElementById('hud-stage-name');
        const stageBanner = document.getElementById('hud-stage-banner');
        if (stageElem && waveSystem.getCurrentStageName) {
            const curStage = waveSystem.getCurrentStageName();
            if (curStage !== this.lastStageName) {
                this.lastStageName = curStage;
                stageElem.textContent = curStage;
                if (stageBanner) {
                    stageBanner.style.opacity = '1';
                    stageBanner.style.transform = 'translateY(0) scale(1)';
                    // Fade out after 4 seconds
                    setTimeout(() => {
                        if (stageBanner) {
                            stageBanner.style.opacity = '0';
                            stageBanner.style.transform = 'translateY(-6px) scale(0.95)';
                        }
                    }, 4000);
                }
            }
        }

        const coinsElem = document.getElementById('hud-coins-val');
        if (coinsElem) coinsElem.textContent = xpSystem.runCoins;

        const wepList = document.getElementById('hud-weapons-list');
        if (wepList && player.weapons) {
            wepList.innerHTML = player.weapons.map(w => {
                const isMax = w.level >= w.maxLevel;
                return `
                    <div class="weapon-slot ${isMax ? 'weapon-slot-evolved' : ''}" title="${w.name}">
                        <span class="weapon-icon">${w.icon}</span>
                        <span class="weapon-lvl">${isMax ? '⭐ أقصى قوة' : `مستوى ${w.level}`}</span>
                    </div>
                `;
            }).join('');
        }

        const bossContainer = document.getElementById('hud-boss-container');
        if (bossContainer) {
            if (boss && boss.alive) {
                bossContainer.style.display = 'block';
                const bossTitle = document.getElementById('hud-boss-title');
                if (bossTitle && boss.enemyName) {
                    bossTitle.textContent = boss.enemyName;
                }
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
