// Inject Content Footer Globally
(function () {
    function injectFooter() {
        const footerHTML = `
        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-email">manjuoffi@gmail.com</div>
                <div class="social-links">
                    <!-- LinkedIn -->
                    <a href="https://www.linkedin.com/in/manjuoffi/" target="_blank" class="social-icon" aria-label="LinkedIn">
                        <img src="images/icons/linkedin.png" alt="LinkedIn">
                    </a>
                    <!-- ORCID -->
                    <a href="https://orcid.org/0000-0002-3687-9943" target="_blank" class="social-icon" aria-label="ORCID">
                         <img src="images/icons/orcid.svg" alt="ORCID">
                    </a>
                    <!-- Google Scholar -->
                    <a href="https://scholar.google.com/citations?user=placeholder" target="_blank" class="social-icon" aria-label="Google Scholar">
                        <img src="images/icons/google-scholar.svg" alt="Google Scholar">
                    </a>
                </div>
            </div>
        </footer>
        `;

        // Append footer to the body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
})();
