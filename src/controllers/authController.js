import { logger } from '../utils.js';
import { enviarCorreo } from '../utils.js';

class AuthController {
  async callback(req, res) {
    req.session.user = req.user;
    // Successful authentication, redirect home.
    res.redirect('/products');
  }

  async login(req, res) {
    return res.render('login', {});
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', {
          error: 'Error inesperado. No se pudo cerrar su sesión',
        });
      }
      return res.redirect('/');
    });
  }

  async loginPassport(req, res) {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    if (!req.session.user) {
      return res.json({ error: 'Invalid credentials' });
    }
    logger.info(req.session.user);
    return res.redirect('/products');
  }

  async failLogin(req, res) {
    return res.json({ error: 'Fail to login' });
  }

  async register(req, res) {
    return res.render('register', {});
  }

  async registerPassport(req, res) {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    if (!req.session.user) {
      return res.json({ error: 'Something went wrong' });
    }
    logger.info(req.session.user);
    enviarCorreo(req.session.user.email, req.session.user.first_name);
    return res.redirect('/products');
  }

  async failRegister(req, res) {
    return res.json({ error: 'Fail to register' });
  }
}

export const authController = new AuthController();
