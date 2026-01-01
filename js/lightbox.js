// Lightbox Functionality
(function () {
    function initLightbox() {
        // Only run if we are on a page with a gallery
        const gallery = document.querySelector('.gallery');
        if (!gallery) return;

        // Create Lightbox HTML elements
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

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        const caption = document.getElementById('lightbox-caption');

        const images = Array.from(document.querySelectorAll('.gallery-item img'));
        let currentIndex = 0;

        function openLightbox(index) {
            currentIndex = index;
            lightbox.style.display = 'block';
            updateLightboxContent();
            document.body.style.overflow = 'hidden'; // Disable scroll
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Enable scroll
        }

        function updateLightboxContent() {
            const imgToCheck = images[currentIndex];
            if (imgToCheck) {
                lightboxImg.src = imgToCheck.src;
                caption.innerHTML = imgToCheck.alt || '';
            }
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightboxContent();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightboxContent();
        }

        // Event Listeners
        images.forEach((img, index) => {
            img.style.cursor = 'pointer'; // Make images look clickable
            img.addEventListener('click', () => {
                openLightbox(index);
            });
        });

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
            if (lightbox.style.display === 'block') {
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }
})();
