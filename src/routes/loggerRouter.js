import { Router } from 'express';
import {loggerController} from '../controllers/loggerController.js'

const loggerRouter = Router();

loggerRouter.get('/', loggerController.printTest );

export default loggerRouter;
