import fs from 'fs';

class CartManager {
  constructor(path, productPath) {
    this.path = path;
    this.productPath = productPath;
  }

  async getCarts() {
    if (fs.existsSync(this.path)) {
      const cartList = await fs.promises.readFile(this.path, 'utf-8');
      const data = JSON.parse(cartList);
      return data;
    } else {
      return 'Not possible to get the specified cart';
    }
  }

  async getProduct() {
    if (fs.existsSync(this.productPath)) {
      const data = await fs.promises.readFile(this.productPath, 'utf-8');
      return JSON.parse(data);
    }
    await fs.promises.writeFile(this.productPath, JSON.stringify([]));
    return [];
  }

  async readCartId() {
    if (fs.existsSync('./src/cartId.json')) {
      const idString = await fs.promises.readFile('./src/cartId.json', 'utf-8');
      const id = JSON.parse(idString);
      return id;
    }
    await fs.promises.writeFile('./src/cartId.json', JSON.stringify(0));
  }
  async addCart() {
    const cartList = await this.getCarts();
    let idFile = (await this.readCartId()) + 1;
    await fs.promises.writeFile('./src/cartId.json', JSON.stringify(idFile));
    const newCart = { id: idFile, products: [] };
    cartList.push(newCart);
    const cartString = JSON.stringify(cartList);
    await fs.promises.writeFile(this.path, cartString);
  }

  async getCartById(id) {
    const cartList = await this.getCarts();
    let foundCode = cartList.findIndex((element) => element.id === id);
    if (foundCode > -1) {
      return cartList[foundCode].products;
    } else {
      return 'The cart is not existent. Please check the cart ID';
    }
  }

  async addProductToCart(cartId, productId) {
    let data = await this.getProduct();
    let cartList = await this.getCarts();
    let foundCode = data.findIndex((element) => element.id === productId);
    let foundCart = cartList.findIndex((element) => element.id === cartId);
    const quantity = 1;
    if (foundCode === -1 || foundCart === -1) {
      throw new Error('Product or cart not found')
    }
    const products = [...cartList[foundCart].products];
    const isLoaded = products.findIndex((element) => element.id === productId);
    if (isLoaded === -1) {
      products.push({ id: productId, quantity: quantity });
    } else {
      products[isLoaded].quantity = parseInt(products[isLoaded].quantity) + 1;
    }
    cartList[foundCart].products = products;
    await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    return cartList[foundCart];
  }
}

export default CartManager;
