import { Server } from 'socket.io';
import { chatService } from './services/chatService.js';
import ProductManager from './productManager.js';
const PM = new ProductManager('./src/products.json', './src/id.json');

const socketServer = (httpServer) => {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('productAdd', async (data) => {
      const product = await PM.addProduct(data);
      socketServer.emit('productAdded', product);
    });

    socket.on('productDelete', async (id) => {
      await PM.deleteProduct(id);
      socketServer.emit('productDeleted', id);
    });
  });

  socket.on('new-message', async (data) => {
    try {
      newMessage = await chatService.storeMessage(data);

      const allMsgs = await chatService.getMessages();

      io.emit('chat-message', allMsgs);
    } catch (error) {
      console.log(error);
    }
  });

  return socketServer;
};

export default socketServer;
