const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\Dhruv\\OneDrive\\Consultancy\\PF Mitra\\PF_Mitra_Website';

// Define target files
const indexFile = path.join(projectDir, 'index.html');
const guideFile = path.join(projectDir, 'guide.html');

const switcherHtml = `
        <!-- Language Switcher -->
        <div class="flex items-center bg-surface-container border border-surface-variant/40 rounded-full p-0.5">
            <button id="lang-en" class="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all bg-primary text-on-primary">English</button>
            <button id="lang-hi" class="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all text-on-surface-variant">हिंदी</button>
        </div>
`;

const jsLogic = `
    <script>
        // Language Switcher Logic
        (function() {
            const btnEn = document.getElementById('lang-en');
            const btnHi = document.getElementById('lang-hi');

            function setLanguage(lang) {
                if (lang === 'hi') {
                    if (btnHi) {
                        btnHi.classList.add('bg-primary', 'text-on-primary');
                        btnHi.classList.remove('text-on-surface-variant');
                    }
                    if (btnEn) {
                        btnEn.classList.add('text-on-surface-variant');
                        btnEn.classList.remove('bg-primary', 'text-on-primary');
                    }
                    
                    document.querySelectorAll('[data-hi]').forEach(el => {
                        if (!el.dataset.enText) {
                            el.dataset.enText = el.innerHTML;
                        }
                        el.innerHTML = el.getAttribute('data-hi');
                    });
                } else {
                    if (btnEn) {
                        btnEn.classList.add('bg-primary', 'text-on-primary');
                        btnEn.classList.remove('text-on-surface-variant');
                    }
                    if (btnHi) {
                        btnHi.classList.add('text-on-surface-variant');
                        btnHi.classList.remove('bg-primary', 'text-on-primary');
                    }
                    
                    document.querySelectorAll('[data-hi]').forEach(el => {
                        if (el.dataset.enText) {
                            el.innerHTML = el.dataset.enText;
                        }
                    });
                }
                localStorage.setItem('preferred-lang', lang);
                // Also dispatch custom event in case multiple switchers exist
                window.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
            }

            if (btnEn && btnHi) {
                btnEn.addEventListener('click', () => setLanguage('en'));
                btnHi.addEventListener('click', () => setLanguage('hi'));
                
                // Load preference
                const savedLang = localStorage.getItem('preferred-lang') || 'en';
                // Small delay to ensure other components render
                setTimeout(() => setLanguage(savedLang), 50);
            }

            // Sync language across windows/tabs
            window.addEventListener('storage', (e) => {
                if (e.key === 'preferred-lang') {
                    setLanguage(e.newValue);
                }
            });
            window.addEventListener('langChanged', (e) => {
                const lang = e.detail;
                if (lang === 'hi') {
                    if (btnHi) {
                        btnHi.classList.add('bg-primary', 'text-on-primary');
                        btnHi.classList.remove('text-on-surface-variant');
                    }
                    if (btnEn) {
                        btnEn.classList.add('text-on-surface-variant');
                        btnEn.classList.remove('bg-primary', 'text-on-primary');
                    }
                } else {
                    if (btnEn) {
                        btnEn.classList.add('bg-primary', 'text-on-primary');
                        btnEn.classList.remove('text-on-surface-variant');
                    }
                    if (btnHi) {
                        btnHi.classList.add('text-on-surface-variant');
                        btnHi.classList.remove('bg-primary', 'text-on-primary');
                    }
                }
            });
        })();
    </script>
`;

function processIndex() {
    let content = fs.readFileSync(indexFile, 'utf8');

    // 1. Replace header to add switcher
    const oldHeader = `<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding py-3 bg-white/90 backdrop-blur-xl shadow-sm border-b border-surface-variant/30 h-16">
        <a class="text-xl font-bold text-primary tracking-tight" href="/">PF Mitra</a>
        <a class="bg-primary text-on-primary px-4 py-2 rounded-full text-[13px] font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." target="_blank">
            <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            CHAT NOW
        </a>
    </header>`;

    const newHeader = `<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding py-3 bg-white/90 backdrop-blur-xl shadow-sm border-b border-surface-variant/30 h-16">
        <a class="text-xl font-bold text-primary tracking-tight" href="/" data-hi="PF मित्रा">PF Mitra</a>
        ${switcherHtml}
        <a class="bg-primary text-on-primary px-3.5 py-1.5 rounded-full text-[12px] font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal. / नमस्ते PF मित्रा, मुझे अपना PF निकालने में मदद चाहिए।" target="_blank">
            <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            <span data-hi="चैट">CHAT</span>
        </a>
    </header>`;

    content = content.replace(oldHeader, newHeader);

    // 2. Add translation attributes to elements
    const replacements = [
        [
            `<span class="text-[10px] font-bold uppercase tracking-widest">MSME & GST Registered</span>`,
            `<span class="text-[10px] font-bold uppercase tracking-widest" data-hi="MSME और GST रजिस्टर्ड">MSME & GST Registered</span>`
        ],
        [
            `<h1 class="font-display-lg text-display-lg text-on-background leading-tight">
                    Get Your PF Withdrawn Without the Hassle
                </h1>`,
            `<h1 class="font-display-lg text-display-lg text-on-background leading-tight" data-hi="बिना किसी झंझट के अपना PF का पैसा निकालें">
                    Get Your PF Withdrawn Without the Hassle
                </h1>`
        ],
        [
            `<p class="text-[15px] text-on-surface-variant leading-relaxed px-2">
                    Handled by real experts. No more confusing forms or portal glitches. Pay only after success.
                </p>`,
            `<p class="text-[15px] text-on-surface-variant leading-relaxed px-2" data-hi="असली एक्सपर्ट्स द्वारा काम। फॉर्म या पोर्टल की दिक्कतों की चिंता छोड़ें। पैसा अकाउंट में आने के बाद ही फीस दें।">
                    Handled by real experts. No more confusing forms or portal glitches. Pay only after success.
                </p>`
        ],
        [
            `<span class="text-base font-bold">Chat on WhatsApp</span>`,
            `<span class="text-base font-bold" data-hi="WhatsApp पर चैट करें">Chat on WhatsApp</span>`
        ],
        [
            `<a class="text-sm text-primary underline underline-offset-4 font-bold active:text-on-primary-container inline-block" href="/guide">
                        View PF Withdrawal Guide
                    </a>`,
            `<a class="text-sm text-primary underline underline-offset-4 font-bold active:text-on-primary-container inline-block" href="/guide" data-hi="PF निकालने की पूरी गाइड देखें">
                        View PF Withdrawal Guide
                    </a>`
        ],
        [
            `<span class="text-sm text-on-surface font-semibold">Real Human Expert Help</span>`,
            `<span class="text-sm text-on-surface font-semibold" data-hi="असली एक्सपर्ट्स द्वारा पूरी मदद">Real Human Expert Help</span>`
        ],
        [
            `<span class="text-sm text-on-surface font-semibold">Pay After PF Withdrawal</span>`,
            `<span class="text-sm text-on-surface font-semibold" data-hi="पैसा मिलने के बाद ही फीस दें">Pay After PF Withdrawal</span>`
        ],
        [
            `<span class="text-sm text-on-surface font-semibold">100% Secure & Private</span>`,
            `<span class="text-sm text-on-surface font-semibold" data-hi="100% सुरक्षित और प्राइवेट">100% Secure & Private</span>`
        ],
        [
            `<h2 class="font-headline-md text-xl text-on-surface mb-1">Simple 3-Step Process</h2>`,
            `<h2 class="font-headline-md text-xl text-on-surface mb-1" data-hi="3 आसान स्टेप्स">Simple 3-Step Process</h2>`
        ],
        [
            `<p class="text-xs text-on-surface-variant">We make it easy so you can relax.</p>`,
            `<p class="text-xs text-on-surface-variant" data-hi="हम काम आसान बनाते हैं ताकि आप आराम कर सकें।">We make it easy so you can relax.</p>`
        ],
        [
            `<h3 class="text-base mb-1 font-bold">Chat on WhatsApp</h3>`,
            `<h3 class="text-base mb-1 font-bold" data-hi="WhatsApp पर चैट करें">Chat on WhatsApp</h3>`
        ],
        [
            `<p class="text-on-surface-variant text-xs leading-relaxed">Send us a simple hi. Our expert will understand your PF issues immediately.</p>`,
            `<p class="text-on-surface-variant text-xs leading-relaxed" data-hi="हमें बस एक 'Hi' भेजें। हमारे एक्सपर्ट तुरंत आपकी समस्या समझेंगे।">Send us a simple hi. Our expert will understand your PF issues immediately.</p>`
        ],
        [
            `<h3 class="text-base mb-1 font-bold">We Handle Everything</h3>`,
            `<h3 class="text-base mb-1 font-bold" data-hi="हम सब कुछ संभालेंगे">We Handle Everything</h3>`
        ],
        [
            `<p class="text-on-surface-variant text-xs leading-relaxed">Relax while we manage all the paperwork and digital filing for you accurately.</p>`,
            `<p class="text-on-surface-variant text-xs leading-relaxed" data-hi="आप आराम करें, हम आपके दस्तावेज़ और ऑनलाइन फाइलिंग का सारा काम सही तरीके से करेंगे।">Relax while we manage all the paperwork and digital filing for you accurately.</p>`
        ],
        [
            `<h3 class="text-base mb-1 font-bold">Receive Money & Pay</h3>`,
            `<h3 class="text-base mb-1 font-bold" data-hi="पैसा पाएं और फीस दें">Receive Money & Pay</h3>`
        ],
        [
            `<p class="text-on-surface-variant text-xs leading-relaxed">The funds arrive in your bank account. Only then you pay our small fee.</p>`,
            `<p class="text-on-surface-variant text-xs leading-relaxed" data-hi="पैसा सीधा आपके बैंक अकाउंट में आएगा। उसके बाद ही हमारी छोटी सी फीस दें।">The funds arrive in your bank account. Only then you pay our small fee.</p>`
        ],
        [
            `<p class="text-xs font-semibold text-on-surface-variant leading-relaxed">
                        Prefer to do it yourself? We have a complete DIY guide for you.
                    </p>`,
            `<p class="text-xs font-semibold text-on-surface-variant leading-relaxed" data-hi="क्या आप खुद करना चाहते हैं? हमारे पास आपके लिए पूरी DIY गाइड है।">
                        Prefer to do it yourself? We have a complete DIY guide for you.
                    </p>`
        ],
        [
            `<a class="text-xs text-primary underline underline-offset-4 font-bold active:text-on-primary-container inline-block" href="/guide">
                    View PF Withdrawal Guide
                </a>`,
            `<a class="text-xs text-primary underline underline-offset-4 font-bold active:text-on-primary-container inline-block" href="/guide" data-hi="PF निकालने की पूरी गाइड देखें">
                    View PF Withdrawal Guide
                </a>`
        ],
        [
            `<h2 class="font-headline-md text-xl text-center mb-6">Why Hundreds Trust Us</h2>`,
            `<h2 class="font-headline-md text-xl text-center mb-6" data-hi="सैकड़ों लोग हम पर भरोसा क्यों करते हैं?">Why Hundreds Trust Us</h2>`
        ],
        [
            `<h4 class="font-bold text-base transition-colors duration-300">Save Time</h4>`,
            `<h4 class="font-bold text-base transition-colors duration-300" data-hi="समय बचाएं">Save Time</h4>`
        ],
        [
            `<p class="card-text text-xs leading-relaxed">Avoid the loop of rejected claims and frustrating portal errors.</p>`,
            `<p class="card-text text-xs leading-relaxed" data-hi="बार-बार रिजेक्ट होने वाले क्लेम और पोर्टल की गलतियों से बचें।">Avoid the loop of rejected claims and frustrating portal errors.</p>`
        ],
        [
            `<h4 class="font-bold text-base transition-colors duration-300">No Paperwork Stress</h4>`,
            `<h4 class="font-bold text-base transition-colors duration-300" data-hi="कागजी कार्रवाई का कोई तनाव नहीं">No Paperwork Stress</h4>`
        ],
        [
            `<p class="card-text text-xs leading-relaxed">We handle the digital filing and documentation accurately for you.</p>`,
            `<p class="card-text text-xs leading-relaxed" data-hi="हम आपके लिए डिजिटल फाइलिंग और डॉक्यूमेंट्स का सारा काम सही ढंग से करते हैं।">We handle the digital filing and documentation accurately for you.</p>`
        ],
        [
            `<h4 class="font-bold text-base transition-colors duration-300">Expert Handling</h4>`,
            `<h4 class="font-bold text-base transition-colors duration-300" data-hi="एक्सपर्ट द्वारा काम">Expert Handling</h4>`
        ],
        [
            `<p class="card-text text-xs leading-relaxed">Our specialists have resolved 5,000+ complex cases with 100% success.</p>`,
            `<p class="card-text text-xs leading-relaxed" data-hi="हमारे एक्सपर्ट्स ने 100% सफलता के साथ 5,000+ से ज़्यादा मुश्किल मामलों को सुलझाया है।">Our specialists have resolved 5,000+ complex cases with 100% success.</p>`
        ],
        [
            `<h2 class="font-headline-md text-xl text-on-surface">Transparent Pricing</h2>`,
            `<h2 class="font-headline-md text-xl text-on-surface" data-hi="साफ़ और स्पष्ट दाम">Transparent Pricing</h2>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-0.5">Simple plans. Pay only after success.</p>`,
            `<p class="text-xs text-on-surface-variant mt-0.5" data-hi="आसान प्लान। काम होने के बाद ही फीस दें।">Simple plans. Pay only after success.</p>`
        ],
        [
            `<span class="bg-surface-container px-3.5 py-0.5 rounded-full text-[9px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Basic Plan</span>`,
            `<span class="bg-surface-container px-3.5 py-0.5 rounded-full text-[9px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest" data-hi="बेसिक प्लान">Basic Plan</span>`
        ],
        [
            `<p class="text-on-surface-variant text-[11px] mb-6">Withdrawals below ₹50,000</p>`,
            `<p class="text-on-surface-variant text-[11px] mb-6" data-hi="₹50,000 से कम की निकासी">Withdrawals below ₹50,000</p>`
        ],
        [
            `Documentation check`,
            `<span data-hi="डॉक्यूमेंट चेक करना">Documentation check</span>`
        ],
        [
            `WhatsApp support`,
            `<span data-hi="WhatsApp सपोर्ट">WhatsApp support</span>`
        ],
        [
            `<a class="w-full py-2.5 rounded-xl border-2 border-primary text-primary text-xs font-bold active:bg-primary/5 transition-all text-center" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Basic%20plan%20(%E2%82%B9499%20for%20PF%20below%20%E2%82%B950,000)." target="_blank">Select Basic</a>`,
            `<a class="w-full py-2.5 rounded-xl border-2 border-primary text-primary text-xs font-bold active:bg-primary/5 transition-all text-center" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Basic%20plan%20(%E2%82%B9499%20for%20PF%20below%20%E2%82%B950,000). / नमस्ते, मैं ₹499 वाले बेसिक प्लान में रूचि रखता हूँ।" target="_blank" data-hi="बेसिक प्लान चुनें">Select Basic</a>`
        ],
        [
            `<div class="absolute -top-3 bg-primary text-on-primary px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">Most Popular</div>`,
            `<div class="absolute -top-3 bg-primary text-on-primary px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md" data-hi="सबसे लोकप्रिय">Most Popular</div>`
        ],
        [
            `<span class="bg-primary/10 px-3.5 py-0.5 rounded-full text-[9px] font-bold text-primary mb-4 uppercase tracking-widest mt-2">Premium Plan</span>`,
            `<span class="bg-primary/10 px-3.5 py-0.5 rounded-full text-[9px] font-bold text-primary mb-4 uppercase tracking-widest mt-2" data-hi="प्रीमियम प्लान">Premium Plan</span>`
        ],
        [
            `<p class="text-on-surface-variant text-[11px] mb-6">Withdrawals above ₹50,000</p>`,
            `<p class="text-on-surface-variant text-[11px] mb-6" data-hi="₹50,000 से ऊपर की निकासी">Withdrawals above ₹50,000</p>`
        ],
        [
            `Priority processing`,
            `<span data-hi="प्राथमिकता के साथ काम (फ़ास्ट ट्रैक)">Priority processing</span>`
        ],
        [
            `Dedicated manager`,
            `<span data-hi="पर्सनल मैनेजर सपोर्ट">Dedicated manager</span>`
        ],
        [
            `Full Success guarantee`,
            `<span data-hi="सफलता की पूरी गारंटी">Full Success guarantee</span>`
        ],
        [
            `<a class="w-full py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md active:scale-[0.98] transition-all text-center" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Premium%20plan%20(%E2%82%B9999%20for%20PF%20above%20%E2%82%B950,000)." target="_blank">Start Premium</a>`,
            `<a class="w-full py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md active:scale-[0.98] transition-all text-center" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Premium%20plan%20(%E2%82%B9999%20for%20PF%20above%20%E2%82%B950,000). / नमस्ते, मैं ₹999 वाले प्रीमियम प्लान में रूचि रखता हूँ।" target="_blank" data-hi="प्रीमियम प्लान शुरू करें">Start Premium</a>`
        ],
        [
            `<h2 class="font-headline-md text-xl text-on-surface">Common Questions</h2>`,
            `<h2 class="font-headline-md text-xl text-on-surface" data-hi="अक्सर पूछे जाने वाले सवाल">Common Questions</h2>`
        ],
        [
            `<h4 class="font-semibold text-sm pr-4">Is this service safe?</h4>`,
            `<h4 class="font-semibold text-sm pr-4" data-hi="क्या यह सर्विस सुरक्षित है?">Is this service safe?</h4>`
        ],
        [
            `<p class="text-on-surface-variant text-xs leading-relaxed">
                            We are a registered consultancy helping customers to withdraw their PF. Pay only after success.
                        </p>`,
            `<p class="text-on-surface-variant text-xs leading-relaxed" data-hi="हम एक रजिस्टर्ड कंसल्टेंसी हैं जो ग्राहकों को अपना PF निकालने में मदद करती है। काम पूरा होने के बाद ही फीस दें।">
                            We are a registered consultancy helping customers to withdraw their PF. Pay only after success.
                        </p>`
        ],
        [
            `<h4 class="font-semibold text-sm pr-4">How long does it take?</h4>`,
            `<h4 class="font-semibold text-sm pr-4" data-hi="इसमें कितना समय लगता है?">How long does it take?</h4>`
        ],
        [
            `<p class="text-on-surface-variant text-xs leading-relaxed">
                            Our filing takes &lt;24 hrs. EPFO usually processes in 7-15 working days.
                        </p>`,
            `<p class="text-on-surface-variant text-xs leading-relaxed" data-hi="हमारी फाइलिंग में 24 घंटे से कम का समय लगता है। EPFO आमतौर पर 7-15 वर्किंग दिनों में प्रोसेस करता है।">
                            Our filing takes &lt;24 hrs. EPFO usually processes in 7-15 working days.
                        </p>`
        ],
        [
            `<h4 class="font-semibold text-sm pr-4">Can I do it myself?</h4>`,
            `<h4 class="font-semibold text-sm pr-4" data-hi="क्या मैं इसे खुद कर सकता हूँ?">Can I do it myself?</h4>`
        ],
        [
            `<p class="text-on-surface-variant text-xs leading-relaxed">
                            Yes! Check our <a class="text-primary font-bold underline underline-offset-4" href="/guide">free step-by-step guide</a> to navigate the portal yourself.
                        </p>`,
            `<p class="text-on-surface-variant text-xs leading-relaxed" data-hi="हाँ! खुद पोर्टल पर क्लेम करने के लिए हमारी <a class='text-primary font-bold underline underline-offset-4' href='/guide'>फ्री स्टेप-बाय-स्टेप गाइड देखें</a>।">
                            Yes! Check our <a class="text-primary font-bold underline underline-offset-4" href="/guide">free step-by-step guide</a> to navigate the portal yourself.
                        </p>`
        ],
        [
            `<h2 class="font-display-lg text-xl mb-3 relative z-10 font-bold leading-tight">Ready to get your money?</h2>`,
            `<h2 class="font-display-lg text-xl mb-3 relative z-10 font-bold leading-tight" data-hi="क्या आप अपना पैसा पाने के लिए तैयार हैं?">Ready to get your money?</h2>`
        ],
        [
            `<p class="text-on-surface-variant text-xs mb-6 relative z-10 leading-relaxed">Join 10,000+ happy clients who got their PF without headaches.</p>`,
            `<p class="text-on-surface-variant text-xs mb-6 relative z-10 leading-relaxed" data-hi="10,000+ खुश ग्राहकों में शामिल हों, जिन्होंने बिना किसी सिरदर्द के अपना PF पाया।">Join 10,000+ happy clients who got their PF without headaches.</p>`
        ],
        [
            `<a class="w-full bg-primary text-on-primary py-4 rounded-2xl text-base font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 relative z-10 pulse-cta" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20ready%20to%20withdraw%20my%20PF.%20Let's%20get%20started." target="_blank">`,
            `<a class="w-full bg-primary text-on-primary py-4 rounded-2xl text-base font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 relative z-10 pulse-cta" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20ready%20to%20withdraw%20my%20PF.%20Let's%20get%20started. / नमस्ते PF मित्रा, मैं अपना PF निकालने के लिए तैयार हूँ।" target="_blank" data-hi="अभी WhatsApp शुरू करें">`
        ],
        [
            `<p>A service by Anusha HR Consultancy</p>`,
            `<p data-hi="अनुषा एचआर कंसल्टेंसी द्वारा दी जाने वाली सर्विस">A service by Anusha HR Consultancy</p>`
        ],
        [
            `<button class="flex items-center gap-2 text-primary font-bold text-xs bg-primary/10 px-4 py-2 rounded-full active:bg-primary/20 transition-colors mx-auto mb-6" id="shareButton">
            <span class="material-symbols-outlined text-lg">share</span>
            Share with Friends
        </button>`,
            `<button class="flex items-center gap-2 text-primary font-bold text-xs bg-primary/10 px-4 py-2 rounded-full active:bg-primary/20 transition-colors mx-auto mb-6" id="shareButton">
            <span class="material-symbols-outlined text-lg">share</span>
            <span data-hi="दोस्तों के साथ शेयर करें">Share with Friends</span>
        </button>`
        ],
        [
            `<p class="text-[10px] text-on-surface-variant/60 leading-relaxed mb-8 px-4">
            Disclaimer: We are a private consulting firm. We are not affiliated with EPFO or the Government of India.
        </p>`,
            `<p class="text-[10px] text-on-surface-variant/60 leading-relaxed mb-8 px-4" data-hi="डिस्क्लेमर: हम एक प्राइवेट कंसल्टिंग फर्म हैं। हमारा EPFO या भारत सरकार से कोई आधिकारिक संबंध नहीं है।">
            Disclaimer: We are a private consulting firm. We are not affiliated with EPFO or the Government of India.
        </p>`
        ],
        [
            `<a class="active:opacity-50" href="/">Home</a>`,
            `<a class="active:opacity-50" href="/" data-hi="होम">Home</a>`
        ],
        [
            `<a class="active:opacity-50" href="/guide">Guide</a>`,
            `<a class="active:opacity-50" href="/guide" data-hi="गाइड">Guide</a>`
        ],
        [
            `<a class="active:opacity-50" href="mailto:anushahrconsultancy@gmail.com">Contact</a>`,
            `<a class="active:opacity-50" href="mailto:anushahrconsultancy@gmail.com" data-hi="संपर्क">Contact</a>`
        ],
        [
            `<a class="active:opacity-50" href="/privacy">Privacy Policy</a>`,
            `<a class="active:opacity-50" href="/privacy" data-hi="प्राइवेसी पॉलिसी">Privacy Policy</a>`
        ],
        [
            `<a class="active:opacity-50" href="/terms">Terms of Service</a>`,
            `<a class="active:opacity-50" href="/terms" data-hi="टर्म्स ऑफ़ सर्विस">Terms of Service</a>`
        ]
    ];

    replacements.forEach(([target, replacement]) => {
        content = content.replace(target, replacement);
    });

    // Add JS Logic before final </body>
    content = content.replace('</body>', jsLogic + '\n</body>');

    fs.writeFileSync(indexFile, content, 'utf8');
    console.log('Processed index.html successfully!');
}

function processGuide() {
    let content = fs.readFileSync(guideFile, 'utf8');

    // 1. Replace header to add switcher
    const oldHeader = `<header class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-surface-variant/30 h-16 flex items-center justify-between px-container-padding safe-top">
        <a class="flex items-center gap-2" href="/">
            <span class="text-xl font-bold tracking-tight text-primary">PF Mitra</span>
        </a>
        <a class="flex items-center gap-1.5 text-primary font-bold text-[13px] bg-primary/10 px-4 py-2 rounded-full active:scale-95 transition-transform" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." target="_blank">
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            CHAT NOW
        </a>
    </header>`;

    const newHeader = `<header class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-surface-variant/30 h-16 flex items-center justify-between px-container-padding safe-top">
        <a class="flex items-center gap-2" href="/" data-hi="PF मित्रा">
            <span class="text-xl font-bold tracking-tight text-primary">PF Mitra</span>
        </a>
        ${switcherHtml}
        <a class="bg-primary text-on-primary px-3.5 py-1.5 rounded-full text-[12px] font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal. / नमस्ते PF मित्रा, मुझे अपना PF निकालने में मदद चाहिए।" target="_blank">
            <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            <span data-hi="चैट">CHAT</span>
        </a>
    </header>`;

    content = content.replace(oldHeader, newHeader);

    // 2. Add translation attributes to elements
    const replacements = [
        [
            `<h1 class="font-display-lg text-display-lg text-on-background mb-3 leading-tight">How to Withdraw PF Online (2026)</h1>`,
            `<h1 class="font-display-lg text-display-lg text-on-background mb-3 leading-tight" data-hi="PF ऑनलाइन कैसे निकालें (2026)">How to Withdraw PF Online (2026)</h1>`
        ],
        [
            `<p class="font-body-md text-on-surface-variant text-base">Your complete step-by-step mobile guide to hassle-free withdrawals.</p>`,
            `<p class="font-body-md text-on-surface-variant text-base" data-hi="बिना किसी परेशानी के निकासी के लिए आपकी पूरी स्टेप-बाय-स्टेप मोबाइल गाइड।">Your complete step-by-step mobile guide to hassle-free withdrawals.</p>`
        ],
        [
            `<h2 class="font-headline-md text-lg text-on-surface">Eligibility</h2>`,
            `<h2 class="font-headline-md text-lg text-on-surface" data-hi="पात्रता (Eligibility)">Eligibility</h2>`
        ],
        [
            `<span>Left job & unemployed for 2+ months</span>`,
            `<span data-hi="नौकरी छोड़ दी है और 2 महीने से अधिक समय से बेरोजगार हैं">Left job & unemployed for 2+ months</span>`
        ],
        [
            `<span>Aadhaar, PAN & Bank are linked</span>`,
            `<span data-hi="आधार, पैन और बैंक अकाउंट लिंक्ड हैं">Aadhaar, PAN & Bank are linked</span>`
        ],
        [
            `<span>KYC is updated & verified</span>`,
            `<span data-hi="KYC अपडेटेड और वेरिफाइड है">KYC is updated & verified</span>`
        ],
        [
            `<h2 class="font-headline-md text-lg text-on-surface">Documents Required</h2>`,
            `<h2 class="font-headline-md text-lg text-on-surface" data-hi="ज़रूरी दस्तावेज़">Documents Required</h2>`
        ],
        [
            `<span class="text-sm font-medium">UAN Number & Password</span>`,
            `<span class="text-sm font-medium" data-hi="UAN नंबर और पासवर्ड">UAN Number & Password</span>`
        ],
        [
            `<span class="text-sm font-medium">Aadhaar (OTP linked)</span>`,
            `<span class="text-sm font-medium" data-hi="आधार कार्ड (OTP लिंक्ड)">Aadhaar (OTP linked)</span>`
        ],
        [
            `<span class="text-sm font-medium">Bank Account & IFSC</span>`,
            `<span class="text-sm font-medium" data-hi="बैंक अकाउंट और IFSC कोड">Bank Account & IFSC</span>`
        ],
        [
            `<p class="text-[12px] font-medium text-on-surface-variant">Details must match exactly with EPFO records to avoid rejection.</p>`,
            `<p class="text-[12px] font-medium text-on-surface-variant" data-hi="रिजेक्शन से बचने के लिए सभी डिटेल्स EPFO रिकॉर्ड से बिल्कुल मैच होनी चाहिए।">Details must match exactly with EPFO records to avoid rejection.</p>`
        ],
        [
            `<h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Processing Time</h3>`,
            `<h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-0.5" data-hi="प्रोसेसिंग का समय">Processing Time</h3>`
        ],
        [
            `<p class="text-sm text-on-surface font-semibold">3–15 working days</p>`,
            `<p class="text-sm text-on-surface font-semibold" data-hi="3 से 15 वर्किंग दिन">3–15 working days</p>`
        ],
        [
            `<h2 class="font-headline-md text-xl text-on-surface">Withdrawal Steps</h2>`,
            `<h2 class="font-headline-md text-xl text-on-surface" data-hi="निकासी के स्टेप्स">Withdrawal Steps</h2>`
        ],
        [
            `<span class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">6 STEPS</span>`,
            `<span class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full" data-hi="6 आसान स्टेप्स">6 STEPS</span>`
        ],
        [
            `<h3 class="font-bold text-on-surface text-base">Login to EPFO</h3>`,
            `<h3 class="font-bold text-on-surface text-base" data-hi="EPFO पोर्टल पर लॉगिन करें">Login to EPFO</h3>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-1">Visit UAN Member Portal and sign in with credentials.</p>`,
            `<p class="text-xs text-on-surface-variant mt-1" data-hi="UAN मेंबर पोर्टल पर जाएं और अपने पासवर्ड से लॉगिन करें।">Visit UAN Member Portal and sign in with credentials.</p>`
        ],
        [
            `<span class="material-symbols-outlined text-[14px]">touch_app</span> Tap to see details & screenshot`,
            `<span class="material-symbols-outlined text-[14px]">touch_app</span> <span data-hi="डिटेल्स और स्क्रीनशॉट देखने के लिए टैप करें">Tap to see details & screenshot</span>`
        ],
        [
            `<p class="text-xs text-on-surface leading-relaxed mb-3">
                                Ensure you have your 12-digit UAN and password ready. Use the <strong>"Forgot Password"</strong> link if needed. After login, check the 'Member Profile' section for basic details.
                            </p>`,
            `<p class="text-xs text-on-surface leading-relaxed mb-3" data-hi="अपना 12 अंकों का UAN और पासवर्ड तैयार रखें। यदि आवश्यक हो तो 'Forgot Password' लिंक का उपयोग करें। लॉगिन के बाद 'Member Profile' सेक्शन में अपनी बेसिक डिटेल्स चेक करें।">
                                Ensure you have your 12-digit UAN and password ready. Use the <strong>"Forgot Password"</strong> link if needed. After login, check the 'Member Profile' section for basic details.
                            </p>`
        ],
        [
            `<h3 class="font-bold text-on-surface text-base">Check KYC Status</h3>`,
            `<h3 class="font-bold text-on-surface text-base" data-hi="KYC स्टेटस चेक करें">Check KYC Status</h3>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-1">Verify that your profile is fully validated.</p>`,
            `<p class="text-xs text-on-surface-variant mt-1" data-hi="चेक करें कि आपकी प्रोफाइल पूरी तरह वेरिफाइड है या नहीं।">Verify that your profile is fully validated.</p>`
        ],
        [
            `<span class="material-symbols-outlined text-[14px]">touch_app</span> Tap to see details`,
            `<span class="material-symbols-outlined text-[14px]">touch_app</span> <span data-hi="डिटेल्स देखने के लिए टैप करें">Tap to see details</span>`
        ],
        [
            `<p class="text-xs text-on-surface leading-relaxed">
                                Navigate to <strong>Manage &gt; KYC</strong>. Look for "Aadhaar", "PAN", and "Bank Account" in the list. They must have a green tick and say <strong>"Verified by UIDAI/Bank"</strong>.
                            </p>`,
            `<p class="text-xs text-on-surface leading-relaxed" data-hi="Manage &gt; KYC पर जाएं। लिस्ट में Aadhaar, PAN और Bank Account देखें। इनपर ग्रीन टिक होना चाहिए और 'Verified by UIDAI/Bank' लिखा होना चाहिए।">
                                Navigate to <strong>Manage &gt; KYC</strong>. Look for "Aadhaar", "PAN", and "Bank Account" in the list. They must have a green tick and say <strong>"Verified by UIDAI/Bank"</strong>.
                            </p>`
        ],
        [
            `<h3 class="font-bold text-on-surface text-base">Claim Online</h3>`,
            `<h3 class="font-bold text-on-surface text-base" data-hi="ऑनलाइन क्लेम करें">Claim Online</h3>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-1">Initiate the withdrawal form from the menu.</p>`,
            `<p class="text-xs text-on-surface-variant mt-1" data-hi="मेन्यू से निकासी (withdrawal) फॉर्म शुरू करें।">Initiate the withdrawal form from the menu.</p>`
        ],
        [
            `<p class="text-xs text-on-surface leading-relaxed">
                                Go to <strong>Online Services &gt; Claim (Form-31, 19, 10C &amp; 10D)</strong>. You will need to verify your bank account by entering the full account number.
                            </p>`,
            `<p class="text-xs text-on-surface leading-relaxed" data-hi="Online Services &gt; Claim (Form-31, 19, 10C &amp; 10D) पर जाएं। आपको अपना पूरा बैंक अकाउंट नंबर दर्ज करके उसे वेरीफाई करना होगा।">
                                Go to <strong>Online Services &gt; Claim (Form-31, 19, 10C &amp; 10D)</strong>. You will need to verify your bank account by entering the full account number.
                            </p>`
        ],
        [
            `<h3 class="font-bold text-on-surface text-base">Select Reason</h3>`,
            `<h3 class="font-bold text-on-surface text-base" data-hi="कारण (Reason) चुनें">Select Reason</h3>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-1">Choose the type of withdrawal and reason.</p>`,
            `<p class="text-xs text-on-surface-variant mt-1" data-hi="निकासी का प्रकार और कारण चुनें।">Choose the type of withdrawal and reason.</p>`
        ],
        [
            `<p class="text-xs text-on-surface leading-relaxed">
                                For advance (partial), select a reason like medical, marriage, or illness. For full withdrawal, you must have an 'Exit Date' updated by your employer.
                            </p>`,
            `<p class="text-xs text-on-surface leading-relaxed" data-hi="एडवांस (हाफ) निकासी के लिए बीमारी, शादी या इलाज जैसा कारण चुनें। फुल निकासी के लिए आपके नियोक्ता (employer) द्वारा 'Exit Date' अपडेट होनी चाहिए।">
                                For advance (partial), select a reason like medical, marriage, or illness. For full withdrawal, you must have an 'Exit Date' updated by your employer.
                            </p>`
        ],
        [
            `<h3 class="font-bold text-on-surface text-base">Final Submission</h3>`,
            `<h3 class="font-bold text-on-surface text-base" data-hi="फाइनल सबमिशन">Final Submission</h3>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-1">Verify with Aadhaar OTP to complete.</p>`,
            `<p class="text-xs text-on-surface-variant mt-1" data-hi="पूरा करने के लिए आधार OTP से वेरीफाई करें।">Verify with Aadhaar OTP to complete.</p>`
        ],
        [
            `<p class="text-xs text-on-surface leading-relaxed">
                                Ensure your bank account and KYC details are correctly linked with your UAN. Enter the OTP sent to your Aadhaar-linked mobile number to complete submission.
                            </p>`,
            `<p class="text-xs text-on-surface leading-relaxed" data-hi="सुनिश्चित करें कि आपका बैंक अकाउंट और KYC डिटेल्स आपके UAN से सही तरीके से जुड़े हैं। सबमिशन पूरा करने के लिए अपने आधार-लिंक्ड मोबाइल नंबर पर भेजे गए OTP को दर्ज करें।">
                                Ensure your bank account and KYC details are correctly linked with your UAN. Enter the OTP sent to your Aadhaar-linked mobile number to complete submission.
                            </p>`
        ],
        [
            `<h3 class="font-bold text-on-surface text-base">Track Claim Status</h3>`,
            `<h3 class="font-bold text-on-surface text-base" data-hi="क्लेम स्टेटस ट्रैक करें">Track Claim Status</h3>`
        ],
        [
            `<p class="text-xs text-on-surface-variant mt-1">Monitor progress until the amount hits your account.</p>`,
            `<p class="text-xs text-on-surface-variant mt-1" data-hi="पैसा बैंक खाते में आने तक प्रगति पर नज़र रखें।">Monitor progress until the amount hits your account.</p>`
        ],
        [
            `<p class="text-xs text-on-surface leading-relaxed">
                                Navigate to <strong>Online Services &gt; Track Claim Status</strong>. Look for updates such as "Submitted at Portal" to "Under Process". Keep checking daily; funds typically hit your bank within 3-15 working days.
                            </p>`,
            `<p class="text-xs text-on-surface leading-relaxed" data-hi="Online Services &gt; Track Claim Status पर जाएं। 'Submitted at Portal' से लेकर 'Under Process' जैसे अपडेट देखें। रोजाना चेक करते रहें, आमतौर पर 3-15 वर्किंग दिनों में पैसा बैंक में आ जाता है।">
                                Navigate to <strong>Online Services &gt; Track Claim Status</strong>. Look for updates such as "Submitted at Portal" to "Under Process". Keep checking daily; funds typically hit your bank within 3-15 working days.
                            </p>`
        ],
        [
            `<strong>Expert Tip:</strong>`,
            `<strong data-hi="एक्सपर्ट टिप:">Expert Tip:</strong>`
        ],
        [
            `Check your claim status daily under "Track Claim Status". Most rejections happen within the first 48 hours.`,
            `<span data-hi="रोजाना 'Track Claim Status' में अपना स्टेटस चेक करें। ज़्यादातर रिजेक्शन शुरुआती 48 घंटों में ही होते हैं।">Check your claim status daily under "Track Claim Status". Most rejections happen within the first 48 hours.</span>`
        ],
        [
            `Avoid These Rejections`,
            `<span data-hi="इन रिजेक्शन से बचें">Avoid These Rejections</span>`
        ],
        [
            `<span class="font-bold text-on-surface">Bank Details Mismatch:</span>`,
            `<span class="font-bold text-on-surface" data-hi="बैंक डिटेल्स मिसमैच:">Bank Details Mismatch:</span>`
        ],
        [
            `Your name, IFSC, and account number in EPFO must exactly match your bank passbook/cheque leaf.`,
            `<span data-hi="EPFO में आपका नाम, IFSC और अकाउंट नंबर आपके बैंक पासबुक या चेक से बिल्कुल मैच होना चाहिए।">Your name, IFSC, and account number in EPFO must exactly match your bank passbook/cheque leaf.</span>`
        ],
        [
            `<span class="font-bold text-on-surface">Exit Date Missing:</span>`,
            `<span class="font-bold text-on-surface" data-hi="एग्जिट डेट (Exit Date) न होना:">Exit Date Missing:</span>`
        ],
        [
            `You cannot withdraw full PF if your employer has not updated your Date of Exit. We can help resolve this.`,
            `<span data-hi="यदि आपके नियोक्ता ने आपकी डेट ऑफ एग्जिट अपडेट नहीं की है, तो आप पूरा PF नहीं निकाल सकते। हम इसे हल करने में मदद कर सकते हैं।">You cannot withdraw full PF if your employer has not updated your Date of Exit. We can help resolve this.</span>`
        ],
        [
            `GET REJECTION HELP`,
            `<span data-hi="रिजेक्शन में मदद पाएं">GET REJECTION HELP</span>`
        ],
        [
            `<span class="font-semibold text-sm pr-4">Why is my PF claim rejected or stuck?</span>`,
            `<span class="font-semibold text-sm pr-4" data-hi="मेरा PF क्लेम रिजेक्ट या पेंडिंग क्यों है?">Why is my PF claim rejected or stuck?</span>`
        ],
        [
            `Usually due to small issues like KYC mismatch, wrong bank details, or employer not updating your exit date.`,
            `<span data-hi="आमतौर पर छोटी समस्याओं जैसे KYC मिसमैच, गलत बैंक डिटेल्स या नियोक्ता द्वारा एग्जिट डेट अपडेट न करने के कारण ऐसा होता है।">Usually due to small issues like KYC mismatch, wrong bank details, or employer not updating your exit date.</span>`
        ],
        [
            `<span class="font-semibold text-sm pr-4">Do I need employer approval for PF withdrawal?</span>`,
            `<span class="font-semibold text-sm pr-4" data-hi="क्या PF निकालने के लिए कंपनी की मंजूरी ज़रूरी है?">Do I need employer approval for PF withdrawal?</span>`
        ],
        [
            `No, in most online cases it’s not required. But if your employer hasn’t updated your details, your claim can still get delayed or rejected.`,
            `<span data-hi="नहीं, अधिकांश ऑनलाइन मामलों में इसकी आवश्यकता नहीं होती है। लेकिन यदि आपकी कंपनी ने डिटेल्स अपडेट नहीं की हैं, तो आपका क्लेम पेंडिंग या रिजेक्ट हो सकता है।">No, in most online cases it’s not required. But if your employer hasn’t updated your details, your claim can still get delayed or rejected.</span>`
        ],
        [
            `<h2 class="text-xl font-bold mb-3 relative font-display">Too Complicated?</h2>`,
            `<h2 class="text-xl font-bold mb-3 relative font-display" data-hi="बहुत मुश्किल लग रहा है?">Too Complicated?</h2>`
        ],
        [
            `<p class="text-white/80 text-xs mb-6 relative px-2">Our experts can handle the entire withdrawal process for you. Zero stress, 100% success.</p>`,
            `<p class="text-white/80 text-xs mb-6 relative px-2" data-hi="हमारे एक्सपर्ट्स आपके लिए निकासी की पूरी प्रक्रिया संभाल सकते हैं। जीरो टेंशन, 100% सफलता।">Our experts can handle the entire withdrawal process for you. Zero stress, 100% success.</p>`
        ],
        [
            `<span class="text-sm font-bold">CHAT ON WHATSAPP</span>`,
            `<span class="text-sm font-bold" data-hi="WHATSAPP पर चैट करें">CHAT ON WHATSAPP</span>`
        ],
        [
            `<a class="flex-1 bg-primary text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-all shadow-lg shadow-primary/20 text-center" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20assistance%20with%20my%20PF%20withdrawal." target="_blank">`,
            `<a class="flex-1 bg-primary text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-all shadow-lg shadow-primary/20 text-center" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20assistance%20with%20my%20PF%20withdrawal. / नमस्ते PF मित्रा, मुझे अपना PF निकालने में मदद चाहिए।" target="_blank" data-hi="मदद चाहिए">`
        ],
        [
            `<span data-hi="होम">Home</span>`,
            `<a class="active:opacity-50" href="/" data-hi="होम">Home</a>`
        ],
        [
            `<span data-hi="गाइड">Guide</span>`,
            `<a class="active:opacity-50" href="/guide" data-hi="गाइड">Guide</a>`
        ],
        [
            `<span data-hi="संपर्क">Contact</span>`,
            `<a class="active:opacity-50" href="mailto:anushahrconsultancy@gmail.com" data-hi="संपर्क">Contact</a>`
        ]
    ];

    replacements.forEach(([target, replacement]) => {
        content = content.replace(target, replacement);
    });

    // Add JS Logic before final </body>
    content = content.replace('</body>', jsLogic + '\n</body>');

    fs.writeFileSync(guideFile, content, 'utf8');
    console.log('Processed guide.html successfully!');
}

processIndex();
processGuide();
