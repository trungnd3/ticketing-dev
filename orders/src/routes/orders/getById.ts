import express from 'express';
import {
  DatabaseConnectionError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@ndtgittix/common';
import Order from '../../models/order';
import mongoose from 'mongoose';

const singleByIdRouter = express.Router();

singleByIdRouter.get(
  '/:id',
  requireAuth,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(id)) {
      throw new NotFoundError();
    }

    let order;
    try {
      order = await Order.findById(id).populate('ticket');
    } catch (error) {
      throw new DatabaseConnectionError('Error connect to database');
    }

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export default singleByIdRouter;
