import { OrderCreatedEvent, Publisher, Subjects } from '@ndtgittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
