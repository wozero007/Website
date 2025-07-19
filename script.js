// Function to load and insert the navigation bar
async function loadNavbar() {
    try {
        const response = await fetch('navbar.html'); // Fetch the navbar HTML
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const navbarHtml = await response.text();
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            navbarPlaceholder.innerHTML = navbarHtml; // Insert the HTML into the placeholder

            // --- Add event listeners for responsive navigation after navbar is loaded ---
            const menuToggle = document.getElementById('menu-toggle');
            const mainNav = document.getElementById('main-nav');

            if (menuToggle && mainNav) {
                menuToggle.addEventListener('click', () => {
                    menuToggle.classList.toggle('open');
                    mainNav.classList.toggle('open');
                });

                // Close menu when a navigation link is clicked (for smooth scrolling)
                mainNav.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        menuToggle.classList.remove('open');
                        mainNav.classList.remove('open');
                    });
                });

                // Close menu when clicking outside of it (optional overlay or document click)
                document.addEventListener('click', (event) => {
                    // Check if the click is outside the menu and toggle button
                    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('open')) {
                        menuToggle.classList.remove('open');
                        mainNav.classList.remove('open');
                    }
                });
            } else {
                console.error('Responsive navigation elements not found after loading navbar.');
            }

        } else {
            console.error('Navbar placeholder not found!');
        }
    } catch (error) {
        console.error('Error loading navigation bar:', error);
    }
}

// Call loadNavbar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadNavbar);


// Reveal section content on scroll
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
},{threshold:0.4});
sections.forEach(s=>observer.observe(s));

// SILK cloth GSAP animation
gsap.registerPlugin(ScrollTrigger);
const silkPath = document.querySelector(".silk path");

// Animate silk folding up as you scroll through entire site
gsap.to(silkPath, {
    attr: { d: "M0,0 C480,150 1440,-150 1920,0 L1920,0 L0,0 Z" },
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    },
    ease: "sine.inOut"
});
