import { messagesModelLogic } from '../DAO/mongo/messages.mongo.js';
import { logger } from '../utils.js';
import errorsNum from '../errors/enum.js';
import CustomError from '../errors/customError.js';

class ChatService {
  async getMessages() {
    const messages = await messagesModelLogic.getMessages();
    if (!messages) {
      logger.alert('Error getting messages from database');
      CustomError.createError({
        name: 'Error getting messages from database',
        cause: 'Messages Model Logic not responding',
        message: 'Messages Model in chatService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return messages;
  }

  async storeMessage(user, msg) {
    const storedMessage = await messagesModelLogic.storeMessages(user,msg);
    if (!storedMessage) {
      logger.info('Error getting messages from database');
      CustomError.createError({
        name: 'Error getting messages from database',
        cause: 'Messages Model Logic not responding',
        message: 'Messages Model in chatService not responding',
        code: errorsNum.DATABASE_ERROR,
      });
    }
    return storedMessage;
  }
}

export const chatService = new ChatService();
