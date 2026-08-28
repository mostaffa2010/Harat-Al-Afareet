/**
 * حارة العفاريت — Harat El Afareet
 * Character Selection Screen (256x256 Artwork, No Circle, No Color Swatches)
 */

import { characterRegistry } from '../characters/characterRegistry.js';
import { DIFFICULTY_MODES } from '../data/constants.js';
import { assetManager } from '../core/assetManager.js';
import { audioSystem } from '../systems/audioSystem.js';
import { saveSystem } from '../systems/saveSystem.js';

export class CharacterSelect {
    constructor(container, onSelectAndPlay, onBack) {
        this.container = container;
        this.onSelectAndPlay = onSelectAndPlay;
        this.onBack = onBack;
        this.characters = characterRegistry.getAll();
        this.currentIndex = 0;
    }

    render() {
        const char = this.characters[this.currentIndex];
        const diffKey = saveSystem.data.selectedDifficulty || 'NORMAL';
        const diffObj = DIFFICULTY_MODES[diffKey] || DIFFICULTY_MODES.NORMAL;

        this.container.innerHTML = `
            <div class="menu-screen char-select-screen">
                <div class="screen-top-bar">
                    <button class="btn btn-sm btn-muted btn-back" id="btn-char-back">⬅ ارجع ورا</button>
                    <h2 class="screen-title">نقي بطل المعركة</h2>
                    <span class="diff-badge-active">${diffObj.badge}</span>
                </div>

                <div class="char-display-card" style="--char-primary: ${char.themePrimary}; --char-secondary: ${char.themeSecondary};">
                    <!-- 256x256 Clean Art Frame (No Circle) -->
                    <div class="char-art-container-256" id="char-art-slot"></div>

                    <div class="char-carousel-nav">
                        <button class="btn-arrow" id="btn-prev-char">❮</button>
                        <div class="char-name-badge">
                            <h3 class="char-name" style="color: ${char.themePrimary}">${char.name}</h3>
                            <span class="char-title">${char.title}</span>
                        </div>
                        <button class="btn-arrow" id="btn-next-char">❯</button>
                    </div>

                    <p class="char-desc">${char.description}</p>

                    <div class="char-details-grid">
                        <div class="detail-box">
                            <span class="detail-label">ميزة البطل السحرية:</span>
                            <span class="detail-val" style="color: ${char.themeSecondary}">${char.passive.name}</span>
                            <p class="detail-sub">${char.passive.description}</p>
                        </div>

                        <div class="detail-box">
                            <span class="detail-label">السلاح الأساسي:</span>
                            <span class="detail-val">${this.getWeaponName(char.startingWeaponId)}</span>
                        </div>
                    </div>

                    <button class="btn btn-primary btn-large btn-glow btn-confirm-wide" id="btn-play-selected" style="border-color: ${char.themePrimary}; box-shadow: 0 0 16px ${char.themePrimary}">
                        <span>⚔️ انزل الحارة بهذا البطل (${diffObj.badge})</span>
                    </button>
                </div>
            </div>
        `;

        const artSlot = document.getElementById('char-art-slot');
        const illCanvas = assetManager.getIllustration(char.id);
        if (artSlot && illCanvas) {
            artSlot.appendChild(illCanvas);
        }

        this.bindEvents();
    }

    getWeaponName(weaponId) {
        const names = {
            magicStaff: '🪄 الخرزانة السحرية',
            fireWand: '🔥 ولاعة الجان',
            lightningRod: '⚡ كهربا الحارة',
            magicalTalisman: '🧿 حجاب عين حورس'
        };
        return names[weaponId] || weaponId;
    }

    bindEvents() {
        document.getElementById('btn-char-back').onclick = () => {
            audioSystem.playClick();
            this.onBack();
        };

        document.getElementById('btn-prev-char').onclick = () => {
            audioSystem.playClick();
            this.currentIndex = (this.currentIndex - 1 + this.characters.length) % this.characters.length;
            this.render();
        };

        document.getElementById('btn-next-char').onclick = () => {
            audioSystem.playClick();
            this.currentIndex = (this.currentIndex + 1) % this.characters.length;
            this.render();
        };

        document.getElementById('btn-play-selected').onclick = () => {
            audioSystem.playClick();
            const chosenChar = this.characters[this.currentIndex];
            saveSystem.setSelectedCharacter(chosenChar.id);
            this.onSelectAndPlay(chosenChar);
        };
    }
}
