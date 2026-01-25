// Main Script Loader
// Loads the modular scripts

function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Execute in order
    document.head.appendChild(script);
}

// Load Modules
loadScript('js/protect-images.js');
loadScript('js/mathjax.js');
loadScript('js/header.js');
loadScript('js/banner.js');
loadScript('js/footer.js');

// Only load lightbox on gallery pages
if (window.location.pathname.includes('photography') || window.location.pathname.includes('drawings')) {
    loadScript('js/lightbox.js');
}
