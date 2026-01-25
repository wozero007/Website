// Inject Banner Dynamically
(function () {
    function injectBanner() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Configuration for pages
        const pageDetails = {
            'index.html': {
                title: 'ಮಂಜುನಾಥ ಎಂ ಆರ್',
                image: 'images/banner.avif'
            },
            'cv.html': {
                title: 'Curriculum Vitae',
                image: 'images/cvbanner.avif'
            },
            'photography.html': {
                title: 'ಛಾಯಾಗ್ರಹಣ (Photography)',
                image: 'images/photography/Thumbs/DSC02495 (1).avif'
            },
            'drawings.html': {
                title: 'ರೇಖಾಚಿತ್ರಿಕೆ (Drawings)',
                image: 'images/drawings/drawings-banner.avif'
            },
            'writings.html': {
                title: 'ಬರಹಗಳು (Writings)',
                image: 'images/banner.avif'
            }
        };

        // Get details for current page or default to index
        const currentDetail = pageDetails[currentPage] || pageDetails['index.html'];

        const bannerHTML = `
        <section id="banner" class="banner" style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${currentDetail.image}');">
            <div class="banner-content">
                <h1>${currentDetail.title}</h1>
            </div>
        </section>
        `;

        // Insert Banner after the header but BEFORE the main content container
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforebegin', bannerHTML);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
        injectBanner();
    }
})();
