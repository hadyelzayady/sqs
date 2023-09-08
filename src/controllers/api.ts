import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import QueueController from './queue-controller/QueueController';
import SqsQueue from '@src/models/SqsQueue';
import QueueMessageController from './queue-message-controller/QueueMessageController';

const apiRouter = Router();
const validate = jetValidator();

const queueController = Router();
const queueMessageController = Router();

/*
 * SQS Queue
 *
 */

queueController.get(Paths.Queues.Get, QueueController.getAll);
queueController.get(Paths.Queues.messages, QueueController.getQueueMessages);
queueController.post(Paths.Queues.Add, validate(['name']), QueueController.add);
queueController.put(
  Paths.Queues.Update,
  validate(['queue', SqsQueue.isSqsQueueUpdate]),
  QueueController.update
);
queueController.delete(
  Paths.Queues.Delete,
  validate(['id', 'number', 'params']),
  QueueController.delete
);
apiRouter.use(Paths.Queues.Base, queueController);

/*
 * SQS Messages
 *
 */
queueMessageController.post(Paths.Messages.InQueue, QueueMessageController.inQueueMessage);
queueMessageController.post(Paths.Messages.DeQueue, QueueMessageController.deQueueMessage);
queueMessageController.delete(Paths.Messages.Delete, QueueMessageController.deleteMessage);
apiRouter.use(Paths.Messages.Base, queueMessageController);

export default apiRouter;
