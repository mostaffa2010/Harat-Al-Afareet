/**
 * حارة العفاريت — Harat El Afareet
 * Bazaar (سوق العطارين والبركات الدائمة)
 */

import { PERMANENT_UPGRADES } from '../data/defaultData.js';
import { saveSystem } from '../systems/saveSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class BazaarModal {
    constructor(container, onBack) {
        this.container = container;
        this.onBack = onBack;
    }

    render() {
        const data = saveSystem.data;

        this.container.innerHTML = `
            <div class="menu-screen bazaar-screen">
                <div class="screen-top-bar">
                    <button class="btn btn-sm btn-muted btn-back" id="btn-bazaar-back">⬅ ارجع ورا</button>
                    <h2 class="screen-title">سوق العطارين</h2>
                    <div class="gold-badge-small">
                        <span>🪙</span>
                        <span id="bazaar-gold-amount">${data.coins}</span>
                    </div>
                </div>

                <p class="screen-subtitle">«شخلل جيبك بالعملات الأثرية وطور صحتك وضرر أبطالك عشان الجولات الجاية»</p>

                <div class="bazaar-items-grid">
                    ${PERMANENT_UPGRADES.map(item => {
                        const currentLvl = data.permanentUpgrades[item.id] || 0;
                        const isMax = currentLvl >= item.maxLevel;
                        const cost = Math.round(item.baseCost * Math.pow(item.costMultiplier, currentLvl));
                        const canAfford = !isMax && data.coins >= cost;

                        return `
                            <div class="bazaar-card ${isMax ? 'card-maxed' : ''}">
                                <div class="bazaar-card-header">
                                    <span class="bazaar-icon">${item.icon}</span>
                                    <div class="bazaar-title-group">
                                        <h4 class="bazaar-item-name">${item.name}</h4>
                                        <span class="bazaar-item-lvl">مستوى: ${currentLvl} / ${item.maxLevel}</span>
                                    </div>
                                </div>

                                <p class="bazaar-item-desc">${item.description}</p>

                                <div class="bazaar-card-footer">
                                    ${isMax ? `
                                        <span class="badge-max">متقفل ع الآخر ✨</span>
                                    ` : `
                                        <button class="btn btn-sm ${canAfford ? 'btn-gold' : 'btn-disabled'} btn-buy-upgrade" data-id="${item.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''}>
                                            <span>اشترِ البركة (🪙 ${cost})</span>
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-bazaar-back').onclick = () => {
            audioSystem.playClick();
            this.onBack();
        };

        const buyButtons = this.container.querySelectorAll('.btn-buy-upgrade');
        buyButtons.forEach(btn => {
            btn.onclick = () => {
                const upgradeId = btn.getAttribute('data-id');
                const cost = parseInt(btn.getAttribute('data-cost'), 10);

                if (saveSystem.upgradePermanentStat(upgradeId, cost)) {
                    audioSystem.playPickupCoin();
                    this.render();
                }
            };
        });
    }
}
