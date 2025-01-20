import { OrderCancelledEvent, Publisher, Subjects } from '@ndtgittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
