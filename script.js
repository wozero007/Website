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

function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('show');
}
