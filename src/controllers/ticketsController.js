import { ticketService } from '../services/ticketsService.js';
import { cartController } from './carts.controller.js';

class TicketController {
  async createTicket() {
    const ticket = {};
    const code = self.crypto.randomUUID();
    const cartId = cartController.getCartId();
    const cart = cartController.getCart(cartId);
    console.log(cart);
    const amount = cart.products.map(item => {
        const total = item.quantity * item.price;
        return { ...item, total };
      });
    console.log(amount)
    /* const amount = cart.products.map(item=>item.amount*item.price) */
    ticket.code = code;
    ticket.email = req.session.user.email;
    ticket.amount = amount
  }
}
