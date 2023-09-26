import express from 'express';
import { MessagesModel } from '../DAO/mongo/models/messages.model.js';
import { chatController } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/', chatController.getMessages);

chatRouter.get('/getchat', chatController.getChat);

chatRouter.post('/', chatController.storeMessage);

export default chatRouter;
