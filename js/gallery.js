// Gallery Logic - Static List Mode
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // 1. Get Images from Global List (loaded by image_list.js)
    const images = window.photographyImages || [];
    const folderPath = 'images/photography/';

    // 2. Clear Loading Status
    gallery.innerHTML = '';

    // 3. Handle Empty Gallery
    if (images.length === 0) {
        gallery.innerHTML = '<p style="text-align:center">No images found.</p>';
        return;
    }

    // 4. Render Images
    images.forEach(filename => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = folderPath + filename;
        img.alt = filename;
        img.className = 'gallery-img';
        img.loading = 'lazy'; // Performance optimization

        // Add onclick for Lightbox (Redundant if initLightbox handles it, but safe)
        if (window.initLightbox) {
            // We rely on initLightbox to bind events, but we need to wait for render
        }

        item.appendChild(img);
        gallery.appendChild(item);
    });

    // 5. Initialize Lightbox
    // Now that images are in the DOM, we can run the lightbox init
    if (window.initLightbox) {
        window.initLightbox();
    } else {
        console.warn('Lightbox script not loaded');
    }
});
