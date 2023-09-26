import express from 'express';
import ProductManager from '../../productManager.js';
import { uploader } from '../../utils.js';
import { ProductsModel } from '../DAO/models/products.model.js';
const PM = new ProductManager('./src/products.json', './src/id.json');
const productsRouter = express.Router();

// middleware para leer los productos
productsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await PM.getProduct();
    if (!limit) {
      res.status(200).render('home', { products });
    } else {
      const productsSliced = products.slice(0, limit);
      res.status(200).render('home', { productsSliced });
    }
  } catch {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to get the products. Please, try again later',
    });
  }
});

// middleware para traer un producto especifico
productsRouter.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await PM.getProductById(parseInt(pid));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({
        status: 'Error',
        msg: 'Product not found',
      });
    }
  } catch {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to get the products. Please, try again later',
    });
  }
});

//middleware para agregar un producto nuevo con FS
/* uploader.single('thumbnail'), */
/*     const newPicture = req.file.filename;
    productBody.file = 'http://localhost:8080/public/uploads' + newPicture; */

productsRouter.post('/', async (req, res) => {
  try {
    const data = await PM.getProduct();
    const productBody = req.body;

    let foundCode = data.find((element) => element.code === productBody.code);
    const reqFields = ['title', 'description', 'code', 'price', 'stock'];
    const checkFields = reqFields.every((prop) => productBody[prop]);
    if (foundCode) {
      return res.status(400).json({
        status: 'error',
        msg: 'Code already in use. Please, change the product code',
      });
    }
    if (checkFields) {
      await PM.addProduct(productBody);
      return res.status(200).json({
        status: 'Success',
        msg: 'Product added',
      });
    } else {
      return res.status(400).json({
        status: 'Error',
        msg: "Product wasn't saved. Please check the attributes of your product.",
        data: productBody,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to save the product. Please, try again later',
    });
  }
});


//middleware para modificar producto FS
productsRouter.put('/', async (req, res) => {
  try {
    const modProps = req.body;
    let data = await PM.getProduct();
    let foundCode = data.find((element) => element.code === modProps.code);
    if (foundCode) {
      await PM.updateProduct(modProps);
      return res.status(200).json({
        status: 'Succes',
        msg: 'The product has been updated',
      });
    } else {
      return res.status(400).json({
        status: 'Error',
        msg: 'Code not found. Please, try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to save the product. Please, try again later',
    });
  }
});

//middleware para eliminar un elemento FS

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const idReq = req.params.pid;
    let data = await PM.getProduct();
    let foundCode = data.findIndex(
      (element) => element.code === idReq.toString()
    );
    if (foundCode > 0) {
      await PM.deleteProduct(foundCode);
      return res.status(200).json({
        status: 'Succes',
        msg: 'The product has been deleted',
      });
    } else {
      return res.status(400).json({
        status: 'Error',
        msg: 'Id not found. Please, try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to delete the product. Please, try again later',
    });
  }
});

export default productsRouter;