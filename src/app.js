import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta base opcional para verificar si funciona
app.get('/', (req, res) => {
  res.send('¡Servidor ecommerce corriendo!');
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
