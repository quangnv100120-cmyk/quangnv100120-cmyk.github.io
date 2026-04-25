class IMPCHeader extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active') || 'home';

        this.innerHTML = `
        <div class="header flex justify-between items-center" style="position: absolute; top: 0; left: 0; width: 100%; padding: 32px 80px; display: flex; justify-content: space-between; align-items: center; z-index: 50; box-sizing: border-box; pointer-events: none;">
            <a href="index.html" class="logo" style="display: flex; align-items: center; flex-shrink: 0; pointer-events: auto;">
                <img src="./assets/fa1be58f10fbfb652eb1842bacda630811f46632.svg" alt="IMPC Logo" style="width: 108px; height: 32px; object-fit: contain; display: block;">
            </a>
            <div class="lang-switcher-container" style="pointer-events: auto; display: flex; align-items: center; gap: 12px;">
                <nav class="nav-pill" style="pointer-events: auto;">
                    <a href="index.html" class="nav-item ${activePage === 'home' ? 'active' : ''}" data-i18n="Local Component.menu_item 1">Trang chủ</a>
                    <a href="service.html" class="nav-item ${activePage === 'service' ? 'active' : ''}" data-i18n="Local Component.menu_item 2">Dịch vụ</a>
                    <a href="portfolio.html" class="nav-item ${activePage === 'portfolio' ? 'active' : ''}" data-i18n="Local Component.menu_item 3">Hồ sơ năng lực</a>
                </nav>
                <div class="lang-switcher-dropdown">
                    <button class="lang-switcher-trigger">
                        <span class="current-lang-text">VIE</span>
                        <svg class="chevron" width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.33398 2.66699L8.00065 8.33366L13.6673 2.66699" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="lang-switcher-menu">
                        <button class="lang-switcher-item active" data-lang="vi" onclick="setLanguage('vi')">VIE</button>
                        <button class="lang-switcher-item" data-lang="en" onclick="setLanguage('en')">ENG</button>
                    </div>
                </div>
                <button class="mobile-menu-btn" aria-label="Toggle menu" style="pointer-events: auto; margin-left:12px;">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
        
        <div class="mobile-menu-overlay">
            <div class="mobile-menu-content">
                <button class="mobile-menu-close">&times;</button>
                <nav class="mobile-nav-links">
                    <a href="index.html" class="nav-item ${activePage === 'home' ? 'active' : ''}" data-i18n="Local Component.menu_item 1">Trang chủ</a>
                    <a href="service.html" class="nav-item ${activePage === 'service' ? 'active' : ''}" data-i18n="Local Component.menu_item 2">Dịch vụ</a>
                    <a href="portfolio.html" class="nav-item ${activePage === 'portfolio' ? 'active' : ''}" data-i18n="Local Component.menu_item 3">Hồ sơ năng lực</a>
                    
                    <div class="mobile-lang-switcher">
                        <button class="lang-switcher-btn active" data-lang="vi" onclick="setLanguage('vi')">Tiếng Việt</button>
                        <button class="lang-switcher-btn" data-lang="en" onclick="setLanguage('en')">English</button>
                    </div>
                </nav>
            </div>
        </div>
        `;

        // Mobile Menu Logic
        const btn = this.querySelector('.mobile-menu-btn');
        const overlay = this.querySelector('.mobile-menu-overlay');
        const closeBtn = this.querySelector('.mobile-menu-close');

        if(btn && overlay && closeBtn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Dropdown Logic
        const langDropdown = this.querySelector('.lang-switcher-dropdown');
        const langTrigger = this.querySelector('.lang-switcher-trigger');
        const langMenu = this.querySelector('.lang-switcher-menu');

        if (langTrigger && langMenu) {
            langTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                langMenu.classList.toggle('open');
                langTrigger.classList.toggle('active');
            });
            document.addEventListener('click', () => {
                langMenu.classList.remove('open');
                langTrigger.classList.remove('active');
            });
            window.addEventListener('close-lang-menu', () => {
                langMenu.classList.remove('open');
                langTrigger.classList.remove('active');
            });
        }
    }
}

customElements.define('impc-header', IMPCHeader);
