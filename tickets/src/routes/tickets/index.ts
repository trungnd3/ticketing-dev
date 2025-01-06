import express from 'express';

import createRouter from './create';
import getAllRouter from './getAll';
import getByIdRouter from './getById';
import updateRouter from './update';

const ticketsRouter = express.Router();

ticketsRouter.use(getAllRouter);
ticketsRouter.use(getByIdRouter);
ticketsRouter.use(createRouter);
ticketsRouter.use(updateRouter);

export { ticketsRouter };
