import express from 'express';
import { authController } from '../controllers/authController.js';
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

authRouter.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  authController.callback
);

authRouter.get('/', authController.login);

authRouter.get('/logout', authController.logout);

//Login con passport
authRouter.post(
  '/',
  passport.authenticate('login', {
    failureRedirect: '/api/sessions/faillogin',
  }),
  authController.loginPassport
);

authRouter.get('/faillogin', authController.failLogin);

authRouter.get('/register', authController.register);

authRouter.post(
  '/register',
  passport.authenticate('register', {
    failureRedirect: '/api/sessions/failregister',
  }),
  authController.registerPassport
);

authRouter.get('/failregister', authController.failRegister);

export default authRouter;
