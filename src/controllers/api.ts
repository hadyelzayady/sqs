import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import QueueRoutes from './QueueController';
import SqsQueue from '@src/models/SqsQueue';

const apiRouter = Router();
const validate = jetValidator();

const userController = Router();
const queueController = Router();

/*
 * SQS Queue
 * */

queueController.get(Paths.Queues.Get, QueueRoutes.getAll);
queueController.post(Paths.Queues.Add, validate(['name']), QueueRoutes.add);

queueController.put(
  Paths.Queues.Update,
  validate(['queue', SqsQueue.isSqsQueueUpdate]),
  QueueRoutes.update
);

queueController.delete(
  Paths.Queues.Delete,
  validate(['id', 'number', 'params']),
  QueueRoutes.delete
);

apiRouter.use(Paths.Users.Base, userController);
apiRouter.use(Paths.Queues.Base, queueController);

export default apiRouter;
