// Gallery Logic - Jekyll Automation Mode
document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // Determine Gallery Type
    const galleryType = gallery.getAttribute('data-type') || 'photography';

    let folderPath, images;

    if (galleryType === 'drawings') {
        folderPath = 'images/drawings/';
        images = window.drawingImages || [];
        console.log('Loaded drawings from manual list:', images);
    } else {
        // Default to photography
        folderPath = 'images/photography/';
        images = window.photographyImages || [];
        console.log('Loaded photography from manual list:', images);
    }

    // 2. Clear Loading Status
    gallery.innerHTML = '';

    // 3. Handle Empty Gallery
    if (!images || images.length === 0) {
        gallery.innerHTML = '<p style="text-align:center">No images found.</p>';
        return;
    }

    // 4. Render Images
    images.forEach((filename, index) => {
        // Outer Grid Item (Keeps the grid span logic)
        const item = document.createElement('div');
        item.className = 'gallery-item gallery-card'; // Combined classes

        // Inner Image Container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-image-container';

        const img = document.createElement('img');
        img.src = folderPath + filename;
        img.alt = filename;
        img.className = 'gallery-img';

        // Optimize LCP: Eager load first 4 images (above the fold), lazy load the rest
        if (index < 4) {
            img.loading = 'eager';
            img.fetchPriority = 'high';
        } else {
            img.loading = 'lazy';
        }

        imgContainer.appendChild(img);

        // Footer Actions
        const footer = document.createElement('div');
        footer.className = 'card-footer';
        footer.innerHTML = `
            <button class="card-action-btn download-btn" onclick="downloadGridImage('${folderPath + filename}', '${filename}', this)">
                <span class="material-icons">cloud_download</span>
            </button>
            <button class="card-action-btn share-btn" onclick="shareGridImage('${folderPath + filename}')">
                <span class="material-icons">share</span>
            </button>
        `;

        item.appendChild(imgContainer);
        item.appendChild(footer);
        gallery.appendChild(item);
    });

    // Re-init lightbox with new images
    if (window.initLightbox) window.initLightbox();

    // Global Grid Functions
    window.downloadGridImage = function (url, filename, btn) {
        // 1. Trigger Download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Animation
        btn.classList.add('pop');
        setTimeout(() => btn.classList.remove('pop'), 300);
    };

    window.shareGridImage = async function (url) {
        const fullUrl = window.location.origin + window.location.pathname + '#img=' + url.split('/').pop();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this image',
                    url: fullUrl
                });
            } catch (err) { console.log(err); }
        } else {
            try {
                await navigator.clipboard.writeText(fullUrl);
                alert('Link copied to clipboard!');
            } catch (err) { console.error(err); }
        }
    };

    // 5. Initialize Lightbox
    if (window.initLightbox) {
        window.initLightbox();
    }
});
