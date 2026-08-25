/**
 * حارة العفاريت — Harat El Afareet
 * Level-Up Card Selection Modal
 */

import { audioSystem } from '../systems/audioSystem.js';

export class LevelUpModal {
    constructor(container, onSelectUpgrade) {
        this.container = container;
        this.onSelectUpgrade = onSelectUpgrade;
    }

    render(cards) {
        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="level-up-dialog">
                    <div class="level-up-header">
                        <span class="radiant-star">✨</span>
                        <h2 class="level-up-title">ارتقاء المستوى! (LEVEL UP)</h2>
                        <p class="level-up-sub">اختر بركة أو تعويذة لتعزيز قوتك في الحارة</p>
                    </div>

                    <div class="upgrade-cards-grid">
                        ${cards.map((card, index) => `
                            <div class="upgrade-card interactive" data-index="${index}" style="--card-glow: ${card.rarity.glow}; --card-color: ${card.rarity.color};">
                                <div class="card-rarity-badge" style="background: ${card.rarity.color}">${card.rarity.name}</div>
                                <div class="card-icon-frame" style="border-color: ${card.themeColor || card.rarity.color}">
                                    <span class="card-icon">${card.icon}</span>
                                </div>
                                <h3 class="card-title">${card.name}</h3>
                                <p class="card-desc">${card.description}</p>
                                <div class="card-footer">
                                    <span class="card-type-tag">${card.type === 'NEW_WEAPON' ? 'سلاح جديد' : (card.type === 'WEAPON_UPGRADE' ? 'ترقية سلاح' : 'ميزة عامة')}</span>
                                    <span class="card-level">Lv. ${card.level}/${card.maxLevel}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(cards);
    }

    bindEvents(cards) {
        const cardElements = this.container.querySelectorAll('.upgrade-card');
        cardElements.forEach(elem => {
            elem.onclick = () => {
                const idx = parseInt(elem.getAttribute('data-index'), 10);
                const selectedCard = cards[idx];
                audioSystem.playClick();
                this.onSelectUpgrade(selectedCard);
            };
        });
    }
}
