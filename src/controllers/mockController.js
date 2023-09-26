import { mockService } from "../services/mockService.js";

class MockController {

  getMockProducts = async (req, res) => {
    const response = await mockService.getAllProducts();
    return res.status(response.status).json(response.result);
  };
}

export const mockController = new MockController();
