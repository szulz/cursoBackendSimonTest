import express from 'express';
import { mockController } from '../controllers/mockController.js';

const mockRouter = express.Router();

mockRouter.get('/', mockController.getMockProducts);

export default mockRouter;
