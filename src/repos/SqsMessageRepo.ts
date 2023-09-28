import { SqsMessageStatusEnum } from '@src/constants/SqsMessageStatus';
import SqsMessage, { ISqsMessage } from '@src/models/SqsMessage';
import { Optional } from '@src/types/Generics';

const SqsQueueMessageModel = SqsMessage.SqsQueueMessageModel;

async function getOne(name: string): Promise<ISqsMessage | null> {
  const sqsQueue = await SqsQueueMessageModel.findOne({ name });
  return sqsQueue;
}

async function getAll(): Promise<ISqsMessage[]> {
  const queues = await SqsQueueMessageModel.find();
  return queues;
}

async function inQueue(sqsQueue: ISqsMessage): Promise<ISqsMessage> {
  const result = await SqsQueueMessageModel.create(sqsQueue);
  return result;
}

async function update(sqsQueue: ISqsMessage): Promise<void> {
  await SqsQueueMessageModel.updateOne({ sqsQueue });
  return;
}

async function delete_(id: string): Promise<void> {
  await SqsQueueMessageModel.deleteOne({ _id: id });
}

async function exists(id: string): Promise<boolean> {
  const result = await SqsQueueMessageModel.exists({ _id: id });
  return result !== null;
}

async function queueHasInProgressMessages(queueId: string): Promise<boolean> {
  const result = await SqsQueueMessageModel.exists({
    queueId,
    status: SqsMessageStatusEnum.IN_PROCESS
  });
  return result !== null;
}

async function deQueue(queueId: string): Promise<Optional<ISqsMessage>> {
  const result = await SqsQueueMessageModel.findOneAndUpdate(
    {
      queueId
    },
    { $set: { status: SqsMessageStatusEnum.IN_PROCESS } },
    { sort: { createdAt: 1 }, returnDocument: 'before' }
  );
  if (!result || result?.status === SqsMessageStatusEnum.IN_PROCESS) {
    return null;
  }
  result.status = SqsMessageStatusEnum.IN_PROCESS;
  return result;
}

async function getAllByQueueId(queueId: string): Promise<ISqsMessage[]> {
  const result = await SqsQueueMessageModel.find(
    { queueId: queueId },
    undefined,
    {
      sort: { createdAt: 1 }
    }
  );
  return result;
}

async function updateStatus(
  queueId: string,
  messageId: string,
  status: SqsMessageStatusEnum
): Promise<void> {
  await SqsQueueMessageModel.updateOne(
    { queueId: queueId, _id: messageId },
    { $set: { status: status } }
  );
  return;
}

export default {
  getOne,
  getAll,
  inQueue,
  update,
  delete: delete_,
  exists,
  queueHasInProgressMessages,
  deQueue,
  getAllByQueueId,
  updateStatus
} as const;
