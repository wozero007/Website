document.addEventListener('DOMContentLoaded', () => {
    const carouselSlide = document.querySelector('.carousel-slide');
    if (!carouselSlide) return; // Exit if no carousel on page

    // Import images from Recent list
    // Strictly load from 'images/photography/Thumbs/Recent/'
    let carouselImages = window.recentImages || [];
    let folderPath = 'images/photography/Thumbs/Recent/';

    // We can limit to 5 if needed, or show all in recent
    if (carouselImages.length > 5) {
        carouselImages = carouselImages.slice(0, 5);
    }

    // Generate Slides
    carouselImages.forEach((src, index) => {
        const img = document.createElement('img');

        // src might be .jpg, but thumb is .avif
        let thumbSrc = src.substr(0, src.lastIndexOf(".")) + ".avif";
        if (src.lastIndexOf(".") === -1) thumbSrc = src + ".avif";

        img.src = folderPath + thumbSrc;
        img.alt = 'Slide ' + (index + 1);
        carouselSlide.appendChild(img);
    });

    // Generate Dots
    const dotsContainer = document.querySelector('.carousel-dots');
    carouselImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = index === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const slides = document.querySelectorAll('.carousel-slide img');
    if (slides.length === 0) return;

    // Logic
    let counter = 0;
    const size = slides[0].clientWidth;

    // Initial position
    updateCarousel();

    // Button Listeners
    document.querySelector('.carousel-btn.next').addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    function nextSlide() {
        if (counter >= slides.length - 1) {
            counter = 0;
        } else {
            counter++;
        }
        updateCarousel();
    }

    function prevSlide() {
        if (counter <= 0) {
            counter = slides.length - 1;
        } else {
            counter--;
        }
        updateCarousel();
    }

    function goToSlide(index) {
        counter = index;
        updateCarousel();
        resetTimer();
    }

    function updateCarousel() {
        carouselSlide.style.transform = `translateX(${-counter * 100}%)`;
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[counter]) dots[counter].classList.add('active');
    }

    // Auto Slide
    let timer = setInterval(nextSlide, 5000);

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(nextSlide, 5000);
    }
});
