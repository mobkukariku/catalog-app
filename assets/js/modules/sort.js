export function initSorting(products, callback) {
    const sortSelect = document.getElementById('sort-select');
    const originalSortSelect = sortSelect.cloneNode(true);

    // Создаем модальное окно для сортировки
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const sortModal = document.createElement('div');
    sortModal.className = 'mobile-sort-modal';
    sortModal.innerHTML = `
        <div class="modal-header">
            <h3>Sort By</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-content">
            <select class="mobile-sort-select">
                ${[...originalSortSelect.options].map(option => 
                    `<option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>`
                ).join('')}
            </select>
        </div>
        <div class="modal-footer">
            <button class="apply-sort">Apply Sorting</button>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    document.body.appendChild(sortModal);
    
    const mobileSortSelect = sortModal.querySelector('.mobile-sort-select');
    

    document.querySelector('.mobile-sort-btn')?.addEventListener('click', () => {

        mobileSortSelect.value = sortSelect.value;
        modalOverlay.classList.add('active');
        sortModal.classList.add('active');
    });
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        sortModal.classList.remove('active');
    }
    
    modalOverlay.addEventListener('click', closeModal);
    sortModal.querySelector('.close-modal').addEventListener('click', closeModal);
    
   
    sortModal.querySelector('.apply-sort').addEventListener('click', () => {
        const sortType = mobileSortSelect.value;
        sortSelect.value = sortType; 
        const sortedProducts = sortProducts([...products], sortType);
        callback(sortedProducts, sortType);
        closeModal();
    });

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