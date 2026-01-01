// Inject Header and Favicon Globally
(function () {
    function injectHeader() {
        // 1. Inject Favicon
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = 'images/logo.jpg';

        // 2. Identify Active Page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isActive = (page) => currentPage === page ? 'active' : '';

        // 3. Header HTML Template
        const headerHTML = `
        <!-- Header / Navbar -->
        <header id="navbar" class="header">
            <div class="header-container">
                <div class="mobile-only">
                    <button class="icon-btn" id="menu-btn" aria-label="Open menu">
                        <span class="material-icons">menu</span>
                    </button>
                </div>
                <a href="index.html" class="brand-link">
                    <img src="images/logo.jpg" alt="Logo" class="brand-logo">
                    MANJUNATHA M R
                </a>
                <div class="spacer"></div>
                <nav class="desktop-nav">
                    <ul class="nav-links">
                        <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
                        <li><a href="cv.html" class="${isActive('cv.html')}">CV</a></li>
                        <li><a href="photography.html" class="${isActive('photography.html')}">ಛಾಯಾಗ್ರಹಣ (Photography)</a></li>
                        <li><a href="drawings.html" class="${isActive('drawings.html')}">ರೇಖಾಚಿತ್ರಕೆ (Drawings)</a></li>
                        <li><a href="writings.html" class="${isActive('writings.html')}">ಬರಹಗಳು (Writings)</a></li>
                    </ul>
                </nav>
                <div class="actions" style="display: none;"></div>
            </div>
        </header>

        <!-- Mobile Sidebar / Drawer -->
        <div id="sidebar-overlay" class="sidebar-overlay"></div>
        <aside id="sidebar" class="sidebar">
            <div class="sidebar-header">
                <span class="brand-text">MANJUNATHA M R</span>
                <button id="close-btn" class="icon-btn" aria-label="Close menu">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <nav class="mobile-nav">
                <ul class="mobile-nav-links">
                    <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
                    <li><a href="cv.html" class="${isActive('cv.html')}">CV</a></li>
                    <li><a href="photography.html" class="${isActive('photography.html')}">Photography</a></li>
                    <li><a href="drawings.html" class="${isActive('drawings.html')}">Drawings</a></li>
                    <li><a href="writings.html" class="${isActive('writings.html')}">Writings</a></li>
                </ul>
            </nav>
        </aside>
        `;

        // 4. Insert Header at the start of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Re-initialize event listeners for the newly injected elements
        initializeHeaderLogic();
    }

    function initializeHeaderLogic() {
        const menuBtn = document.getElementById('menu-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const closeBtn = document.getElementById('close-btn');

        // Function to open sidebar
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        // Function to close sidebar
        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        // Event Listeners
        if (menuBtn) menuBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // Scroll Effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            }
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
})();
