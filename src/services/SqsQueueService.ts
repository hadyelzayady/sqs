import SqsQueueRepo from '@src/repos/SqsQueueRepo';
import { ISqsQueue } from '@src/models/SqsQueue';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

export const SQSQUEUE_NOT_FOUND_ERR = 'sqsQueue not found';

function getAll(): Promise<ISqsQueue[]> {
  return SqsQueueRepo.getAll();
}

function addOne(sqsQueue: ISqsQueue): Promise<void> {
  return SqsQueueRepo.add(sqsQueue);
}

async function updateOne(sqsQueue: ISqsQueue): Promise<void> {
  const persists = await SqsQueueRepo.exists(sqsQueue.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, SQSQUEUE_NOT_FOUND_ERR);
  }
  return SqsQueueRepo.update(sqsQueue);
}

async function _delete(id: number): Promise<void> {
  const persists = await SqsQueueRepo.exists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, SQSQUEUE_NOT_FOUND_ERR);
  }
  return SqsQueueRepo.delete(id);
}

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete
} as const;
