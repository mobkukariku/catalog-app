import { initFilters } from './filters.js';
import { initSorting } from './sort.js';
import { renderProducts, updateShowingProducts } from './products.js';
import { initLazyLoading } from "./lazyLoading.js";
import { ProductService } from '../services/productService.js';
import { paginate, updatePagination, PAGINATION_CONFIG, getCurrentPage, setCurrentPage } from './pagination.js';
import { ProductSearch } from './search.js';

export class CatalogManager {
  constructor() {
    this.allProducts = [];
    this.filterResult = [];
    this.sortType = 'default';
    this.productSearch = null;
  }

  async init() {
    try {
      this.allProducts = await ProductService.loadProducts();
      this.filterResult = [...this.allProducts];
    
      this.productSearch = new ProductSearch(
        this.allProducts,
        (selectedProduct) => {
          this.handleSearchSelect(selectedProduct);
        }
      );
      
      this.setupEventHandlers();
      this.initModules();
      this.updateCatalog();
    } catch (error) {
      if (error.message === 'No products available') {
        this.showEmptyMessage();
      } else {
        this.handleError(error);
      }
    }
  }

  handleSearchSelect(selectedProduct) {
    this.filterResult = [selectedProduct];
    setCurrentPage(1);
    this.updateCatalog();
    
    const productElement = document.querySelector(`[data-id="${selectedProduct.id}"]`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  initModules() {
    initFilters(this.allProducts, this.handleFilter.bind(this), { skipInitialRender: true });
    initSorting(this.allProducts, this.handleSort.bind(this));
    
    import('./sort.js').then(mod => {
      window.sortProducts = mod.sortProducts;
      this.updateCatalog();
    });
  }

  setupEventHandlers() {
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');

    prevBtn?.addEventListener('click', () => this.handlePageChange(-1));
    nextBtn?.addEventListener('click', () => this.handlePageChange(1));
  }

  handlePageChange(direction) {
    const currentPage = getCurrentPage();
    const totalPages = Math.ceil(this.filterResult.length / PAGINATION_CONFIG.itemsPerPage);
    
    if ((direction === -1 && currentPage > 1) || 
        (direction === 1 && currentPage < totalPages)) {
      setCurrentPage(currentPage + direction);
      this.updateCatalog();
    }
  }

  handleFilter(filteredProducts) {
    this.filterResult = filteredProducts;
    setCurrentPage(1);
    this.updateCatalog();
  }

  handleSort(_sortedProducts, newSortType) {
    this.sortType = newSortType || 'default';
    setCurrentPage(1);
    this.updateCatalog();

  }

  updateCatalog() {
    let productsToShow = this.filterResult;
    
    if (window.sortProducts) {
      productsToShow = window.sortProducts(productsToShow, this.sortType);
    }

    const paginatedProducts = paginate(productsToShow);
    
    renderProducts(paginatedProducts);
    updateShowingProducts(productsToShow);
    updatePagination(productsToShow.length, () => this.updateCatalog());
    initLazyLoading();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
  }

  showEmptyMessage() {
    const container = document.getElementById('products-container');
    container?.replaceChildren(this.createMessageElement('empty', 'No products found'));
  }

  handleError(error) {
    console.error('Failed to load products:', error);
    const container = document.getElementById('products-container');
    container?.replaceChildren(this.createMessageElement('error', 'Failed to load products'));
  }

  createMessageElement(className, text) {
    const element = document.createElement('div');
    element.className = className;
    element.textContent = text;
    return element;
  }
}