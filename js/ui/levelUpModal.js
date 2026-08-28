/**
 * حارة العفاريت — Harat El Afareet
 * Level-Up Modal (Distinct Card Categories & 5 Egyptian Tiers)
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
                        <p class="level-up-sub">نقي تعويذة أو سلاح يظبط أداءك وتفرتك العفاريت</p>
                    </div>

                    <div class="upgrade-cards-grid">
                        ${cards.map((card, index) => {
                            const tier = card.tier || { name: 'على قد الإيد', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.45)' };
                            return `
                                <div class="upgrade-card interactive card-type-${card.type}" data-index="${index}" style="--card-rarity-color: ${tier.color}; --card-rarity-glow: ${tier.glow};">
                                    <div class="card-top-badges">
                                        <span class="card-category-badge" style="background: ${card.categoryColor || '#475569'};">
                                            ${card.categoryTag || '[ميزة بطل]'} ${card.categoryBadge || ''}
                                        </span>
                                        <span class="card-rarity-badge" style="background: ${tier.color}; color: #0f172a; font-weight: bold;">
                                            المستوى ${card.level}: ${tier.name}
                                        </span>
                                    </div>

                                    <div class="card-main-content">
                                        <div class="card-icon-frame" style="border-color: ${tier.color};">
                                            <span class="card-icon">${card.icon}</span>
                                        </div>
                                        <div class="card-text-group">
                                            <h3 class="card-title" style="color: ${tier.color};">${card.name}</h3>
                                            <p class="card-desc">${card.description}</p>
                                        </div>
                                    </div>

                                    <div class="card-footer">
                                        <span class="card-category-sub">${card.categoryTag || '[ميزة بطل]'}</span>
                                        <span class="card-level" style="color: ${tier.color}; font-weight: bold;">مستوى ${card.level}/5</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
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
