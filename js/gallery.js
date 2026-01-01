// Gallery Logic - Jekyll Automation Mode
document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    let images = [];
    const folderPath = 'images/photography/';

    // 1. Try to fetch the auto-generated list (from GitHub Pages)
    try {
        const response = await fetch('photography_images.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Failed to fetch JSON');

        // Parsing check - if local, it might return the raw Liquid string, so we need to be careful
        const text = await response.text();
        // If it contains "---", it's likely the raw Jekyll file (local dev), so throw
        if (text.includes('---')) throw new Error('Local Jekyll template detected');

        images = JSON.parse(text);
        console.log('Loaded images from GitHub Pages automation:', images);

    } catch (e) {
        console.warn('Automation not active (running locally or build pending). Using manual list.');
        // Fallback to manual list from image_list.js
        images = window.photographyImages || [];
    }

    // 2. Clear Loading Status
    gallery.innerHTML = '';

    // 3. Handle Empty Gallery
    if (!images || images.length === 0) {
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
        img.loading = 'lazy';

        item.appendChild(img);
        gallery.appendChild(item);
    });

    // 5. Initialize Lightbox
    if (window.initLightbox) {
        window.initLightbox();
    }
});
