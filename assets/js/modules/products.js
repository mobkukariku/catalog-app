export function renderProducts(productsToRender) {
    const container = document.querySelector('.products-layout');
   
    container.innerHTML = '';

    productsToRender.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.innerHTML = `
            <div class="product-image-container">
                <picture>
                    <source media="(max-width: 480px)" srcset="${product.image.mobile}">
                    <source media="(max-width: 1024px)" srcset="${product.image.tablet}">
                    <img class="product-image" src="${product.image.desktop}" alt="${product.name}" loading="lazy">
                </picture>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                </div>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Price: <span>${product.price.toLocaleString()} $</span></p>
                <p class="product-category">Category: <span>${product.category}</span></p>
            </div>
        `;

        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.4s ease-out';
        card.style.transitionDelay = `${index * 0.05}s`;
        
        container.appendChild(card);
    });
    
    setTimeout(() => {
        const cards = container.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 50);
}


export function updateShowingProducts(products) {
    const show = document.getElementById('show');
    show.textContent = products.length;

}



function generateRatingStars(rating) {
    return `
      <div class="product-rating" aria-label="Rating: ${rating.toFixed(1)} out of 5">
        ${Array(5).fill().map((_, i) => {
          const starValue = i + 1;
          let starClass = '';
          if (rating >= starValue) starClass = 'filled';
          else if (rating >= starValue - 0.5) starClass = 'half-filled';
          
          return `<span class="star ${starClass}" aria-hidden="true">★</span>`;
        }).join('')}
        <span class="rating-value">${rating.toFixed(1)}</span>
      </div>
    `;
  }