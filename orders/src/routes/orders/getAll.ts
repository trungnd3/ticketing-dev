import express from 'express';

import { NotFoundError, requireAuth } from '@ndtgittix/common';
import Order from '../../models/order';

const getAllRouter = express.Router();

getAllRouter.get(
  '/',
  requireAuth,
  async function (req: express.Request, res: express.Response) {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      'ticket'
    );

    if (!orders?.length) {
      throw new NotFoundError('No order found.');
    }

    res.status(200).send(orders);
  }
);

export default getAllRouter;
