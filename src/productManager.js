import fs from 'fs';

class ProductManager {
  constructor(path, pathProductId) {
    this.path = path;
    this.pathProductId = pathProductId;
  }

  async getProduct() {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    }
    await fs.promises.writeFile(this.path, JSON.stringify([]));
    return [];
  }

  async readId() {
    if (fs.existsSync(this.pathProductId)) {
      const idString = await fs.promises.readFile(this.pathProductId, 'utf-8');
      const id = JSON.parse(idString);
      return id;
    }
    await fs.promises.writeFile(this.pathProductId, JSON.stringify(0));
  }

  async addProduct(product) {
    const data = await this.getProduct();
    let idFile = (await this.readId()) + 1;
    await fs.promises.writeFile(this.pathProductId, JSON.stringify(idFile));
    const newProduct = { ...product, id: idFile, status: true };
    data.push(newProduct);
    const productString = JSON.stringify(data);
    await fs.promises.writeFile(this.path, productString);
  }

  async getProductById(id) {
    let data = await this.getProduct();
    let foundCode = data.findIndex((element) => element.id === id);
    return data[foundCode];
  }

  async updateProduct(modProps) {
    let data = await this.getProduct();
    let foundCode = data.findIndex((element) => element.code === modProps.code);
    if (modProps.title) data[foundCode].title = modProps.title;
    if (modProps.description)
      data[foundCode].description = modProps.description;
    if (modProps.price) data[foundCode].price = modProps.price;
    if (modProps.thumbnail) data[foundCode].thumbnail = modProps.thumbnail;
    if (modProps.stock) data[foundCode].stock = modProps.stock;
    if (modProps.category) data[foundCode].category = modProps.category;
    const productsString = JSON.stringify(data);
    await fs.promises.writeFile(this.path, productsString);
    return data[foundCode];
  }

  async deleteProduct(id) {
    let data = await this.getProduct();
    let foundCode = data.findIndex((element) => element.id === id);
    data.splice(foundCode, 1);
    const productsString = JSON.stringify(data);
    await fs.promises.writeFile(this.path, productsString);
  }
}

export default ProductManager;
