import { cartModelLogic } from '../DAO/mongo/carts.mongo.js';
import { productsModelLogic } from '../DAO/mongo/products.mongo.js';

class CartService {
  async createOne() {
    const createCart = await cartModelLogic.createCart;
    return createCart;
  }

  async getCart(cartId) {
    const cart = await cartModelLogic.getCartById(cartId);
    if (cart) {
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }

  async getAllCarts(req,res) {
    const carts = await cartModelLogic.getAllCarts(req,res);
    if (carts) {
      return carts;
    } else {
      throw new Error('Carts not found');
    }
  }

  async addProduct(cartId, productId) {
    try {
      const cart = await cartModelLogic.getCartById(cartId);
      const product = await productsModelLogic.getOne(productId);
      if (!cart || !product) {
        throw new Error('Cart or product not found');
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );
      if (productIndex === -1) {
        cart.products.push({ product: product._id, quantity: 1 });
      } else {
        cart.products[productIndex].quantity =
          cart.products[productIndex].quantity + 1;
      }
      await cartModelLogic.cartUpdate(cartId, cart.products);
      return cart;
    } catch (error) {
      throw new Error('Couldnt add product. Please try again later');
    }
  }

  async udpdateCart(cartId, products) {
    try {
      const cart = await cartModelLogic.cartUpdate(cartId, products);
      return cart;
    } catch (error) {
      throw new Error('Error updating Cart.Please try again later');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartModelLogic.findById(cartId);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (prodIndex === -1 || quantity === 0) {
        throw new Error('Product not found in cart or quantity not');
      }
      cart.products[prodIndex].quantity = quantity;
      await cartModelLogic.save(cart);
      return cart;
    } catch (error) {
      throw new Error('Error updating product quantity');
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await cartModelLogic.findById(cartId);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (prodIndex === -1) {
        throw new Error('Product not found in cart');
      }
      cart.products.splice(prodIndex, 1);
      await cartModelLogic.save(cart);
      return cart;
    } catch (error) {
      throw new Error('Couldnt remove product from cart.');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModelLogic.clearCart(cartId);
    } catch (error) {
      throw new Error('Couldnt empty cart.');
    }
  }
}

export const cartService = new CartService();
