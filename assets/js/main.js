import { initFilters } from './modules/filters.js';
import { initSorting } from './modules/sort.js';
import { renderProducts, updateShowingProducts } from './modules/products.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) throw new Error('HTTP error');

        const data = await response.json();
        const allProducts = Array.isArray(data) ? data : data?.products || [];
        
        if (!allProducts.length) {
            showEmptyMessage();
            return;
        }

        let filterResult = [...allProducts];
        let sortType = 'default';

        function updateCatalog() {
            let productsToShow = filterResult;
            if (window.sortProducts) {
                productsToShow = window.sortProducts(productsToShow, sortType);
            }
            renderProducts(productsToShow);
            updateShowingProducts(productsToShow);
        }

        initFilters(allProducts, (filteredProducts) => {
            filterResult = filteredProducts;
            updateCatalog();
        }, { skipInitialRender: true });


        initSorting(allProducts, (_sortedProducts, newSortType) => {
            sortType = newSortType || 'default';
            updateCatalog();
        });

        import('./modules/sort.js').then(mod => {
            window.sortProducts = mod.sortProducts;
            updateCatalog();
        });

    } catch (error) {
        console.error('Failed to load products:', error);
        showErrorMessage();
    }
});

function showEmptyMessage() {
    document.getElementById('products-container').innerHTML = 
        '<div class="empty">No products found</div>';
}

function showErrorMessage() {
    document.getElementById('products-container').innerHTML = 
        '<div class="error">Failed to load products</div>';
}