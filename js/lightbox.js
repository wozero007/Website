// Lightbox Functionality - White Modal & Deep Linking
(function () {
    // Shared state
    let lightbox, lightboxImg, likeBtn, shareBtn, headerTitle;
    let images = [];
    let currentIndex = 0;
    let useOriginalSource = false; // State to toggle between Thumb and Original

    // --- Deep Linking Helpers ---
    function getFilename(src) {
        const name = src.substring(src.lastIndexOf('/') + 1);
        return decodeURIComponent(name); // Returns just 'image.avif'
    }

    function getOriginalPath(fullSrc) {
        // User wants: photography.html#img=photography/Originals/20251015_100611.jpg
        // We need to extract the part after 'images/' or just use the relative path if we can.
        // Assuming fullSrc is absolute or relative. Let's try to make it relative to the domain root or images folder.
        // If fullSrc includes "images/photography/Originals/", we can extract from "images/"?
        // User example: "photography/Originals/..." implies he might mean relative to "images/"?
        // Wait, user said: "photography.html#img=photography/Originals/20251015_100611.jpg"
        // But the folder path in gallery.js is "images/photography/Originals/".
        // Let's just use the fullSrc but strip the origin if absolute.

        let path = fullSrc;
        if (path.startsWith(window.location.origin)) {
            path = path.replace(window.location.origin + '/', '');
        }
        // Remove leading slash if any
        if (path.startsWith('/')) path = path.substring(1);

        // If it starts with "images/", user example didn't have "images/"? 
        // User wrote: "photography.html#img=photography/Originals/20251015_100611.jpg"
        // My folder structure is images/photography/Originals.
        // I will just use the path relative to the root, which is "images/photography/Originals/...".
        // If the user specifically wants "photography/Originals/...", I can strip "images/".
        // Let's try to keep it simple: relative path from root.

        // Adjust to user request exact format if possible, but path correctness matters more.
        return decodeURIComponent(path);
    }

    function updateHash(index) {
        if (images[index]) {
            let hashValue;
            if (useOriginalSource && images[index].dataset.fullSrc) {
                // Original Mode Hash. 
                // We want: images/photography/Originals/filename.jpg (or similar)
                hashValue = getOriginalPath(images[index].dataset.fullSrc);
            } else {
                // Thumb Mode Hash.
                // We want: filename.avif
                const src = images[index].src; // Thumb src
                hashValue = getFilename(src);
            }
            // Encode again for URL safety
            history.replaceState(null, null, `#img=${encodeURIComponent(hashValue)}`);
        }
    }

    function clearHash() {
        // Clear hash without page reload
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    function checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#img=')) {
            // Decode the hash value
            const val = decodeURIComponent(hash.substring(5));

            // Heuristic: If it contains slash '/', it's likely a path (Original).
            // If it's just a filename, it's a Thumb.
            const isOriginalHash = val.includes('/');

            let index = -1;

            if (isOriginalHash) {
                // Compare with fullSrc logic
                index = images.findIndex(img => {
                    const full = getOriginalPath(img.dataset.fullSrc || '');
                    return full === val || img.dataset.fullSrc.endsWith(val);
                });
                if (index !== -1) {
                    console.log('Restoring Original from hash:', val);
                    openLightbox(index, true); // PREFER ORIGINAL
                    return;
                }
            } else {
                // Compare with thumb filename
                index = images.findIndex(img => getFilename(img.src) === val);
                if (index !== -1) {
                    console.log('Restoring Thumb from hash:', val);
                    openLightbox(index, false); // PREFER THUMB
                    return;
                }
            }
            console.warn('Image from hash not found:', val);
        }
    }

    // --- Core Functions ---
    // Added preferOriginal parameter
    function openLightbox(index, preferOriginal = false) {
        currentIndex = index;
        useOriginalSource = preferOriginal; // Set the mode

        if (lightbox) {
            lightbox.style.display = 'flex'; // Use flex for centering
            // Force reflow for animation
            void lightbox.offsetWidth;
            lightbox.classList.add('active');

            updateLightboxContent();
            document.body.style.overflow = 'hidden'; // Disable scroll
            // Update hash immediately
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
                useOriginalSource = false; // Reset state
            }, 300);
        }
    }

    function updateLightboxContent() {
        if (!images[currentIndex]) return;
        const imgToCheck = images[currentIndex];
        const titleEl = document.querySelector('.lightbox-title');

        if (lightboxImg) {
            // Logic:
            // If useOriginalSource is true AND fullSrc exists -> show fullSrc (Original JPG)
            // Else -> show src (Thumb AVIF)
            if (useOriginalSource && imgToCheck.dataset.fullSrc) {
                // Visual feedback: accessing original
                lightboxImg.src = imgToCheck.dataset.fullSrc;
                if (titleEl) titleEl.textContent = "Viewing original image";
            } else {
                lightboxImg.src = imgToCheck.src;
                if (titleEl) titleEl.textContent = "Viewing compressed image`";
            }

            // Sync Hash logic handled in openLightbox / click / next / prev
            // But we should update it here too if index changes
            updateHash(currentIndex);
        }
    }

    function downloadImage() {
        const imgToCheck = images[currentIndex];
        if (!imgToCheck) return;

        // Download logic: always download Original if available? 
        // Or respect view? User restored code had specific preference.
        // Let's download what is being viewed mostly.
        const srcToUse = (useOriginalSource && imgToCheck.dataset.fullSrc) ? imgToCheck.dataset.fullSrc : (imgToCheck.dataset.fullSrc || imgToCheck.src);
        const filename = getFilename(srcToUse);

        // 1. Trigger Download
        const link = document.createElement('a');
        link.href = srcToUse;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function shareImage() {
        const imgToCheck = images[currentIndex];
        if (!imgToCheck) return;

        // Share the CURRENT hash (Deep link)
        // If viewing original, share original link.
        let val;
        if (useOriginalSource && imgToCheck.dataset.fullSrc) {
            val = getOriginalPath(imgToCheck.dataset.fullSrc);
        } else {
            val = getFilename(imgToCheck.src);
        }

        const url = window.location.origin + window.location.pathname + '#img=' + encodeURIComponent(val);

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
                            <!-- Download removed -->
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
            const shareBtn = document.getElementById('lightbox-share');

            // Bind Events
            document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            document.querySelector('.prev-btn').addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
            document.querySelector('.next-btn').addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
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
            // Click on image opens lightbox in THUMB mode (false)
            // checking parent
            const container = img.closest('.card-image-container') || img;
            container.onclick = () => openLightbox(index, false);
        });

        // 3. Check Hash
        checkHash();
    };

    // Public API to open lightbox by URL (for View Original button)
    window.openLightboxByUrl = function (url, preferOriginal = false) {
        // Ensure lightbox is initialized
        if (!images || images.length === 0) {
            if (window.initLightbox) window.initLightbox();
        }

        // Find index. The URL passed is the full URL from dataset.fullSrc
        // We need to compare it with the images in our list.
        const index = images.findIndex(img => {
            const imgSrc = img.dataset.fullSrc || img.src;
            // Precise match or ends with match
            return imgSrc === url || imgSrc.endsWith(url) || url.endsWith(imgSrc);
        });

        if (index !== -1) {
            openLightbox(index, preferOriginal);
        } else {
            console.warn('Image not found in lightbox list:', url);
        }
    };

    // Auto Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initLightbox);
    } else {
        window.initLightbox();
    }

})();
