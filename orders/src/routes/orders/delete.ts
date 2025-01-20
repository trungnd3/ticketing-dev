import express from 'express';
import mongoose from 'mongoose';
import {
  DatabaseConnectionError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@ndtgittix/common';

import Order from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled-publisher';

const updateRouter = express.Router();

updateRouter.delete(
  '/:orderId',
  requireAuth,
  async function (req: express.Request, res: express.Response) {
    const { orderId } = req.params;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(orderId)) {
      throw new NotFoundError();
    }

    let order;
    try {
      order = await Order.findById(orderId).populate('ticket');
    } catch (error) {
      throw new DatabaseConnectionError('Error connect to database');
    }

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event saying that an order has been cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export default updateRouter;
