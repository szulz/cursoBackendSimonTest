import { TicketsModel } from './models/tickets.model,js';

class TicketsModelLogic {
  async createTicket(ticket) {
    const ticketCreated = await TicketsModel.create({ ...ticket });
    return ticketCreated;
  }
}

export const ticketsModelLogic = new TicketsModelLogic();
