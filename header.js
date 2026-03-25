class IMPCHeader extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active') || 'home';

        this.innerHTML = `
        <div class="header flex justify-between items-center" style="position: absolute; top: 0; left: 0; width: 100%; padding: 32px 80px; display: flex; justify-content: space-between; align-items: center; z-index: 50; box-sizing: border-box; pointer-events: none;">
            <a href="index.html" class="logo" style="display: flex; align-items: center; flex-shrink: 0; pointer-events: auto;">
                <img src="./assets/fa1be58f10fbfb652eb1842bacda630811f46632.svg" alt="IMPC Logo" style="width: 108px; height: 32px; object-fit: contain; display: block;">
            </a>
            <nav class="nav-pill" style="pointer-events: auto;">
                <a href="index.html" class="nav-item ${activePage === 'home' ? 'active' : ''}">HOME</a>
                <a href="service.html" class="nav-item ${activePage === 'service' ? 'active' : ''}">SERVICE</a>
                <a href="portfolio.html" class="nav-item ${activePage === 'portfolio' ? 'active' : ''}">PORTFOLIO</a>
            </nav>
        </div>
        `;
    }
}

customElements.define('impc-header', IMPCHeader);
