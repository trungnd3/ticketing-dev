import express from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ndtgittix/common';

import { natsWrapper } from '../../nats-wrapper';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';
import { PaymentCreatedPublisher } from '../../events/publishers/payment-created-publisher';

const createRouter = express.Router();

createRouter.post(
  '/',
  requireAuth,
  [
    body('token').trim().notEmpty().withMessage('Token must not be empty'),
    body('orderId').not().isEmpty().withMessage('Order ID must not be empty'),
  ],
  validateRequest,
  async function (req: express.Request, res: express.Response) {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export default createRouter;
