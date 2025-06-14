import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/products.json');

export default class ProductManager {
  constructor() {
    this.path = filePath;
    if (!existsSync(this.path)) {
      fs.writeFile(this.path, JSON.stringify([]));
    }
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newId = crypto.randomUUID();
    const newProduct = { id: newId, ...product };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id }; // mantener ID

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (products.length === filtered.length) return false;

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
