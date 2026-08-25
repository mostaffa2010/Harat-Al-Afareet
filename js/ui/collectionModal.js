/**
 * حارة العفاريت — Harat El Afareet
 * Almanac & Collection Screen
 */

import { audioSystem } from '../systems/audioSystem.js';

export class CollectionModal {
    constructor(container, onBack) {
        this.container = container;
        this.onBack = onBack;
    }

    render() {
        this.container.innerHTML = `
            <div class="menu-screen collection-screen">
                <div class="screen-top-bar">
                    <button class="btn btn-sm btn-muted" id="btn-col-back">⬅ العودة</button>
                    <h2 class="screen-title">موسوعة أسرار الحارة</h2>
                    <div style="width: 50px;"></div>
                </div>

                <div class="collection-sections">
                    <div class="col-section">
                        <h3 class="col-section-title">🔮 أسلحة السحرة</h3>
                        <div class="col-grid">
                            <div class="col-entry">
                                <span class="col-icon">🪄</span>
                                <div>
                                    <h4>عصا الحكمة (Magic Staff)</h4>
                                    <p>سلاح الأزهريين القدماء، يطلق طلقات ذكية تطارد الأرواح الشريرة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🔥</span>
                                <div>
                                    <h4>صولجان اللهب (Fire Wand)</h4>
                                    <p>يحرق عفاريت الحارة بكرات نارية تنفجر وتشعل العدوى.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">⚡</span>
                                <div>
                                    <h4>صاعقة السماء (Lightning Rod)</h4>
                                    <p>تستدعي البرق والصواعق من غيوم الإسكندرية لضرب الحشود.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🧿</span>
                                <div>
                                    <h4>تمائم الحماية (Magical Talisman)</h4>
                                    <p>تمائم عين حورس تدور كدرع فتاك يمزق كل من يقترب من الساحر.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-section">
                        <h3 class="col-section-title">👹 سجل العفاريت والمردة</h3>
                        <div class="col-grid">
                            <div class="col-entry">
                                <span class="col-icon">🟣</span>
                                <div>
                                    <h4>عفريت الشعلة (Shadow Wisp)</h4>
                                    <p>روح شريرة خفيفة تهاجم في أسراب وسرعات متزايدة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🟢</span>
                                <div>
                                    <h4>عفريت الريح (Djinn Stalker)</h4>
                                    <p>جني سريع يندفع فجأة نحو البطل لباغته بالضربات.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🟡</span>
                                <div>
                                    <h4>عفريت القاذف (Sand Spitter)</h4>
                                    <p>يقف على مسافة ويقذف رمالاً ملعونة تصيب الأبطال عن بعد.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🪨</span>
                                <div>
                                    <h4>مارد الحارة (Alley Brute)</h4>
                                    <p>مارد صخري ضخم يحدث زلازل وموجات صدمة تزلزل الأرض.</p>
                                </div>
                            </div>
                            <div class="col-entry boss-entry">
                                <span class="col-icon">👑</span>
                                <div>
                                    <h4>ملك العفاريت (Sultan El-Ghan)</h4>
                                    <p>سلطان الجان الأعظم. يمتلك عدة أطوار قتالية ويستدعي النيازك والمردة.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-col-back').onclick = () => {
            audioSystem.playClick();
            this.onBack();
        };
    }
}
