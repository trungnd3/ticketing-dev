import express from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ndtgittix/common';

import Ticket from '../../models/ticket';

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

    if (existingTicket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    existingTicket.set({ title, price });
    await existingTicket.save();

    res.status(200).send(existingTicket);
  }
);

export default updateRouter;
