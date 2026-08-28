/**
 * حارة العفاريت — Harat El Afareet
 * Achievements Screen & Trophies
 */

import { achievementSystem } from '../systems/achievementSystem.js';
import { audioSystem } from '../systems/audioSystem.js';
import { saveSystem } from '../systems/saveSystem.js';

export class AchievementsModal {
    constructor(container, onBack) {
        this.container = container;
        this.onBack = onBack;
    }

    render() {
        const list = achievementSystem.getAll();

        this.container.innerHTML = `
            <div class="menu-screen achievements-screen">
                <div class="screen-top-bar">
                    <button class="btn btn-sm btn-muted btn-back" id="btn-ach-back">⬅ ارجع ورا</button>
                    <h2 class="screen-title">إنجازات الحارة</h2>
                    <div class="gold-badge-small">
                        <span>🪙</span>
                        <span>${saveSystem.data.coins}</span>
                    </div>
                </div>

                <p class="screen-subtitle">«حقق الإنجازات في المعارك واستلم جوائز عملات ذهبية ضخمة!»</p>

                <div class="achievements-list-grid">
                    ${list.map(ach => `
                        <div class="achievement-card ${ach.isCompleted ? 'ach-done' : ''} ${ach.isClaimed ? 'ach-claimed' : ''}">
                            <div class="ach-header">
                                <span class="ach-icon">${ach.icon}</span>
                                <div class="ach-info">
                                    <h4 class="ach-name">${ach.name}</h4>
                                    <p class="ach-desc">${ach.description}</p>
                                </div>
                            </div>

                            <div class="ach-progress-bar">
                                <div class="ach-progress-fill" style="width: ${Math.min(100, Math.round((ach.currentValue / ach.target) * 100))}%;"></div>
                                <span class="ach-progress-text">${ach.currentValue} / ${ach.target}</span>
                            </div>

                            <div class="ach-footer">
                                <span class="ach-reward">جائزة: 🪙 ${ach.rewardCoins}</span>
                                ${ach.isClaimed ? `
                                    <span class="badge-claimed">تم الاستلام ✔</span>
                                ` : (ach.isCompleted ? `
                                    <button class="btn btn-sm btn-gold btn-claim-ach" data-id="${ach.id}">
                                        <span>استلم المكافأة! ✨</span>
                                    </button>
                                ` : `
                                    <span class="badge-locked">قيد التقدم ⏳</span>
                                `)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-ach-back').onclick = () => {
            audioSystem.playClick();
            this.onBack();
        };

        const claimButtons = this.container.querySelectorAll('.btn-claim-ach');
        claimButtons.forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                if (achievementSystem.claimReward(id)) {
                    this.render();
                }
            };
        });
    }
}
