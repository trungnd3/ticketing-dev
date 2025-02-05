import { ITicket } from './ticket';

export interface IOrder {
  id: string;
  userId: string;
  status: string;
  expiresAt: string;
  ticket: ITicket;
}
