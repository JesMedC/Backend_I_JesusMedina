import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

// Crear nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener carrito por id
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

// Agregar producto al carrito (incrementa quantity si existe)
router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(updatedCart);
});

// Actualizar cantidad de producto en carrito
router.put('/:cid/product/:pid', async (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined || quantity < 1)
    return res.status(400).json({ error: 'Quantity debe ser un número mayor a 0' });

  const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
  res.json(updatedCart);
});

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
  res.json(updatedCart);
});

// Eliminar carrito completo
router.delete('/:cid', async (req, res) => {
  const deleted = await cartManager.deleteCart(req.params.cid);
  if (!deleted) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json({ message: 'Carrito eliminado correctamente' });
});

export default router;
