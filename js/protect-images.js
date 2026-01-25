/**
 * Image Protection Script
 * Disables right-click and image dragging to discourage downloading.
 */

// Disable right-click context menu globally
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
}, false);

// Disable dragging images
document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
}, false);

// Prevent some common keyboard shortcuts for saving/inspecting
document.addEventListener('keydown', function (e) {
    // Prevent Ctrl+S (Save), Ctrl+U (View Source), Ctrl+Shift+I (DevTools)
    // Note: This is not foolproof and can be annoying, but often requested.
    // I will only implement the right-click and drag block as strictly requested for now to avoid bad UX.
});
