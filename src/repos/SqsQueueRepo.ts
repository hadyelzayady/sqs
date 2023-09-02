import SqsQueue, { ISqsQueue } from '@src/models/SqsQueue';

const SqsQueueModel = SqsQueue.SqsQueueModel;
async function getOne(name: string): Promise<ISqsQueue | null> {
  const sqsQueue = await SqsQueueModel.findOne({ name });
  return sqsQueue;
}

async function getAll(): Promise<ISqsQueue[]> {
  const queues = await SqsQueueModel.find();
  return queues;
}

async function add(sqsQueue: ISqsQueue): Promise<void> {
  await SqsQueueModel.create(sqsQueue);
  return;
}

async function update(sqsQueue: ISqsQueue): Promise<void> {
  await SqsQueueModel.updateOne({ sqsQueue });
  return;
}

async function delete_(id: number): Promise<void> {
  SqsQueueModel.deleteOne({ id });
}

async function exists(id: number): Promise<boolean> {
  const result = await SqsQueueModel.exists({ id });
  return result !== null;
}
export default {
  getOne,
  getAll,
  add,
  update,
  delete: delete_,
  exists
} as const;
