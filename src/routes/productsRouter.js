import express from 'express';
import { productsController } from '../controllers/products.controller.js';
import { uploader } from '../utils.js';
const productsRouter = express.Router();

productsRouter.get('/upload', (req, res) => {
    res.render('testing')
})

productsRouter.post('/upload', uploader.single('file'), (req, res) => {
    console.log(req.file);
})

export default productsRouter;
