import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@ndtgittix/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import Ticket from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // In case don't use 'mongoose-update-if-current' library
    // ticket.set({ title, price, version });

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
