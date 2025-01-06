import express from 'express';
import { currentUser } from '@ndtgittix/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: express.Request, res: express.Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export default router;
