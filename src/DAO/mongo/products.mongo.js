import { ProductsModel } from "./models/products.model.js";

class ProductsModelLogic {
  async paginate(filter, options) {
    await ProductsModel.paginate(filter, options);
  }

  async createProduct(title, description, price, code, stock, category) {
    const productCreated = await ProductsModel.create({
      title,
      description,
      price,
      code,
      stock,
      category,
    });
    return productCreated;
  }

  async deleteOne(_id) {
    await ProductsModel.deleteOne({ "_id":_id });
  }

  async updateOne(id, title, description, price, code, stock, category) {
    await ProductsModel.updateOne(
      { _id: id },
      { title, description, price, code, stock, category }
    );
  }

  async getOne(pid){
    const product = await ProductsModel.findById(pid)
    return product;
  }
}

export const productsModelLogic = new ProductsModelLogic();
