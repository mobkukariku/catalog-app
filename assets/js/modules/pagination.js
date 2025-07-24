export const PAGINATION_CONFIG = {
  itemsPerPage: 12,
  visiblePages: 5
};

let currentPage = 1;

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(page) {
  currentPage = page;
}

export function paginate(products) {
  const start = (currentPage - 1) * PAGINATION_CONFIG.itemsPerPage;
  const end = start + PAGINATION_CONFIG.itemsPerPage;
  return products.slice(start, end);
}

export function updatePagination(totalItems, updateCallback) {
  const totalPages = Math.ceil(totalItems / PAGINATION_CONFIG.itemsPerPage);
  const paginationContainer = document.querySelector('.pagination');
  
  if (!paginationContainer) return;

  const paginationPages = paginationContainer.querySelector('.pagination-pages');
  const prevBtn = paginationContainer.querySelector('.pagination-prev');
  const nextBtn = paginationContainer.querySelector('.pagination-next');

  // Обновление состояния кнопок
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;

  // Генерация кнопок страниц
  paginationPages.innerHTML = '';
  const pages = generatePageNumbers(currentPage, totalPages);
  
  pages.forEach(page => {
    const pageBtn = createPageButton(page, updateCallback);
    paginationPages.appendChild(pageBtn);
  });
}

function generatePageNumbers(currentPage, totalPages) {
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

function createPageButton(page, updateCallback) {
  const button = document.createElement('button');
  button.className = `pagination-page ${page === getCurrentPage() ? 'active' : ''}`;
  button.textContent = page;
  button.addEventListener('click', () => {
    setCurrentPage(page);
    updateCallback();
  });
  return button;
}