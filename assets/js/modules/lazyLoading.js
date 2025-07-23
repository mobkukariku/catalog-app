
export function initLazyLoading() {
    const images = document.querySelectorAll('.product-image[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.01
    });

    images.forEach(img => {
        if (img.complete) {
            handleImageLoad(img);
        } else {
            img.onload = () => handleImageLoad(img);
            img.onerror = () => handleImageError(img);
            imageObserver.observe(img);
        }
    });
}

function loadImage(img) {
    if (img.dataset.src) {
        img.src = img.dataset.src;
    }
    if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
    }
}

function handleImageLoad(img) {
    img.classList.add('loaded');
    img.closest('.product-image-container')?.classList.add('loaded');
}

function handleImageError(img) {
    console.error('Error loading image:', img.src);
    img.src = 'assets/images/fallback.jpg';
    img.onerror = null;
}