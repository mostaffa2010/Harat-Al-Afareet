/**
 * حارة العفاريت — Harat El Afareet
 * Level-Up Modal (Clear 3-Category Distinct Badges & Framing)
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
                        <span class="radiant-star">⭐✨</span>
                        <h2 class="level-up-title">ارتقاء يا برنس!</h2>
                        <p class="level-up-sub">نقي تعويذة أو ميزة تظبط أداءك وتفرتك العفاريت</p>
                    </div>

                    <div class="upgrade-cards-grid">
                        ${cards.map((card, index) => `
                            <div class="upgrade-card interactive card-type-${card.type}" data-index="${index}" style="--card-glow: ${card.rarity.glow}; --card-color: ${card.categoryColor || card.rarity.color};">
                                <div class="card-top-badges">
                                    <span class="card-category-badge" style="background: ${card.categoryColor}; color: #fff;">
                                        ${card.categoryBadge || '🛡️ ميزة للبطل'}
                                    </span>
                                    <span class="card-rarity-badge" style="background: ${card.rarity.color}; color: #0f172a;">
                                        ${card.rarity.name}
                                    </span>
                                </div>

                                <div class="card-main-content">
                                    <div class="card-icon-frame" style="border-color: ${card.categoryColor}">
                                        <span class="card-icon">${card.icon}</span>
                                    </div>
                                    <div class="card-text-group">
                                        <h3 class="card-title">${card.name}</h3>
                                        <p class="card-desc">${card.description}</p>
                                    </div>
                                </div>

                                <div class="card-footer">
                                    <span class="card-category-sub">${card.categoryName || 'ميزة للبطل'}</span>
                                    <span class="card-level">مستوى ${card.level}/${card.maxLevel}</span>
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
