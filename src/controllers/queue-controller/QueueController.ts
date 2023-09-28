import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import SqsQueueService from '@src/services/SqsQueueService';
import { ISqsQueue } from '@src/models/SqsQueue';
import { IReq, IRes } from '../types/express/misc';
import MessageQueueSerivce from '@src/services/MessageQueueService';
import { ISqsMessageResource } from '../types/SqsMessage/ISqsMessageResource';
import SqsMessageMapper from '@src/mappers/SqsMessageMapper';

async function getAll(_: IReq, res: IRes<ISqsQueue[]>) {
  const sqsQueues = await SqsQueueService.getAll();
  return res.status(HttpStatusCodes.OK).json(sqsQueues);
}

async function add(req: IReq<ISqsQueue>, res: IRes<void>) {
  const sqsQueue = req.body;
  await SqsQueueService.addOne(sqsQueue);
  return res.status(HttpStatusCodes.CREATED).end();
}

async function update(req: IReq<ISqsQueue>, res: IRes<void>) {
  const sqsQueue = req.body;
  await SqsQueueService.updateOne(sqsQueue);
  return res.status(HttpStatusCodes.OK).end();
}

async function delete_(req: IReq, res: IRes<void>) {
  const id = +req.params.id;
  await SqsQueueService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}

async function getQueueMessages(req: IReq, res: IRes<ISqsMessageResource[]>) {
  const queueId = req.params.queueId;
  const messages = await MessageQueueSerivce.getAllByQueueId(queueId);
  return res.status(HttpStatusCodes.OK).json(messages.map(SqsMessageMapper.toResource));
}
export default {
  getAll,
  add,
  update,
  delete: delete_,
  getQueueMessages
} as const;
