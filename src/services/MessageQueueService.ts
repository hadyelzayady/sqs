import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ISqsMessage } from '@src/models/SqsMessage';
import { RouteError } from '@src/other/classes';
import SqsMessageRepo from '@src/repos/SqsMessageRepo';
import { SQSQUEUE_NOT_FOUND_ERR } from './SqsQueueService';
import { IInQueueMessageRequest } from '@src/controllers/types/SqsMessage/InQueueMessageRequest';
import SqsMessageMapper from '@src/mappers/SqsMessageMapper';
import { SqsMessageStatusEnum } from '@src/constants/SqsMessageStatus';
import { Optional } from '@src/types/Generics';
import { VISIBILITY_TIMEOUT } from '@src/constants/SqsMessageConfig';

let x = 0;
//TODO make distributed queue message service
function inQueueMessage(sqsMessage: IInQueueMessageRequest): Promise<ISqsMessage> {
  const inQueueMessage = SqsMessageMapper.InQueueRequestToModel(sqsMessage);
  inQueueMessage.status = SqsMessageStatusEnum.IN_QUEUE;
  return SqsMessageRepo.inQueue(inQueueMessage);
}

async function deQueueMessage(queueId: string): Promise<Optional<ISqsMessage>> {
  const queueItem = await SqsMessageRepo.deQueue(queueId);
  if (queueItem) {
    setTimeout(
      async (queueId, messageId) => {
        await SqsMessageRepo.updateStatus(queueId, messageId, SqsMessageStatusEnum.IN_QUEUE);
      },
      VISIBILITY_TIMEOUT,
      queueId,
      queueItem._id as string
    );
  }
  return queueItem;
}

function getAll(): Promise<ISqsMessage[]> {
  return SqsMessageRepo.getAll();
}

async function updateOne(sqsQueue: ISqsMessage): Promise<void> {
  const persists = await SqsMessageRepo.exists(sqsQueue.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, SQSQUEUE_NOT_FOUND_ERR);
  }
  return SqsMessageRepo.update(sqsQueue);
}

async function _delete(id: string): Promise<void> {
  const persists = await SqsMessageRepo.exists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, SQSQUEUE_NOT_FOUND_ERR);
  }
  return SqsMessageRepo.delete(id);
}

async function getAllByQueueId(queueId: string): Promise<ISqsMessage[]> {
  return SqsMessageRepo.getAllByQueueId(queueId);
}

export default {
  getAll,
  updateOne,
  delete: _delete,
  inQueueMessage,
  deQueueMessage,
  getAllByQueueId
} as const;
