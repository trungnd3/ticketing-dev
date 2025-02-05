import express from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ndtgittix/common';

import Ticket from '../../models/ticket';
import { TicketUpdatedPublisher } from '../../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const updateRouter = express.Router();

updateRouter.put(
  '/:id',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title must not be empty'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async function (req: express.Request, res: express.Response) {
    const { id } = req.params;

    const existingTicket = await Ticket.findById(id);
    if (!existingTicket) {
      throw new NotFoundError('Ticket does not exist.');
    }

    if (existingTicket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket.');
    }

    if (existingTicket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    existingTicket.set({ title, price });
    await existingTicket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: existingTicket.id,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      version: existingTicket.version,
    });

    res.status(200).send(existingTicket);
  }
);

export default updateRouter;
