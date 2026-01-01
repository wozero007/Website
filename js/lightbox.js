// Lightbox Functionality
(function () {
    // Shared state
    let lightbox, lightboxImg, caption;
    let images = [];
    let currentIndex = 0;

    // Helper functions
    function openLightbox(index) {
        currentIndex = index;
        if (lightbox) {
            lightbox.style.display = 'block';
            updateLightboxContent();
            document.body.style.overflow = 'hidden'; // Disable scroll
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Enable scroll
        }
    }

    function updateLightboxContent() {
        const imgToCheck = images[currentIndex];
        if (imgToCheck && lightboxImg) {
            lightboxImg.src = imgToCheck.src;
            caption.innerHTML = imgToCheck.alt || '';
        }
    }

    function showNext() {
        if (images.length > 0) {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightboxContent();
        }
    }

    function showPrev() {
        if (images.length > 0) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightboxContent();
        }
    }

    // Global Init Function
    window.initLightbox = function () {
        const gallery = document.querySelector('.gallery');
        if (!gallery) return;

        // 1. Create UI (Only if it doesn't exist)
        if (!document.getElementById('lightbox')) {
            const lightboxHTML = `
            <div id="lightbox" class="lightbox-modal">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-content" id="lightbox-img">
                <a class="lightbox-prev">&#10094;</a>
                <a class="lightbox-next">&#10095;</a>
                <div id="lightbox-caption" class="lightbox-caption"></div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);

            // Get method-scoped references (freshly created)
            lightbox = document.getElementById('lightbox');
            lightboxImg = document.getElementById('lightbox-img');
            caption = document.getElementById('lightbox-caption');
            const closeBtn = document.querySelector('.lightbox-close');
            const prevBtn = document.querySelector('.lightbox-prev');
            const nextBtn = document.querySelector('.lightbox-next');

            // Attach UI Event Listeners (Once)
            closeBtn.addEventListener('click', closeLightbox);
            nextBtn.addEventListener('click', showNext);
            prevBtn.addEventListener('click', showPrev);

            // Close on outside click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (lightbox && lightbox.style.display === 'block') {
                    if (e.key === 'ArrowLeft') showPrev();
                    if (e.key === 'ArrowRight') showNext();
                    if (e.key === 'Escape') closeLightbox();
                }
            });
        }

        // 2. Bind Images (Refresh logic)
        // Find all images currently in the gallery
        images = Array.from(document.querySelectorAll('.gallery-item img'));

        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            // Use onclick to overwrite any previous listeners if re-binding
            img.onclick = () => openLightbox(index);
        });
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initLightbox);
    } else {
        window.initLightbox();
    }
})();
