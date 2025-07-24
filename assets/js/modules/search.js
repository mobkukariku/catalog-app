export class ProductSearch {
  constructor(allProducts, onSelectCallback) {
    this.allProducts = allProducts;
    this.onSelect = onSelectCallback;
    this.searchInput = document.querySelector('.search-input');
    this.searchDropdown = document.querySelector('.search-dropdown');
    this.searchResults = [];

    
    
    this.initSearch();
  }

  initSearch() {
    if (!this.searchInput || !this.searchDropdown) return;

    this.searchInput.addEventListener('input', this.debounce(() => {
      this.handleSearch(this.searchInput.value.trim());
    }, 300));

    this.searchInput.addEventListener('focus', () => {
      if (this.searchInput.value.trim() && this.searchResults.length) {
        this.showDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target)) {
        this.hideDropdown();
      }
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
        this.handleKeyboardNav(e);
      }
    });
  }

  handleSearch(query) {
    if (!query) {
      this.hideDropdown();
      return [];
    }

    this.searchResults = this.allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5);


    this.renderSearchResults(query);
    return this.searchResults;
  }

 renderSearchResults(query) {
  if (!this.searchResults.length) {
    this.hideDropdown();
    return;
  }

  this.searchDropdown.innerHTML = '';

  this.searchResults.forEach(product => {
    const itemElement = document.createElement('div');
    itemElement.className = 'search-item';
    itemElement.dataset.id = product.id;
    itemElement.innerHTML = `
      <div class="search-item-name">${this.highlightMatches(product.name, query)}</div>
      <div class="search-item-price">${product.price.toLocaleString()} $</div>
    `;

    itemElement.addEventListener('click', (e) => {
      e.stopPropagation(); 
      
      this.searchInput.value = product.name;
      
      this.onSelect(product);
      
      this.hideDropdown();
      
      this.searchInput.dispatchEvent(new Event('input'));
    });

    this.searchDropdown.appendChild(itemElement);
  });

  this.showDropdown();
}

  handleKeyboardNav(e) {
    const items = this.searchDropdown.querySelectorAll('.search-item');
    if (!items.length) return;

    let currentIndex = Array.from(items).findIndex(item => 
      item.classList.contains('highlighted')
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Enter' && currentIndex >= 0) {
      items[currentIndex].click();
      return;
    }

    items.forEach(item => item.classList.remove('highlighted'));
    items[currentIndex].classList.add('highlighted');
    items[currentIndex].scrollIntoView({ block: 'nearest' });
  }

  createSearchItem(product, query) {
    const name = this.highlightMatches(product.name, query);
    return `
      <div class="search-item" data-id="${product.id}">
        <div class="search-item-name">${name}</div>
        <div class="search-item-price">${product.price.toLocaleString()} $</div>
      </div>
    `;
  }

  highlightMatches(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const start = lowerText.indexOf(lowerQuery);
    
    if (start === -1) return text;
    
    const end = start + query.length;
    return `
      ${text.substring(0, start)}
      <span class="search-highlight">${text.substring(start, end)}</span>
      ${text.substring(end)}
    `;
  }

  showDropdown() {
    this.searchDropdown.classList.add('show');
  }

  hideDropdown() {
    this.searchDropdown.classList.remove('show');
  }

  debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
}