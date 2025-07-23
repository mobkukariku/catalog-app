export function renderProducts(productsToRender) {
    const container = document.querySelector('.products-layout');
   
    container.innerHTML = '';
    
    productsToRender.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.innerHTML = `
            <div class="product-image-container">
                <img class="product-image" src="${product.image.desktop}" alt="${product.name}" 
                     loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Price: <span>${product.price.toLocaleString()} $</span></p>
                <p class="product-category">Category: <span>${product.category}</span></p>
                <p class="product-rating">Rating: <span>${product.rating}/5</span></p>
            </div>
            <button class="add-to-cart">Add to cart</button>
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

