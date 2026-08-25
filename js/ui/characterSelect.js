/**
 * حارة العفاريت — Harat El Afareet
 * Character Selection Screen
 */

import { characterRegistry } from '../characters/characterRegistry.js';
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
        const isUnlocked = true;

        this.container.innerHTML = `
            <div class="menu-screen char-select-screen">
                <div class="screen-top-bar">
                    <button class="btn btn-sm btn-muted" id="btn-char-back">⬅ العودة</button>
                    <h2 class="screen-title">اختر بطل المعركة</h2>
                    <div style="width: 50px;"></div>
                </div>

                <div class="char-display-card" style="--char-primary: ${char.themePrimary}; --char-secondary: ${char.themeSecondary};">
                    <div class="char-art-container" id="char-art-slot">
                        <!-- Canvas illustration drawn here -->
                    </div>

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
                            <span class="detail-label">القدرة الخاصة:</span>
                            <span class="detail-val" style="color: ${char.themeSecondary}">${char.passive.name}</span>
                            <p class="detail-sub">${char.passive.description}</p>
                        </div>

                        <div class="detail-box">
                            <span class="detail-label">السلاح المبدئي:</span>
                            <span class="detail-val">${this.getWeaponName(char.startingWeaponId)}</span>
                        </div>

                        <div class="detail-box">
                            <span class="detail-label">ألوان البطل:</span>
                            <div class="theme-colors">
                                <span class="color-swatch" style="background: ${char.themePrimary}"></span>
                                <span class="color-swatch" style="background: ${char.themeSecondary}"></span>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary btn-large btn-glow" id="btn-play-selected" style="border-color: ${char.themePrimary}; box-shadow: 0 0 15px ${char.themePrimary}">
                        <span>⚔️ بدء المعركة بهذا البطل</span>
                    </button>
                </div>
            </div>
        `;

        // Render the large pixel-art illustration canvas
        const artSlot = document.getElementById('char-art-slot');
        const illCanvas = assetManager.getIllustration(char.id);
        if (illCanvas) {
            artSlot.appendChild(illCanvas);
        }

        this.bindEvents();
    }

    getWeaponName(weaponId) {
        const names = {
            magicStaff: '🪄 عصا الحكمة',
            fireWand: '🔥 صولجان اللهب',
            lightningRod: '⚡ صاعقة السماء',
            magicalTalisman: '🧿 تمائم الحماية'
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
