import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/carts.json');

export default class CartManager {
  constructor() {
    this.path = filePath;
    if (!existsSync(this.path)) {
      fs.writeFile(this.path, JSON.stringify([]));
    }
  }

  async getCarts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: crypto.randomUUID(),
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
