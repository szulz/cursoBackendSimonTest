import express from 'express';
import CartManager from '../cartManager.js';
const CM = new CartManager('./src/carts.json','./src/products.json');

const cartRouter = express.Router();

// middleware para leer los productos
cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartProducts = await CM.getCartById(parseInt(cartId));
    return res.status(200).json({ cartProducts });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: 'Cart not found',
    });
  }
});

cartRouter.post('/', async (req, res) => {
  try {
    await CM.addCart();
    return res.status(200).json({
      status: 'Succes',
      msg: 'New Cart Created',
    });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't create new cart. Please try again later",
    });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid)
    const productCode = parseInt(req.params.pid);
    await CM.addProductToCart(cartId, productCode);
    return res.status(200).json({
      status: 'Succes',
      msg: 'Proudct added',
    });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't add new product. Please check the cart or product",
    });
  }
});

export default cartRouter;
