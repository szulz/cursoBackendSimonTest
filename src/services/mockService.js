import { faker } from '@faker-js/faker';

class MockService {
  getAllProducts() {
    try {
      const products = [];

      const generateProduct = () => {
        return {
          _id: faker.database.mongodbObjectId(),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price({ min: 10000, max: 100000, dec: 0 }),
          thumbnails: [faker.image.avatarGitHub()],
          code: `a${faker.finance.pin(4)}`,
          stock: faker.number.int({ max: 30 }),
          category: faker.commerce.department(),
          status: faker.datatype.boolean(),
        };
      };

      do {
        products.push(generateProduct());
      } while (products.length < 100);

      return { status: 200, result: { status: 'success', payload: products } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }
}

export const mockService = new MockService();
