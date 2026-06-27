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
                    
                    // Translate elements text
                    document.querySelectorAll('[data-hi]').forEach(el => {
                        if (!el.dataset.enText) {
                            el.dataset.enText = el.innerHTML;
                        }
                        el.innerHTML = el.getAttribute('data-hi');
                    });

                    // Translate WhatsApp pre-filled message links
                    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
                        if (!el.dataset.enHref) {
                            el.dataset.enHref = el.getAttribute('href');
                        }
                        if (el.getAttribute('data-hi-href')) {
                            el.setAttribute('href', el.getAttribute('data-hi-href'));
                        }
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
                    
                    // Restore elements text
                    document.querySelectorAll('[data-hi]').forEach(el => {
                        if (el.dataset.enText) {
                            el.innerHTML = el.dataset.enText;
                        }
                    });

                    // Restore WhatsApp links
                    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
                        if (el.dataset.enHref) {
                            el.setAttribute('href', el.dataset.enHref);
                        }
                    });
                }
                localStorage.setItem('preferred-lang', lang);
                window.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
            }

            if (btnEn && btnHi) {
                btnEn.addEventListener('click', () => setLanguage('en'));
                btnHi.addEventListener('click', () => setLanguage('hi'));
                
                const savedLang = localStorage.getItem('preferred-lang') || 'en';
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

    // Remove existing language logic from previous run if any
    content = content.replace(/<script>\s*\/\/ Language Switcher Logic[\s\S]*?<\/script>/g, '');

    // 1. Replace header to add switcher and bilingual links
    const headerPattern = /<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding py-3 bg-white\/90 backdrop-blur-xl shadow-sm border-b border-surface-variant\/30 h-16">[\s\S]*?<\/header>/;
    
    const newHeader = `<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding py-3 bg-white/90 backdrop-blur-xl shadow-sm border-b border-surface-variant/30 h-16">
        <a class="text-xl font-bold text-primary tracking-tight" href="/" data-hi="PF मित्रा">PF Mitra</a>
        ${switcherHtml}
        <a class="bg-primary text-on-primary px-3.5 py-1.5 rounded-full text-[12px] font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20me%20help%20chahiye." target="_blank">
            <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            <span data-hi="चैट">CHAT</span>
        </a>
    </header>`;

    content = content.replace(headerPattern, newHeader);

    // 2. Add translation and WhatsApp href mapping to various buttons in index.html
    const waReplacements = [
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20me%20help%20chahiye." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Basic%20plan%20(%E2%82%B9499%20for%20PF%20below%20%E2%82%B950,000)." target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Basic%20plan%20(%E2%82%B9499%20for%20PF%20below%20%E2%82%B950,000)." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20Basic%20plan%20(Rs%20499)%20me%20interest%20hai." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Premium%20plan%20(%E2%82%B9999%20for%20PF%20above%20%E2%82%B950,000)." target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20interested%20in%20the%20Premium%20plan%20(%E2%82%B9999%20for%20PF%20above%20%E2%82%B950,000)." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20Premium%20plan%20(Rs%20999)%20me%20interest%20hai." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20ready%20to%20withdraw%20my%20PF.%20Let's%20get%20started." target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20ready%20to%20withdraw%20my%20PF.%20Let's%20get%20started." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mai%20apna%20PF%20nikalne%20ke%20liye%20ready%20hu." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20want%20to%20start%20my%20PF%20withdrawal.%20Can%20you%20guide%20me?" target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20want%20to%20start%20my%20PF%20withdrawal.%20Can%20you%20guide%20me?" data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20shuru%20karna%20hai%2C%20guide%20kijiye." target="_blank"`
        ]
    ];

    waReplacements.forEach(([target, replacement]) => {
        content = content.replace(target, replacement);
    });

    // Add JS Logic before final </body>
    content = content.replace('</body>', jsLogic + '\n</body>');

    fs.writeFileSync(indexFile, content, 'utf8');
    console.log('Processed index.html successfully!');
}

function processGuide() {
    let content = fs.readFileSync(guideFile, 'utf8');

    // Remove existing language logic from previous run if any
    content = content.replace(/<script>\s*\/\/ Language Switcher Logic[\s\S]*?<\/script>/g, '');

    // 1. Replace header to add switcher and bilingual links
    const headerPattern = /<header class="fixed top-0 w-full z-50 bg-white\/90 backdrop-blur-xl border-b border-surface-variant\/30 h-16 flex items-center justify-between px-container-padding safe-top">[\s\S]*?<\/header>/;
    
    const newHeader = `<header class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-surface-variant/30 h-16 flex items-center justify-between px-container-padding safe-top">
        <a class="flex items-center gap-2" href="/" data-hi="PF मित्रा">
            <span class="text-xl font-bold tracking-tight text-primary">PF Mitra</span>
        </a>
        ${switcherHtml}
        <a class="bg-primary text-on-primary px-3.5 py-1.5 rounded-full text-[12px] font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1" href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20me%20help%20chahiye." target="_blank">
            <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            <span data-hi="चैट">CHAT</span>
        </a>
    </header>`;

    content = content.replace(headerPattern, newHeader);

    // 2. Add translation and WhatsApp href mapping to various buttons in guide.html
    const waReplacements = [
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20help%20with%20my%20PF%20withdrawal." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20me%20help%20chahiye." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20my%20PF%20claim%20got%20rejected.%20Can%20you%20help%20me%20resolve%20this?" target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20my%20PF%20claim%20got%20rejected.%20Can%20you%20help%20me%20resolve%20this?" data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mera%20PF%20claim%20reject%20ho%20gaya%20hai%2C%20solve%20karne%20me%20help%20chahiye." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20having%20trouble%20with%20my%20PF%20withdrawal.%20Can%20you%20do%20it%20for%20me?" target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I'm%20having%20trouble%20with%20my%20PF%20withdrawal.%20Can%20you%20do%20it%20for%20me?" data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20karwane%20me%20dikkati%20aa%20rahi%20hai%2C%20mere%20liye%20kar%20dijiye." target="_blank"`
        ],
        [
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20assistance%20with%20my%20PF%20withdrawal." target="_blank"`,
            `href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20I%20need%20assistance%20with%20my%20PF%20withdrawal." data-hi-href="https://wa.me/918689886552?text=Hi%20PF%20Mitra,%20mujhe%20PF%20withdrawal%20me%20help%20chahiye." target="_blank"`
        ]
    ];

    waReplacements.forEach(([target, replacement]) => {
        content = content.replace(target, replacement);
    });

    // Add JS Logic before final </body>
    content = content.replace('</body>', jsLogic + '\n</body>');

    fs.writeFileSync(guideFile, content, 'utf8');
    console.log('Processed guide.html successfully!');
}

processIndex();
processGuide();
