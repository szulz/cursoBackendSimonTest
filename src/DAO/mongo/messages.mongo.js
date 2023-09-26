import { MessagesModel } from './models/messages.model.js';
import { logger } from '../../utils.js';

class MessagesModelLogic {
  async getMessages() {
    try {
      const messages = await MessagesModel.find({}).lean().sort({ _id: -1 });
      return messages;
    } catch (error) {
      logger.alert('Couldnt retrieve messages from model');
      throw 'Error retrieving messages';
    }
  }

  async storeMessages({user, msg}) {
    const storedMessage = await MessagesModel.create({ user, msg });
    return storedMessage;
  }
}

export const messagesModelLogic = new MessagesModelLogic();
