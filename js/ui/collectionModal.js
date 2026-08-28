/**
 * حارة العفاريت — Harat El Afareet
 * Almanac & Collection Screen (Pure Egyptian Colloquial)
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
                    <button class="btn btn-sm btn-muted" id="btn-col-back">⬅ ارجع ورا</button>
                    <h2 class="screen-title">موسوعة أسرار الحارة والجان</h2>
                    <div style="width: 50px;"></div>
                </div>

                <div class="collection-sections">
                    <div class="col-section">
                        <h3 class="col-section-title">🔮 أسلحة وتعويذات السحرة</h3>
                        <div class="col-grid">
                            <div class="col-entry">
                                <span class="col-icon">🪄</span>
                                <div>
                                    <h4>الخرزانة السحرية</h4>
                                    <p>سلاح أزهري أصيل، بيحدف طلقات ذكية بتطارد الأرواح الشريرة وتفرتكها تلقائياً.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🔥</span>
                                <div>
                                    <h4>ولاعة الجان</h4>
                                    <p>بيشوي عفاريت الحارة بكرات نارية بتنفجر وتشعل العدوى النارية في الحشود.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">⚡</span>
                                <div>
                                    <h4>كهربا الحارة</h4>
                                    <p>بتنزل صواعق ورعود من السما تكهرب وتفرتك عفاريت كتيرة في ثانية واحدة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🧿</span>
                                <div>
                                    <h4>حجاب عين حورس</h4>
                                    <p>تمائم بتلف وتدور زي الخلاط تفرم أي عفريت يتجرأ يقرب من البطل.</p>
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
                                    <h4>عفريت الشعلة</h4>
                                    <p>شبح عفريت فرفور وخفيف، بيهجم في أسراب سريعة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🟢</span>
                                <div>
                                    <h4>عفريت الريح</h4>
                                    <p>جني سريع وبيجري زي الصاروخ يباغتك بضربات خاطفة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🟡</span>
                                <div>
                                    <h4>عفريت القاذف</h4>
                                    <p>بيقف على مسافة بعيدة ويبخ رمال ملعونة تعورك من بعيد.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">💣</span>
                                <div>
                                    <h4>العفريت المتفجر</h4>
                                    <p>يندفع بسرعة نحو البطل ويوصل ويفجر نفسه في انفجار ناري هائل!</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🔮</span>
                                <div>
                                    <h4>ساحر الجان</h4>
                                    <p>كاهن يطلق قذائف لعنة ويمنح العفاريت من حوله هالات سرعة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🦇</span>
                                <div>
                                    <h4>خفاش المقابر</h4>
                                    <p>خفافيش مظلمة تهاجم في أسراب متعرجة سريعة.</p>
                                </div>
                            </div>
                            <div class="col-entry">
                                <span class="col-icon">🪨</span>
                                <div>
                                    <h4>مارد الحارة</h4>
                                    <p>مارد دبش وحجمه تقيل، بيرزع الأرض زلازل وموجات صدمية.</p>
                                </div>
                            </div>
                            <div class="col-entry boss-entry">
                                <span class="col-icon">👑</span>
                                <div>
                                    <h4>سلطان الجان</h4>
                                    <p>الزعيم الكبير.. بيستدعي نيازك ومردة ويولع في الحارة لما يتعصب تحت 50% دم!</p>
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
