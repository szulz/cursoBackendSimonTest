import { CartModel } from './models/carts.model.js';

export class CartModelLogic {
  async createCart() {
    try {
      const cart = await CartModel.create({});
      return cart;
    } catch (error) {
      throw 'Error creating cart';
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById({ _id: cartId }).populate(
        'products.product'
      );
      return cart;
    } catch (error) {
      throw 'Couldnt get cart. Please check ID';
    }
  }
  async getAllCarts(req, res) {
    try {
      const cart = await CartModel.find().populate('products.product');
      return cart;
    } catch (error) {
      console.log(error);
      throw 'Couldnt get carts';
    }
  }

  async cartUpdate(cartId, products) {
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    );
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    cart.products = [];
    await cart.save();
    return cart;
  }
}

export const cartModelLogic = new CartModelLogic();
