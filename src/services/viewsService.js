import errorsNum from '../errors/enum.js';
import { productService } from './productsService.js';
import CustomError from '../errors/customError.js';
import { logger } from '../utils.js';

class ViewsService {
  async getProducts(queryParams) {
    const {
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    } = await productService.get(queryParams);
    let productsSimplified = products.map((item) => ({
      _id: item._id.toString(),
      title: item.title,
      description: item.description,
      price: item.price,
      thumbnail: item.thumbnail,
      code: item.code,
      stock: item.stock,
      category: item.category,
    }));
    if (!productsSimplified) {
      CustomError.createError({
        name: 'Retrieving products error',
        cause: generateUserErrorInfo(user),
        message: 'Products can not be retrieved',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return {
      products: productsSimplified,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLink?.substring(4) || '',
      nextLink: nextLink?.substring(4) || '',
    };
  }
}

export const viewsService = new ViewsService();
