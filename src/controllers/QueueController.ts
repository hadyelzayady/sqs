import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import SqsQueueService from '@src/services/SqsQueueService';
import { ISqsQueue } from '@src/models/SqsQueue';
import { IReq, IRes } from './types/express/misc';

async function getAll(_: IReq, res: IRes) {
  const sqsQueues = await SqsQueueService.getAll();
  return res.status(HttpStatusCodes.OK).json({ sqsQueues });
}

async function add(req: IReq<ISqsQueue>, res: IRes) {
  const sqsQueue = req.body;
  await SqsQueueService.addOne(sqsQueue);
  return res.status(HttpStatusCodes.CREATED).end();
}

async function update(req: IReq<{ sqsQueue: ISqsQueue }>, res: IRes) {
  const { sqsQueue } = req.body;
  await SqsQueueService.updateOne(sqsQueue);
  return res.status(HttpStatusCodes.OK).end();
}

async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await SqsQueueService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_
} as const;
