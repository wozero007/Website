// 1. MANUAL MODE (Works on your Computer)
// ----------------------------------------
// Add your image filenames here normally.
let photographyImages = [
    "DSC00055 (1) - Copy.jpg",
];

// 2. AUTOMATIC MODE (Works on GitHub Pages)
// ----------------------------------------
// If you host this on GitHub, set 'enabled' to TRUE below.
// It will then automatically find your images using the GitHub API.
const githubConfig = {
    enabled: true,              // <--- CHANGE TO TRUE FOR GITHUB PAGES
    username: 'manjunathamr',    // Your GitHub Username
    repo: 'Website',             // Your Repository Name
    folder: 'images/photography'
};


// ============================================
// LOGIC (Do not edit below)
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // A. FETCH FROM GITHUB (If Enabled)
    if (githubConfig.enabled) {
        gallery.innerHTML = '<p style="text-align:center; color:#888;">Scanning GitHub Folder...</p>';
        try {
            const url = `https://api.github.com/repos/${githubConfig.username}/${githubConfig.repo}/contents/${githubConfig.folder}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

            const data = await response.json();

            // Replace manual list with found images
            photographyImages = data
                .filter(file => file.type === 'file' && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
                .map(file => file.name);

            console.log(`Auto-loaded ${photographyImages.length} images from GitHub.`);

        } catch (e) {
            console.error(e);
            gallery.innerHTML = `
                <div style="text-align:center; color:red; padding:20px">
                    <p>Automatic loading failed.</p>
                    <small>Check 'githubConfig' in js/gallery.js</small>
                </div>
            `;
            return;
        }
    }

    // B. RENDER GALLERY
    gallery.innerHTML = ''; // Clear status
    const folderPath = 'images/photography/';

    if (photographyImages.length === 0) {
        gallery.innerHTML = '<p style="text-align:center">No images found.</p>';
        return;
    }

    photographyImages.forEach(filename => {
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

    if (window.initLightbox) window.initLightbox();
});
