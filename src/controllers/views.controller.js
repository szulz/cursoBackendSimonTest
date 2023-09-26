import UserDTO from '../DAO/DTO/user.dto.js';
import CustomError from '../errors/customError.js';
import { productService } from '../services/productsService.js';
import { viewsService } from '../services/viewsService.js';
import { logger } from '../utils.js';
import { cartService } from '../services/cartService.js';

class ViewsController {
  async redirect(req, res) {
    res.redirect('/api/sessions');
  }

  async getRealTimeProducts(req, res) {
    const products = await productService.get();
    res.render('realtimeProducts', { products });
  }

  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const queryParams = { limit, page, sort, query };
      const products = await viewsService.getProducts(queryParams);
      products.first_name = req.session.user.first_name;
      products.last_name = req.session.user.last_name;
      products.cart = req.session.user.cart;
      products.role = req.session.user.role;
      products.isAdmin = products.role === 'admin' ? true : false;
      return res.render('products', products);
    } catch (error) {
      logger.warn('Couldnt load products');
    }
  }

  getCurrentUser = (req, res) => {
    if (!req.session.user.first_name) {
      CustomError.createError({
        name: 'User not logged in',
        cause: 'Authorization failed',
        message: 'Authorization failed',
        code: errorsNum.AUTHORIZATION_FAILED,
      });
    }
    if (!req.session.user.first_name == '') {
      const user = new UserDTO(req.session.user);
      return res.status(200).json({ user });
    }
  };

  async productForm(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const queryParams = { limit, page, sort, query };
      const products = await viewsService.getProducts(queryParams);

      products.first_name = req.session.user.first_name;
      products.last_name = req.session.user.last_name;
      products.cart = req.session.user.cart;
      return res.render('home', products);
    } catch (error) {
      next();
    }
  }

  async getProduct(req, res) {
    const pid = req.params.pid;
    const product = await productService.getOne(pid);
    const simplifiedProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      code: product.code,
      category: product.category,
      quantity: product.quantity,
      id: product._id,
    };
    return res.render('detail', { product: simplifiedProduct });
  }

  async getCart(req,res){
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
      res.render('carts', { cart: simplifiedCart });
    } catch (error) {
      return res.status(400).json({
        status: 'Error getting cart',
        msg: error.message,
      });
    }
  }
}

export const viewsController = new ViewsController();
