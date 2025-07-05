function downloadApk(apkPath) {
    window.location.href = apkPath;
}

// Screenshot Gallery Slider
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('screenshotGallery');
    const dotsContainer = document.getElementById('screenshotDots');
    const images = gallery.querySelectorAll('img');
    const imageWidth = 120 + 8; // Image width + gap
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Create navigation dots
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateGalleryPosition();
            updateDots();
        });
        dotsContainer.appendChild(dot);
    });

    // Update gallery position
    function updateGalleryPosition() {
        currentTranslate = -currentIndex * imageWidth;
        prevTranslate = currentTranslate;
        gallery.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Update active dot
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Handle drag start
    gallery.addEventListener('mousedown', startDragging);
    gallery.addEventListener('touchstart', startDragging);

    function startDragging(e) {
        isDragging = true;
        startPos = getPositionX(e);
        gallery.style.transition = 'none';
        gallery.classList.add('grabbing');
    }

    // Handle drag move
    gallery.addEventListener('mousemove', drag);
    gallery.addEventListener('touchmove', drag);

    function drag(e) {
        if (!isDragging) return;
        const currentPosition = getPositionX(e);
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        gallery.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Handle drag end
    gallery.addEventListener('mouseup', stopDragging);
    gallery.addEventListener('touchend', stopDragging);
    gallery.addEventListener('mouseleave', stopDragging);

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        gallery.style.transition = 'transform 0.3s ease';
        gallery.classList.remove('grabbing');

        // Snap to the nearest image
        const movedBy = currentTranslate - prevTranslate;
        if (movedBy < -50 && currentIndex < images.length - 1) currentIndex++;
        if (movedBy > 50 && currentIndex > 0) currentIndex--;
        updateGalleryPosition();
        updateDots();
    }

    // Get position X for both mouse and touch events
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }
});