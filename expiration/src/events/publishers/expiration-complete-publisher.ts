import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@ndtgittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
