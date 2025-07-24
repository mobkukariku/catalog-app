export function initFilters(products, renderCallback, options = {}) {
    const { skipInitialRender = false } = options;
    const form = document.getElementById('filters-form');
    const searchInput = document.querySelector('.search-input');
    const ratingRange = document.getElementById('rating-range');
    const ratingValue = document.getElementById('rating-value');
    const minPriceInput = document.querySelector('.price-input[min]');
    const maxPriceInput = document.querySelector('.price-input[max]');
    const categoriesContainer = document.getElementById('categories-container');
    const priceRanges = document.querySelectorAll('.price-range');
    const minPriceRange = priceRanges[0];
    const maxPriceRange = priceRanges[1];


    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const filtersModal = document.createElement('div');
    filtersModal.className = 'mobile-filters-modal';
    
    const formElements = {
        searchInput: searchInput.cloneNode(true),
        ratingRange: ratingRange.cloneNode(true),
        ratingValue: ratingValue.cloneNode(true),
        minPriceInput: minPriceInput.cloneNode(true),
        maxPriceInput: maxPriceInput.cloneNode(true),
        categoriesContainer: categoriesContainer.cloneNode(true),
        priceRanges: [minPriceRange.cloneNode(true), maxPriceRange.cloneNode(true)]
    };
    
    const formClone = form.cloneNode(true);
    formClone.innerHTML = form.innerHTML;
    
    const modalSearchInput = formClone.querySelector('.search-input');
    const modalRatingRange = formClone.querySelector('#rating-range');
    const modalRatingValue = formClone.querySelector('#rating-value');
    const modalMinPriceInput = formClone.querySelector('.price-input[min]');
    const modalMaxPriceInput = formClone.querySelector('.price-input[max]');
    const modalCategoriesContainer = formClone.querySelector('#categories-container');
    const modalPriceRanges = formClone.querySelectorAll('.price-range');
    const modalMinPriceRange = modalPriceRanges[0];
    const modalMaxPriceRange = modalPriceRanges[1];
    
    modalSearchInput.value = searchInput.value;
    modalRatingRange.value = ratingRange.value;
    modalMinPriceInput.value = minPriceInput.value;
    modalMaxPriceInput.value = maxPriceInput.value;
    modalMinPriceRange.value = minPriceRange.value;
    modalMaxPriceRange.value = maxPriceRange.value;
    
    filtersModal.innerHTML = `
        <div class="modal-header">
            <h3>Filters</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-content">
        </div>
        <div class="modal-footer">
            <button class="apply-filters">Apply Filters</button>
        </div>
    `;
    
    const modalContent = filtersModal.querySelector('.modal-content');
    modalContent.appendChild(formClone);
    
    document.body.appendChild(modalOverlay);
    document.body.appendChild(filtersModal);
    
    function syncFormValues() {
        searchInput.value = modalSearchInput.value;
        ratingRange.value = modalRatingRange.value;
        minPriceInput.value = modalMinPriceInput.value;
        maxPriceInput.value = modalMaxPriceInput.value;
        minPriceRange.value = modalMinPriceRange.value;
        maxPriceRange.value = modalMaxPriceRange.value;
        
        const value = parseFloat(modalRatingRange.value);
        ratingValue.textContent = value === 0 ? 'All ratings' : `from ${value.toFixed(1)}`;
        modalRatingValue.textContent = value === 0 ? 'All ratings' : `from ${value.toFixed(1)}`;
        
        const originalCheckboxes = form.querySelectorAll('input[name="category"]');
        const modalCheckboxes = formClone.querySelectorAll('input[name="category"]');
        
        modalCheckboxes.forEach((checkbox, index) => {
            originalCheckboxes[index].checked = checkbox.checked;
        });
    }
    
    document.querySelector('.mobile-filter-btn')?.addEventListener('click', () => {
        modalSearchInput.value = searchInput.value;
        modalRatingRange.value = ratingRange.value;
        modalMinPriceInput.value = minPriceInput.value;
        modalMaxPriceInput.value = maxPriceInput.value;
        modalMinPriceRange.value = minPriceRange.value;
        modalMaxPriceRange.value = maxPriceRange.value;
        
        const originalCheckboxes = form.querySelectorAll('input[name="category"]');
        const modalCheckboxes = formClone.querySelectorAll('input[name="category"]');
        
        originalCheckboxes.forEach((checkbox, index) => {
            modalCheckboxes[index].checked = checkbox.checked;
        });
        
        modalOverlay.classList.add('active');
        filtersModal.classList.add('active');
    });
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        filtersModal.classList.remove('active');
    }
    
    modalOverlay.addEventListener('click', closeModal);
    filtersModal.querySelector('.close-modal').addEventListener('click', closeModal);
    
    filtersModal.querySelector('.apply-filters').addEventListener('click', () => {
        syncFormValues();
        applyFilters();
        closeModal();
    });

    modalMinPriceRange.addEventListener('input', () => {
        modalMinPriceInput.value = modalMinPriceRange.value;
    });

    modalMaxPriceRange.addEventListener('input', () => {
        modalMaxPriceInput.value = modalMaxPriceRange.value;
    });

    modalMinPriceInput.addEventListener('input', () => {
        modalMinPriceRange.value = modalMinPriceInput.value || 0;
    });

    modalMaxPriceInput.addEventListener('input', () => {
        modalMaxPriceRange.value = modalMaxPriceInput.value || 1000;
    });

    modalRatingRange.addEventListener('input', () => {
        const value = parseFloat(modalRatingRange.value);
        modalRatingValue.textContent = value === 0 ? 'All ratings' : `from ${value.toFixed(1)}`;
    });

    let filterTimeout;
    const debounceDelay = 200;

    minPriceRange.value = 0;
    maxPriceRange.value = 3000;
    modalMinPriceRange.value = 0;
    modalMaxPriceRange.value = 3000;

    const categories = [...new Set(products.map(p => p.category))];
    categoriesContainer.innerHTML = categories.map(category => `
        <label>
            <input type="checkbox" name="category" value="${category}">
            ${category}
        </label>
    `).join('');
    
    modalCategoriesContainer.innerHTML = categoriesContainer.innerHTML;

    minPriceRange.addEventListener('input', () => {
        minPriceInput.value = minPriceRange.value;
        applyFilters();
    });

    maxPriceRange.addEventListener('input', () => {
        maxPriceInput.value = maxPriceRange.value;
        applyFilters();
    });

    minPriceInput.addEventListener('input', () => {
        minPriceRange.value = minPriceInput.value || 0;
        applyFilters();
    });

    maxPriceInput.addEventListener('input', () => {
        maxPriceRange.value = maxPriceInput.value || 1000;
        applyFilters();
    });

    ratingRange.addEventListener('input', () => {
        const value = parseFloat(ratingRange.value);
        ratingValue.textContent = value === 0 ? 'All ratings' : `from ${value.toFixed(1)}`;
        applyFilters();
    });

    searchInput.addEventListener('input', applyFilters);
    form.addEventListener('change', applyFilters);

    function applyFilters() {
        clearTimeout(filterTimeout);

        filterTimeout = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            const minRating = parseFloat(ratingRange.value) || 0;
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || 9999;
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

    if(!skipInitialRender) applyFilters();
}