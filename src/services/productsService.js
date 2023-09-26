import { productsModelLogic } from '../DAO/mongo/products.mongo.js';
import { ProductsModel } from '../DAO/mongo/models/products.model.js';
import { logger } from '../utils.js';
import errorsNum from '../errors/enum.js';
import CustomError from '../errors/customError.js';

class ProductService {
  validate(title, description, price, code, stock, category) {
    if (!title || !description || !price || !code || !stock || !category) {
      logger.info('Error creating product');
      CustomError.createError({
        name: 'Error creating products',
        cause: 'Fields are empty or invalid type',
        message: 'Validation error: Please check if all fields are correct.',
        code: errorsNum.INVALID_TYPES_ERROR,
      });
    }
  }

  async get(queryParams) {
    
    const { limit = 10, page = 1, sort, query } = queryParams;
    const filter = {};

    if (query) {
      filter.$or = [{ category: query }];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'desc' ? '-price' : 'price',
    };

    const result = await ProductsModel.paginate(filter, options);
    if (!result) {
      logger.info('Error retrieving products');
      CustomError.createError({
        name: 'Error retrieving products',
        cause: 'Products Model not responding',
        message: 'Products Model in productsService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null,
    };
    return response;
  }

  async createOne(productBody) {
    const product = { ...productBody.productBody };
    const title = product.title;
    const description = product.description;
    const price = product.price;
    const code = product.code;
    const stock = product.stock;
    const category = product.category;
    this.validate(title, description, price, code, stock, category);
    const productCreated = await productsModelLogic.createProduct(
      title,
      description,
      price,
      code,
      stock,
      category
    );
    if (!productCreated) {
      logger.info('Error creating product in database');
      CustomError.createError({
        name: 'Error creating products',
        cause: 'Products Model not responding',
        message: 'Products Model in productsService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return productCreated;
  }

  async deleteOne(id) {
    const deleted = await productsModelLogic.deleteOne(id);
    if (!deleted) {
      logger.warn('Error deleting product in database');
      CustomError.createError({
        name: 'Error deleting products',
        cause: 'Products Model not responding',
        message: 'Products Model in productsService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return deleted;
  }

  async updateOne(id, title, description, price, code, stock, category) {
    this.validate(title, description, price, code, stock, category);
    const productUpdated = await productsModelLogic.updateOne(
      id,
      title,
      description,
      price,
      code,
      stock,
      category
    );
    if (!productUpdated) {
      logger.info('Error updating product in database');
      CustomError.createError({
        name: 'Error updating products',
        cause: 'Products Model not responding',
        message: 'Products Model in productsService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return productUpdated;
  }

  async getOne(pid) {
    const product = await productsModelLogic.getOne(pid);
    if (!product) {
      logger.info('Error retrieving product in database');
      CustomError.createError({
        name: 'Error retrieving one product',
        cause: 'Products Model not responding',
        message: 'Products Model in productsService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return product;
  }
}

export const productService = new ProductService();
