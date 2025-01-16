import { Publisher, Subjects, TicketCreatedEvent } from '@ndtgittix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
