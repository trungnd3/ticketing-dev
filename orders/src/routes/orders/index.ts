import express from 'express';

import createRouter from './create';
import getAllRouter from './getAll';
import getByIdRouter from './getById';
import deleteRouter from './delete';

const ordersRouter = express.Router();

ordersRouter.use(getAllRouter);
ordersRouter.use(getByIdRouter);
ordersRouter.use(createRouter);
ordersRouter.use(deleteRouter);

export { ordersRouter };
