import { cartService } from '../services/cartService.js';
import { logger } from '../utils.js';

class CartController {
  async createCart(req, res) {
    try {
      if (!req.session.user.cart) {
        const cart = await cartService.createOne;
        req.session.user.cart = cart._id;
        return res.status(201).json({ cart });
      } else {
        cart = req.session.user.cart;
        return res.status(201).json({ cart });
      }
    } catch (error) {
      console.log('Couldnt create cart');
    }
  }

  async getCart(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartService.getCart(cid);
      const simplifiedCart = cart.products.map((item) => {
        return {
          title: item.product.title,
          description: item.product.description,
          price: item.product.price,
          code: item.product.code,
          quantity: item.quantity,
          category: item.product.category,
          id: item.product._id,
        };
      });
      return res.json({simplifiedCart});
    } catch (error) {
      return res.status(400).json({
        status: 'Error getting cart',
        msg: error.message,
      });
    }
  }

  async getAllCarts(req, res) {
    try {
      const carts = await cartService.getAllCarts();
      return res.json(carts);
    } catch (error) {
      return res.status(400).json({
        status: 'Error getting carts',
        msg: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const productAdded = await cartService.addProduct(cartId, productId);
      return res.status(200).json({
        status: 'Success',
        msg: 'Product added',
      });
    } catch (error) {
      logger.warn("Can't add new product. Please check the cart or product");
      console.log(error);
      return res.status(400).json({
        status: 'Error',
        msg: "Can't add new product. Please check the cart or product",
      });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const prodQuantity = req.body;
      await cartService.updateProductQuantity(cartId, productId, prodQuantity);
      return res.status(200).json({
        status: 'Succes',
        msg: 'Quantity update',
      });
    } catch (error) {
      return res.status(400).json({
        status: 'Error',
        msg: "Can't update quantity. Please check the cart, product or quantity",
      });
    }
  }
  async deleteProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      await cartService.removeProduct(cartId, productId);
      return res.status(200).json({
        status: 'Succes',
        msg: 'Product removed',
      });
    } catch (error) {
      return res.status(400).json({
        status: 'Error',
        msg: "Can't remove the product. Please check the cart or product",
      });
    }
  }

  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;
      await cartService.clearCart(cartId);
      return res.status(200).json({
        status: 'Success',
        msg: 'Emptied cart',
      });
    } catch (error) {
      return res.status(400).json({
        status: 'Error',
        msg: "Can't empty the cart. Please try again later",
      });
    }
  }

  async getCartId(req, res) {
    try {
      const cartId = req.session.user.cart;
      return res.json({ cartId });
    } catch (error) {
      return res.status(400).json({
        status: 'Error',
        msg: 'Couldnt get cart Id',
      });
    }
  }
}

export const cartController = new CartController();
