// animations.js
// Removed direct import of gsap as it's typically attached to the global window object
// after its script is loaded from CDN.
// import { gsap } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";

// Ensure ScrollTrigger is registered before use
// This line assumes ScrollTrigger is available globally or as gsap.ScrollTrigger after the script tag in index.html
gsap.registerPlugin(ScrollTrigger); 

/**
 * Initializes the silk cloth animation that folds up as the user scrolls.
 */
export function initSilkAnimation() {
    const silkPath = document.querySelector(".silk path");
    if (silkPath) {
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
    } else {
        console.error('Silk path element not found for animation.');
    }
}

/**
 * Initializes the "paper falling/flipping" animation for each section,
 * creating a continuous rotation effect tied to scroll position.
 */
export function initSectionPaperFallingAnimation() {
    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
        // Set initial state to ensure visibility and correct starting position
        gsap.set(section, { opacity: 1, rotationX: 0, y: 0, scale: 1 });

        // Create a ScrollTrigger for each section
        // The animation will scrub (link directly) to the scroll position
        gsap.to(section, {
            rotationX: 0, // Final state: flat
            ease: "none", // No easing, direct scrub
            scrollTrigger: {
                trigger: section,
                start: "top bottom", // When the top of the section enters the viewport from the bottom
                end: "bottom top", // When the bottom of the section leaves the viewport at the top
                scrub: true, // Link animation directly to scroll position (like your example)
                // markers: true, // Uncomment for debugging ScrollTrigger
                onUpdate: self => {
                    // Calculate the progress of the section within its scrollTrigger range
                    // 0 when section top is at viewport bottom, 1 when section bottom is at viewport top
                    const progress = self.progress;

                    // Map this progress to a rotation value
                    // When progress is 0 (section entering view), rotation should be -90 (flipped up)
                    // When progress is 1 (section leaving view), rotation should be 0 (flat)
                    // We want it to be -90 at start and 0 at end, so it "falls" into place
                    // And reverses when scrolling back up
                    const rotation = gsap.utils.mapRange(0, 1, -90, 0, progress);

                    // Apply the rotation
                    gsap.to(section, { rotationX: rotation, duration: 0, overwrite: true });

                    // Optional: Add a slight scale or Y offset for more depth
                    const scale = gsap.utils.mapRange(0, 1, 0.9, 1, progress);
                    const yOffset = gsap.utils.mapRange(0, 1, -50, 0, progress); // Push up slightly as it falls
                    gsap.to(section, { scale: scale, y: yOffset, duration: 0, overwrite: true });
                }
            }
        });
    });
}
