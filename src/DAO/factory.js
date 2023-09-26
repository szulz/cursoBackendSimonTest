import 'dotenv/config';
import mongoose from 'mongoose';
import productsModelLogic from './mongo/products.mongo.js';
import cartModelLogic from './mongo/carts.mongo.js';
import ProductsMemory from './memory/ProductManager.js';
import CartsMemory from './memory/CartManager.js';

switch (config.persistence) {
    case 'MONGO':
        console.log('Mongo Persistance');

        mongoose.connect(process.env.MONGODB_URL);
        Products = productsModelLogic;
        Carts = cartModelLogic;
        break;

    case 'FILESYSTEM':
        console.log('Memory Persistance');
        Products = ProductsMemory;
        Carts = CartsMemory;
        break;

    default:
        break;
}

export { Products, Carts };


