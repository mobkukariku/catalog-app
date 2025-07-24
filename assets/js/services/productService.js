export class ProductService {
  static async loadProducts() {
    try {
      const response = await fetch('./data/products.json');
      if (!response.ok) throw new Error('HTTP error');
      
      const data = await response.json();
      const products = Array.isArray(data) ? data : data?.products || [];
      
      if (!products.length) {
        throw new Error('No products available');
      }
      
      return products;
    } catch (error) {
      console.error('Failed to load products:', error);
      throw error; 
    }
  }
}