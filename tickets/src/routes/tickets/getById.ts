import express from 'express';
import {
  DatabaseConnectionError,
  NotFoundError,
  requireAuth,
} from '@ndtgittix/common';
import Ticket from '../../models/ticket';
import mongoose from 'mongoose';

const singleByIdRouter = express.Router();

singleByIdRouter.get(
  '/:id',
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

    let ticket;
    try {
      ticket = await Ticket.findById(id);
    } catch (error) {
      throw new DatabaseConnectionError('Error connect to database');
    }

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  }
);

export default singleByIdRouter;
