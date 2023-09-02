import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import User from '@src/models/User';
import UserRoutes from './UserRoutes';
import QueueRoutes from './QueueRoutes';
import SqsQueue from '@src/models/SqsQueue';

const apiRouter = Router();
const validate = jetValidator();

const userRouter = Router();
const queueRouter = Router();

userRouter.get(Paths.Users.Get, UserRoutes.getAll);

userRouter.post(Paths.Users.Add, validate(['user', User.isUser]), UserRoutes.add);

userRouter.put(Paths.Users.Update, validate(['user', User.isUser]), UserRoutes.update);

userRouter.delete(Paths.Users.Delete, validate(['id', 'number', 'params']), UserRoutes.delete);

/*
 * SQS Queue
 * */

queueRouter.get(Paths.Queues.Get, QueueRoutes.getAll);
queueRouter.post(Paths.Queues.Add, validate(['name']), QueueRoutes.add);

queueRouter.put(
  Paths.Queues.Update,
  validate(['queue', SqsQueue.isSqsQueueUpdate]),
  QueueRoutes.update
);

queueRouter.delete(Paths.Queues.Delete, validate(['id', 'number', 'params']), QueueRoutes.delete);

apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Queues.Base, queueRouter);

export default apiRouter;
