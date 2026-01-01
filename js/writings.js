document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Viewer Elements
    const viewerHTML = `
    <div id="writing-viewer" class="writing-viewer">
        <div class="viewer-container">
            <!-- Header -->
            <div class="viewer-header">
                <h2 id="viewer-title" class="viewer-title">Title</h2>
                <div class="viewer-header-icons">
                    <button id="share-btn" class="icon-btn" aria-label="Share">
                        <span class="material-icons">share</span>
                    </button>
                    <button id="close-viewer" class="icon-btn" aria-label="Close">&times;</button>
                </div>
            </div>
            
            <!-- Content Body -->
            <div id="viewer-body-container" class="viewer-body-container">
                <div id="viewer-body" class="viewer-body">
                    <!-- Content injected here -->
                </div>
            </div>

            <!-- Footer / Navigation -->
            <div class="viewer-footer">
                <button id="prev-btn" class="nav-btn disabled" aria-label="Previous">
                    <span class="material-icons">chevron_left</span> Previous
                </button>
                <div class="spacer"></div>
                <button id="next-btn" class="nav-btn disabled" aria-label="Next">
                    Next <span class="material-icons">chevron_right</span>
                </button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', viewerHTML);

    // DOM Elements
    const viewer = document.getElementById('writing-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerBody = document.getElementById('viewer-body');
    const closeBtn = document.getElementById('close-viewer');
    const shareBtn = document.getElementById('share-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // State
    let currentItems = [];
    let currentIndex = -1;
    let isInternalNavigation = false; // To prevent infinite loops with hash updates

    // 2. Initialize Links
    const links = document.querySelectorAll('.writing-list-item');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Just set the hash, let the hashchange handler do the work
            const id = link.id;
            if (id) {
                window.location.hash = id;
            }
        });
    });

    // 3. Hash Change Router (Central Logic)
    window.addEventListener('hashchange', handleHashChange);

    // Initial Load
    handleHashChange();

    function handleHashChange() {
        if (isInternalNavigation) {
            isInternalNavigation = false;
            return;
        }

        // Parse Hash: #itemId or #itemId?sub=0
        const rawHash = window.location.hash.substring(1); // Remove #
        if (!rawHash) {
            closeViewerUI();
            return;
        }

        const [itemId, query] = rawHash.split('?');
        const urlParams = new URLSearchParams(query);
        const subIndex = urlParams.get('sub');

        // Find Item
        const item = document.getElementById(itemId);
        if (item && item.classList.contains('writing-list-item')) {
            const category = item.getAttribute('data-category');

            // Build Context
            currentItems = Array.from(document.querySelectorAll(`.writing-list-item[data-category="${category}"]`));
            currentIndex = currentItems.findIndex(i => i.id === itemId);

            // Open Viewer
            openViewerUI(item, category, subIndex);
        }
    }

    // 4. Viewer Logic
    function openViewerUI(item, category, subIndex) {
        const src = item.getAttribute('data-src');
        const title = item.querySelector('.writing-list-title').textContent;
        const subContentData = item.getAttribute('data-sub');

        // Show Viewer
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Update Footer State
        if (subIndex !== null) {
            // In sub-content mode, disable main nav
            prevBtn.classList.add('disabled');
            nextBtn.classList.add('disabled');
        } else {
            prevBtn.classList.toggle('disabled', currentIndex === 0);
            nextBtn.classList.toggle('disabled', currentIndex === currentItems.length - 1);
        }

        // Styling Mode
        viewerBody.className = 'viewer-body';
        viewerBody.classList.add(category === 'poems' ? 'mode-poem' : 'mode-prose');

        // Determine what to load
        if (subIndex !== null && subContentData) {
            // Load Sub-content
            try {
                const subs = JSON.parse(subContentData);
                const subItem = subs[parseInt(subIndex)];
                if (subItem) {
                    viewerTitle.textContent = subItem.title;
                    loadContent(subItem.src, true); // true = shows Back button
                    return;
                }
            } catch (e) {
                console.error('Invalid sub-content data');
            }
        }

        // Load Main Content
        viewerTitle.textContent = title;
        loadContent(src, false, subContentData);
    }

    function loadContent(url, isSub, subDataJson) {
        viewerBody.innerHTML = '<div class="loader">Loading...</div>';

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load content');
                return res.text();
            })
            .then(text => {
                // Math Protection
                const mathBlocks = [];
                const protectedText = text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g, (match) => {
                    mathBlocks.push(match);
                    return `PRESERVED_MATH_BLOCK_${mathBlocks.length - 1}`;
                });

                // Markdown Parse
                let htmlContent = marked.parse(protectedText);

                // Restore Math
                htmlContent = htmlContent.replace(/PRESERVED_MATH_BLOCK_(\d+)/g, (match, index) => {
                    return mathBlocks[parseInt(index, 10)];
                });

                viewerBody.innerHTML = htmlContent;

                // Append Extra Elements
                if (isSub) {
                    // Back Button
                    const backWrap = document.createElement('div');
                    backWrap.className = 'viewer-sub-content';
                    backWrap.innerHTML = `
                        <button class="sub-content-btn">
                            <span class="material-icons">arrow_back</span> Back to Original
                        </button>`;
                    backWrap.querySelector('button').onclick = () => {
                        // Go back to main item hash
                        const hash = window.location.hash.split('?')[0];
                        window.location.hash = hash;
                    };
                    viewerBody.appendChild(backWrap);
                } else if (subDataJson) {
                    // Sub-content Links
                    try {
                        const subs = JSON.parse(subDataJson);
                        const subWrap = document.createElement('div');
                        subWrap.className = 'viewer-sub-content';

                        subs.forEach((sub, idx) => {
                            const btn = document.createElement('button');
                            btn.className = 'sub-content-btn';
                            btn.innerHTML = `<span class="material-icons">description</span> ${sub.title}`;
                            btn.onclick = () => {
                                // Update hash to ?sub=idx
                                const currentHash = window.location.hash.split('?')[0];
                                window.location.hash = `${currentHash}?sub=${idx}`;
                            };
                            subWrap.appendChild(btn);
                        });
                        viewerBody.appendChild(subWrap);
                    } catch (e) { }
                }

                // Trigger MathJax
                if (window.MathJax) {
                    MathJax.typesetPromise([viewerBody]).catch((err) => console.log(err));
                }
            })
            .catch(err => {
                viewerBody.innerHTML = `<p class="error">Error: ${err.message}</p>`;
            });
    }

    function closeViewerUI() {
        viewer.classList.remove('active');
        document.body.style.overflow = '';
        viewerBody.innerHTML = '';

        // Clear hash if it's currently set (without triggering another hashchange if possible, 
        // but removing char requires history API)
        if (window.location.hash) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    }

    // 5. Controls
    closeBtn.addEventListener('click', () => {
        // Clearing hash triggers handleHashChange -> closeViewerUI
        history.pushState("", document.title, window.location.pathname + window.location.search);
        // Manually close just in case hash was already empty or pushState doesn't trigger hashchange
        closeViewerUI();
    });

    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) closeBtn.click();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            const prevItem = currentItems[currentIndex - 1];
            if (prevItem.id) window.location.hash = prevItem.id;
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < currentItems.length - 1) {
            const nextItem = currentItems[currentIndex + 1];
            if (nextItem.id) window.location.hash = nextItem.id;
        }
    });

    // 6. Share
    shareBtn.addEventListener('click', async () => {
        const title = viewerTitle.textContent;
        const url = window.location.href; // Captures current hash including ?sub=...
        const text = `Read "${title}" on my website!`;

        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) { console.log(err); }
        } else {
            navigator.clipboard.writeText(url).then(() => {
                const icon = shareBtn.querySelector('.material-icons');
                const original = icon.textContent;
                icon.textContent = 'check';
                setTimeout(() => icon.textContent = original, 2000);
            });
        }
    });

    // 7. Mobile Accordion Logic
    const columns = document.querySelectorAll('.writing-column');
    columns.forEach(col => {
        const title = col.querySelector('.column-title');
        if (title) {
            title.addEventListener('click', () => {
                // Toggle active state
                // Determine if we are on mobile (optional check, or just let CSS handle it)
                if (window.innerWidth <= 992) {
                    col.classList.toggle('active');
                }
            });
        }
    });
});
