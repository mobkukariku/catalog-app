export function initFilters(products, renderCallback, options = {}) {
    const { skipInitialRender = false } = options;
    const form = document.getElementById('filters-form');
    const searchInput = document.querySelector('.search-input');
    const ratingRange = document.getElementById('rating-range');
    const ratingValue = document.getElementById('rating-value');
    const minPriceInput = document.querySelector('.price-input[min]');
    const maxPriceInput = document.querySelector('.price-input[max]');
    const categoriesContainer = document.getElementById('categories-container');

    let filterTimeout;
    const debounceDelay = 200;

    const categories = [...new Set(products.map(p => p.category))];
    categoriesContainer.innerHTML = categories.map(category => `
        <label>
            <input type="checkbox" name="category" value="${category}">
            ${category}
        </label>
    `).join('');

    ratingRange.addEventListener('input', () => {
        const value = parseFloat(ratingRange.value);
        ratingValue.textContent = value === 0 ? 'Все оценки' : `от ${value.toFixed(1)}`;
        applyFilters();
    });

    searchInput.addEventListener('input', applyFilters);
    minPriceInput.addEventListener('input', applyFilters);
    maxPriceInput.addEventListener('input', applyFilters);
    form.addEventListener('change', applyFilters);

    function applyFilters() {
        clearTimeout(filterTimeout);

        filterTimeout = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            const minRating = parseFloat(ratingRange.value) || 0;
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
            const categoryCheckboxes = form.querySelectorAll('input[name="category"]:checked');
            const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

            const filteredProducts = products.filter(product => {
                const matchesSearch = searchTerm === '' ||
                    product.name.toLowerCase().includes(searchTerm) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm));

                const matchesRating = product.rating >= minRating;

                const price = parseFloat(product.price) || 0;
                const matchesPrice = price >= minPrice && price <= maxPrice;

                const matchesCategory = selectedCategories.length === 0 ||
                    selectedCategories.includes(product.category);

                return matchesSearch && matchesRating && matchesPrice && matchesCategory;
            });

            renderCallback(filteredProducts);
        }, debounceDelay);
    }

    if(!skipInitialRender) applyFilters()
}