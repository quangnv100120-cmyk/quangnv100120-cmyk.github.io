class IMPCFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="footer" id="footer">
            <div class="footer-content reveal">
                <div class="footer-top">
                    <div class="footer-brand">
                        <img src="./assets/fa1be58f10fbfb652eb1842bacda630811f46632.svg" alt="IMPC Logo" class="footer-logo">
                        <p class="footer-company-name">IMPC DESIGN AND TECHNICAL MANAGEMENT CORPORATION</p>
                    </div>
                    <nav class="footer-nav">
                        <a href="index.html">Home</a>
                        <a href="index.html#about">About us</a>
                        <a href="service.html">Service</a>
                        <a href="portfolio.html">Portfolio</a>
                    </nav>
                </div>
                
                <div class="footer-line"></div>
                
                <div class="footer-contact">
                    <div class="contact-item">
                        <img src="./assets/d23fa2ba5979eb11cbb0b1c09eb06b54174092b3.svg" class="contact-icon" alt="Location" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'%23fff\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath d=\\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\\'/%3E%3C/svg%3E'">
                        <p class="contact-text">Số 15 đường D2, khu phức hợp Saigon Pearl, phường 22, quận Bình Thạnh, Thành phố Hồ Chí Minh</p>
                    </div>
                    <div class="contact-item">
                        <img src="./assets/b24fa2ba5979eb11cbb0b1c09eb06b54174092b3.svg" class="contact-icon" alt="Phone" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'%23fff\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath d=\\'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z\\'/%3E%3C/svg%3E'">
                        <p class="contact-text">+84 28 77703399</p>
                    </div>
                    <div class="contact-item">
                        <img src="./assets/c23fa2ba5979eb11cbb0b1c09eb06b54174092b3.svg" class="contact-icon" alt="Email" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'%23fff\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath d=\\'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z\\'/%3E%3C/svg%3E'">
                        <p class="contact-text">contact@impc.vn</p>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}
customElements.define('impc-footer', IMPCFooter);
