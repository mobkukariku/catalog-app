import { CatalogManager } from './modules/catalogManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  const catalogManager = new CatalogManager();
  await catalogManager.init();
});