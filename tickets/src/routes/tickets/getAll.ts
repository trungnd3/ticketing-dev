import express from 'express';

import { NotFoundError, requireAuth } from '@ndtgittix/common';
import Ticket from '../../models/ticket';

const getAllRouter = express.Router();

getAllRouter.get(
  '/',
  async function (req: express.Request, res: express.Response) {
    const tickets = await Ticket.find({});

    if (!tickets || !tickets.length) {
      throw new NotFoundError('No ticket found.');
    }

    res.status(200).send(tickets);
  }
);

export default getAllRouter;
