// **** Variables **** //

import mongoose from 'mongoose';

const INVALID_CONSTRUCTOR_PARAM = `nameOrObj arg must a string or an object with the appropriate sqsQueue keys.`;

export interface ISqsQueue {
  id: number;
  name: string;
}

function new_(
  name?: string,
  id?: number // id last cause usually set by db
): ISqsQueue {
  return {
    id: id ?? -1,
    name: name ?? ''
  };
}

function from(param: object): ISqsQueue {
  if (!isSqsQueue(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get user instance
  const p = param as ISqsQueue;
  return new_(p.name, p.id);
}

function isSqsQueue(arg: unknown): boolean {
  return !!arg && typeof arg === 'object' && 'id' in arg && 'name' in arg;
}

function isSqsQueueAdd(arg: unknown): boolean {
  return !!arg && typeof arg === 'object' && 'name' in arg;
}

function isSqsQueueUpdate(arg: unknown): boolean {
  return isSqsQueueAdd(arg);
}

const dataSchema = new mongoose.Schema<ISqsQueue>({
  id: {
    type: Number
  },
  name: {
    required: true,
    type: String
  }
});

const SqsQueueModel = mongoose.model<ISqsQueue>('SqsQueue', dataSchema);
export default {
  new: new_,
  from,
  isSqsQueue,
  isSqsQueueAdd,
  isSqsQueueUpdate,
  SqsQueueModel
} as const;
