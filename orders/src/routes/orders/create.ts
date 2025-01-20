import express from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ndtgittix/common';

import Order from '../../models/order';
import Ticket from '../../models/ticket';
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const createRouter = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

createRouter.post(
  '/',
  requireAuth,
  [
    body('ticketId')
      .trim()
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // making assumption here that the ticket service is using mongodb, which might not be true
      .withMessage('Ticket ID must be provided'),
  ],
  validateRequest,
  async function (req: express.Request, res: express.Response) {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Make sure that this ticket is not already reserved
    if (await ticket.isReserved()) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order has been created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: OrderStatus.Created,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export default createRouter;
