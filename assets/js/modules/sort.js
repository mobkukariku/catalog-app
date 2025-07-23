export function initSorting(products, callback) {
    const sortSelect = document.getElementById('sort-select');

    sortSelect.addEventListener('change', () => {
        const sortType = sortSelect.value;
        const sortedProducts = sortProducts([...products], sortType);
        callback(sortedProducts, sortType);
    });
}

export function sortProducts(products, sortType) {
    switch(sortType) {
        case 'price-asc':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-desc':
            return [...products].sort((a, b) => b.price - a.price);
        case 'rating':
            return [...products].sort((a, b) => b.rating - a.rating);
        case 'name-asc':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...products].sort((a, b) => b.name.localeCompare(a.name));
        default:
            return [...products];
    }
}