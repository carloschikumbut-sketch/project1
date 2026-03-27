document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('main-gallery');
    const thumbnails = document.querySelectorAll('.thumb-btn');

    // Function to update the active thumbnail state
    const updateActiveThumb = (index) => {
        thumbnails.forEach(btn => btn.classList.remove('active'));
        if (thumbnails[index]) {
            thumbnails[index].classList.add('active');
        }
    };

    // 1. CLICK LOGIC: Click thumb to scroll gallery
    thumbnails.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const scrollAmount = gallery.offsetWidth * index;
            gallery.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            updateActiveThumb(index);
        });
    });

    // 2. SCROLL LOGIC: Update thumbs when user swipes on mobile
    gallery.addEventListener('scroll', () => {
        const index = Math.round(gallery.scrollLeft / gallery.offsetWidth);
        updateActiveThumb(index);
    });
});