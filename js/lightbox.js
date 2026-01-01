// Lightbox Functionality - White Modal & Deep Linking
(function () {
    // Shared state
    let lightbox, lightboxImg, likeBtn, shareBtn, headerTitle;
    let images = [];
    let currentIndex = 0;

    // --- Deep Linking Helpers ---
    function getFilename(src) {
        const name = src.substring(src.lastIndexOf('/') + 1);
        return decodeURIComponent(name); // Ensure we work with clean names
    }

    function updateHash(index) {
        if (images[index]) {
            const filename = getFilename(images[index].src);
            // Encode again for URL safety
            history.replaceState(null, null, `#img=${encodeURIComponent(filename)}`);
        }
    }

    function checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#img=')) {
            // Decode the hash value to get the raw filename
            const filename = decodeURIComponent(hash.substring(5));

            // Compare decoded filenames
            const index = images.findIndex(img => getFilename(img.src) === filename);

            if (index !== -1) {
                console.log('Restoring image from hash:', filename);
                openLightbox(index);
            } else {
                console.warn('Image from hash not found:', filename);
            }
        }
    }

    // --- Core Functions ---
    function openLightbox(index) {
        currentIndex = index;
        if (lightbox) {
            lightbox.style.display = 'flex'; // Use flex for centering
            // Force reflow for animation
            void lightbox.offsetWidth;
            lightbox.classList.add('active');

            updateLightboxContent();
            document.body.style.overflow = 'hidden'; // Disable scroll
            updateHash(index);
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
                clearHash();
            }, 300);
        }
    }

    function updateLightboxContent() {
        if (!images[currentIndex]) return;
        const imgToCheck = images[currentIndex];

        if (lightboxImg) {
            lightboxImg.src = imgToCheck.src;

            // Load Count
            const filename = getFilename(imgToCheck.src);
            const downloadCount = localStorage.getItem(`download_count_${filename}`) || 0;
            updateDownloadButton(downloadCount);

            updateHash(currentIndex);
        }
    }

    function updateDownloadButton(count) {
        const btn = document.getElementById('lightbox-download');
        if (!btn) return;
        const countSpan = btn.querySelector('.action-count');
        if (countSpan) countSpan.textContent = count;
    }

    function downloadImage() {
        const imgToCheck = images[currentIndex];
        if (!imgToCheck) return;

        const filename = getFilename(imgToCheck.src);

        // 1. Trigger Download
        const link = document.createElement('a');
        link.href = imgToCheck.src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 2. Count Logic
        let count = parseInt(localStorage.getItem(`download_count_${filename}`) || 0);
        count++;
        localStorage.setItem(`download_count_${filename}`, count);

        updateDownloadButton(count);

        // 3. Sync Grid
        const gridBtn = document.querySelector(`.download-btn[onclick*="${filename}"]`);
        if (gridBtn) {
            const countSpan = gridBtn.querySelector('.action-count');
            if (countSpan) countSpan.textContent = count;
        }
    }

    async function shareImage() {
        const imgToCheck = images[currentIndex];
        if (!imgToCheck) return;

        const url = window.location.origin + window.location.pathname + '#img=' + getFilename(imgToCheck.src);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this photo',
                    url: url
                });
            } catch (err) { console.log(err); }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                // Visual feedback
                const shareBtn = document.getElementById('lightbox-share');
                if (shareBtn) {
                    const originalIcon = shareBtn.innerHTML;
                    shareBtn.innerHTML = 'check';
                    setTimeout(() => shareBtn.innerHTML = originalIcon, 2000);
                }
            } catch (err) { console.error(err); }
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

    // --- Initialization ---
    window.initLightbox = function () {
        // 1. Inject HTML if missing (The White Modal Structure)
        if (!document.getElementById('lightbox')) {
            const html = `
            <div id="lightbox" class="lightbox-modal">
                <div class="lightbox-content-wrapper">
                    <!-- Header -->
                    <div class="lightbox-header">
                        <span class="lightbox-title"></span>
                        <span class="lightbox-close material-icons">close</span>
                    </div>

                    <!-- Body -->
                    <div class="lightbox-body">
                        <img class="lightbox-img" id="lightbox-img">
                    </div>

                    <!-- Footer -->
                    <div class="lightbox-footer">
                        <div class="footer-left">
                            <button class="nav-btn prev-btn">Previous</button>
                            <button id="lightbox-download" class="action-btn download-btn">
                                <span class="material-icons">cloud_download</span>
                                <span class="action-count">0</span>
                            </button>
                        </div>
                        
                        <div class="footer-right">
                            <button id="lightbox-share" class="action-btn material-icons">share</button>
                            <button class="nav-btn next-btn">Next</button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);

            // Bind Elements
            lightbox = document.getElementById('lightbox');
            lightboxImg = document.getElementById('lightbox-img');
            const downloadBtn = document.getElementById('lightbox-download');
            const shareBtn = document.getElementById('lightbox-share');

            // Bind Events
            document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            document.querySelector('.prev-btn').addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
            document.querySelector('.next-btn').addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
            if (downloadBtn) downloadBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadImage(); });
            if (shareBtn) shareBtn.addEventListener('click', (e) => { e.stopPropagation(); shareImage(); });

            // Close on backdrop click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            // Keyboard
            document.addEventListener('keydown', (e) => {
                if (lightbox && lightbox.style.display !== 'none') {
                    if (e.key === 'ArrowLeft') showPrev();
                    if (e.key === 'ArrowRight') showNext();
                    if (e.key === 'Escape') closeLightbox();
                }
            });
        }

        // 2. Refresh Image List
        images = Array.from(document.querySelectorAll('.gallery-item img, .gallery-card img')); // Flexible selector

        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            // Click on image opens lightbox
            // If image is inside a card-image-container, we might want the container to trigger it
            // checking parent
            const container = img.closest('.card-image-container') || img;
            container.onclick = () => openLightbox(index);
        });

        // 3. Check Hash
        checkHash();
    };

    // Auto Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initLightbox);
    } else {
        window.initLightbox();
    }

})();
