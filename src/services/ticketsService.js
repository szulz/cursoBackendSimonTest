import { ticketsModelLogic } from '../DAO/mongo/tickets.mongo.js';

class TicketsService {
  async createTicket(ticket) {
    const ticketCreate = ticketsModelLogic.createTicket(ticket);
    return ticketCreate;
  }
}

export const ticketService = new TicketsService();
