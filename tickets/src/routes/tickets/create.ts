import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@ndtgittix/common';

import Ticket from '../../models/ticket';
import { TicketCreatedPublisher } from '../../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const createRouter = express.Router();

createRouter.post(
  '/',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title must not be empty'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async function (req: express.Request, res: express.Response) {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export default createRouter;
