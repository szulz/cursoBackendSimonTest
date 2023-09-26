import { Router } from 'express';
import { cartController } from '../controllers/carts.controller.js';
export const cartRouter = new Router();

// endpoint para leer los productos mongoose
cartRouter.get('/id',cartController.getCartId)

cartRouter.get('/',cartController.getAllCarts)

cartRouter.get('/:cid', cartController.getCart);

//endpoint para agregar un carrito
cartRouter.post('/', cartController.createCart);


//endpoint para agregar un producto
cartRouter.post('/:cid/product/:pid', cartController.addProductToCart);

//endpoint para vaciar un carrito
cartRouter.put('/:cid', cartController.emptyCart);

//endpoint para modificar cantidad por body
cartRouter.put('/:cid/product/:pid', cartController.updateProductQuantity);

//endpoint para borrar un product
cartRouter.delete('/:cid/product/:pid', cartController.deleteProductFromCart);

export default cartRouter;
