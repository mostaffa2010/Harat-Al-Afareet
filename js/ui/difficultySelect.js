/**
 * حارة العفاريت — Harat El Afareet
 * Dedicated Difficulty Selection Screen (Version 5 Names)
 */

import { DIFFICULTY_MODES } from '../data/constants.js';
import { saveSystem } from '../systems/saveSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class DifficultySelect {
    constructor(container, onConfirmDifficulty, onBack) {
        this.container = container;
        this.onConfirmDifficulty = onConfirmDifficulty;
        this.onBack = onBack;
    }

    render() {
        const currentDiff = saveSystem.data.selectedDifficulty || 'NORMAL';

        this.container.innerHTML = `
            <div class=\"menu-screen difficulty-select-screen\">
                <div class=\"screen-top-bar\">
                    <button class=\"btn btn-sm btn-muted btn-back\" id=\"btn-diff-back\">⬅ ارجع ورا</button>
                    <h2 class=\"screen-title\">مستوى الصعوبة</h2>
                    <div class=\"top-bar-spacer\"></div>
                </div>

                <p class=\"screen-subtitle\">«حدد قوة وجبروت العفاريت اللي هتنزل تواجههم في الحارة»</p>

                <div class=\"difficulty-cards-container\">
                    <!-- 1. Easy Mode: حارة حس حس -->
                    <div class=\"diff-card ${currentDiff === 'EASY' ? 'diff-card-selected' : ''}\" data-diff=\"EASY\">
                        <div class=\"diff-card-header\">
                            <span class=\"diff-emoji\">🟢</span>
                            <div class=\"diff-title-group\">
                                <h3 class=\"diff-card-name\">حارة حس حس</h3>
                                <span class=\"diff-card-tag\">سهل وللتسلية</span>
                            </div>
                        </div>
                        <p class=\"diff-card-desc\">العفاريت ضعيفة وصحتك أعلى وسرعتك سريعة.. مناسب عشان تجرب الأبطال وتلعب بمزاج رايق.</p>
                        <div class=\"diff-card-perks\">
                            <span>❤️ صحة العفاريت: -25%</span>
                            <span>👟 سرعة حركتك: +10%</span>
                        </div>
                    </div>

                    <!-- 2. Normal Mode: حارة هادية -->
                    <div class=\"diff-card ${currentDiff === 'NORMAL' ? 'diff-card-selected' : ''}\" data-diff=\"NORMAL\">
                        <div class=\"diff-card-header\">
                            <span class=\"diff-emoji\">🟡</span>
                            <div class=\"diff-title-group\">
                                <h3 class=\"diff-card-name\">حارة هادية</h3>
                                <span class=\"diff-card-tag\">متوازن وأصيل</span>
                            </div>
                        </div>
                        <p class=\"diff-card-desc\">التجربة الأصلية المضبوطة.. حماس وتحدي وسرعة لعب ممتعة وتدرج وحوش عادل.</p>
                        <div class=\"diff-card-perks\">
                            <span>⚔️ توازن أصلي 100%</span>
                            <span>🪙 مكافأة عملات عادية</span>
                        </div>
                    </div>

                    <!-- 3. Hard Mode: حارة مزعجة جدًا -->
                    <div class=\"diff-card ${currentDiff === 'HARD' ? 'diff-card-selected' : ''}\" data-diff=\"HARD\">
                        <div class=\"diff-card-header\">
                            <span class=\"diff-emoji\">🔴</span>
                            <div class=\"diff-title-group\">
                                <h3 class=\"diff-card-name\">حارة مزعجة جدًا</h3>
                                <span class=\"diff-card-tag\">للمحترفين والفتوات</span>
                            </div>
                        </div>
                        <p class=\"diff-card-desc\">ليلة العفاريت الحمرا! أسراب ضخمة، وحوش شرسة، ولكن جوائز العملات مضاعفة +80%.</p>
                        <div class=\"diff-card-perks\">
                            <span>💀 قوة العفاريت: +45%</span>
                            <span>🪙 مكافأة عملات: +80%</span>
                        </div>
                    </div>
                </div>

                <button class=\"btn btn-primary btn-large btn-glow btn-confirm-wide\" id=\"btn-confirm-diff\">
                    <span>التالي: نقي البطل ⬅</span>
                </button>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-diff-back').onclick = () => {
            audioSystem.playClick();
            this.onBack();
        };

        const diffCards = this.container.querySelectorAll('.diff-card');
        diffCards.forEach(card => {
            card.onclick = () => {
                const diffKey = card.getAttribute('data-diff');
                saveSystem.data.selectedDifficulty = diffKey;
                saveSystem.saveGame();
                audioSystem.playClick();
                this.render();
            };
        });

        document.getElementById('btn-confirm-diff').onclick = () => {
            audioSystem.playClick();
            this.onConfirmDifficulty(saveSystem.data.selectedDifficulty || 'NORMAL');
        };
    }
}
