// Gallery Logic - Jekyll Automation Mode
document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const folderPath = 'images/photography/';
    const images = window.photographyImages || [];
    console.log('Loaded images from manual list:', images);

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
