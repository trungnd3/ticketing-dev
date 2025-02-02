import express from 'express';

import createRouter from './create';

const paymentsRouter = express.Router();

paymentsRouter.use(createRouter);

export { paymentsRouter };
