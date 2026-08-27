/**
 * حارة العفاريت — Harat El Afareet
 * Dedicated Difficulty Selection Screen
 */

import { DIFFICULTY_MODES } from '../data/constants.js';
import { saveSystem } from '../systems/saveSystem.js';
import { audioSystem } from '../systems/audioSystem.js';

export class DifficultySelect {
    constructor(container, onSelectDifficulty, onBack) {
        this.container = container;
        this.onSelectDifficulty = onSelectDifficulty;
        this.onBack = onBack;
    }

    render() {
        const currentDiff = saveSystem.data.selectedDifficulty || 'NORMAL';

        this.container.innerHTML = `
            <div class="menu-screen diff-select-screen">
                <div class="screen-top-bar">
                    <button class="btn btn-sm btn-muted" id="btn-diff-back">⬅ ارجع ورا</button>
                    <h2 class="screen-title">اختر مستوى الصعوبة</h2>
                    <div style="width: 50px;"></div>
                </div>

                <p class="diff-page-sub">«حدد التحدي اللي يناسبك قبل ما تختار بطل الحارة»</p>

                <div class="difficulty-cards-container">
                    <!-- 1. Easy Mode -->
                    <div class="diff-choice-card ${currentDiff === 'EASY' ? 'diff-card-active' : ''}" data-diff="EASY">
                        <div class="diff-card-header">
                            <span class="diff-emoji">🟢</span>
                            <div class="diff-header-text">
                                <h3 class="diff-mode-name">مستوى عبيط</h3>
                                <span class="diff-mode-tag">للتسلية والتجربة</span>
                            </div>
                        </div>
                        <p class="diff-mode-desc">مناسب للي عايز يتمشى في الحارة براحته.. العفاريت على قد حالها وضرباتها خفيفة وصحتك وسرعتك عالية.</p>
                        <div class="diff-card-stats">
                            <span>صحة العفاريت: 75%</span>
                            <span>سرعتك: +10%</span>
                        </div>
                    </div>

                    <!-- 2. Normal Mode -->
                    <div class="diff-choice-card ${currentDiff === 'NORMAL' ? 'diff-card-active' : ''}" data-diff="NORMAL">
                        <div class="diff-card-header">
                            <span class="diff-emoji">🟡</span>
                            <div class="diff-header-text">
                                <h3 class="diff-mode-name">عادي</h3>
                                <span class="diff-mode-tag">المعركة المظبوطة</span>
                            </div>
                        </div>
                        <p class="diff-mode-desc">المعركة المتوازنة للجدعان.. حماس وتحدي وسرعة لعب ممتعة وتدرج ممتاز مع الوقت.</p>
                        <div class="diff-card-stats">
                            <span>الصعوبة: 100% قياسية</span>
                            <span>المكافآت: متوازنة</span>
                        </div>
                    </div>

                    <!-- 3. Hard Mode -->
                    <div class="diff-choice-card ${currentDiff === 'HARD' ? 'diff-card-active' : ''}" data-diff="HARD">
                        <div class="diff-card-header">
                            <span class="diff-emoji">🔴</span>
                            <div class="diff-header-text">
                                <h3 class="diff-mode-name">كابوس</h3>
                                <span class="diff-mode-tag">للمعلمين والوحوش</span>
                            </div>
                        </div>
                        <p class="diff-mode-desc">أمواج عفاريت متوحشة وسريعة وأعداد جبارة! في المقابل بتكسب فلوس وجوايز مضاعفة +80%.</p>
                        <div class="diff-card-stats">
                            <span>الصعوبة: +45%</span>
                            <span>الفلوس: +80% مكافأة</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-diff-back').onclick = () => {
            audioSystem.playClick();
            this.onBack();
        };

        const cards = this.container.querySelectorAll('.diff-choice-card');
        cards.forEach(card => {
            card.onclick = () => {
                const diffKey = card.getAttribute('data-diff');
                saveSystem.data.selectedDifficulty = diffKey;
                saveSystem.saveGame();
                audioSystem.playClick();
                this.onSelectDifficulty(diffKey);
            };
        });
    }
}
