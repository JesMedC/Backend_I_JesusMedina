import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST /api/carts → crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /api/carts/:cid → obtener productos del carrito
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid → agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

export default router;
