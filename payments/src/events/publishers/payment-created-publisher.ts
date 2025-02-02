import { PaymentCreatedEvent, Publisher, Subjects } from '@ndtgittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
