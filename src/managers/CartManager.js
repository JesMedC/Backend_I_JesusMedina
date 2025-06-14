import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: uuidv4(),
      products: []
    };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) return null;

    const productInCart = carts[cartIndex].products.find(p => p.product === productId);

    if (productInCart) {
      productInCart.quantity++;
    } else {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    }

    await this.saveCarts(carts);
    return carts[cartIndex];
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) return null;

    const productInCart = carts[cartIndex].products.find(p => p.product === productId);
    if (!productInCart) return null;

    productInCart.quantity = quantity;
    await this.saveCarts(carts);
    return carts[cartIndex];
  }

  async removeProductFromCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) return null;

    carts[cartIndex].products = carts[cartIndex].products.filter(p => p.product !== productId);

    await this.saveCarts(carts);
    return carts[cartIndex];
  }

  async deleteCart(cartId) {
    let carts = await this.getCarts();
    const initialLength = carts.length;
    carts = carts.filter(c => c.id !== cartId);
    if (carts.length === initialLength) return null;

    await this.saveCarts(carts);
    return true;
  }
}
