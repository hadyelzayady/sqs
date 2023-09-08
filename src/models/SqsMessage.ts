import { SqsMessageStatusEnum } from '@src/constants/SqsMessageStatus';
import mongoose, { Types } from 'mongoose';
import { ITimestampModel } from './ITimestampModel';

const INVALID_CONSTRUCTOR_PARAM = `nameOrObj arg must a string or an object with the appropriate sqsQueue keys.`;

export interface ISqsMessage extends ITimestampModel {
  _id?: string;
  id: string;
  queueId: Types.ObjectId;
  body: string;
  status: SqsMessageStatusEnum;
}

function new_(
  queueId: string,
  body: string,
  id?: string // id last cause usually set by db
): ISqsMessage {
  return {
    id: id ?? '',
    queueId: new Types.ObjectId(queueId),
    body: body,
    status: SqsMessageStatusEnum.IN_QUEUE
  };
}

function from(param: object): ISqsMessage {
  if (!isSqsMessage(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get user instance
  const p = param as ISqsMessage;
  return new_(p.queueId.toString(), p.body, p.id);
}

function isSqsMessage(arg: unknown): boolean {
  return !!arg && typeof arg === 'object' && 'queueId' in arg && 'id' in arg && 'body' in arg;
}

const dataSchema = new mongoose.Schema<ISqsMessage>(
  {
    id: {
      type: String
    },
    body: {
      required: true,
      type: String
    },
    queueId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SqsQueue'
    },
    status: {
      required: true,
      type: String,
      enum: SqsMessageStatusEnum
    }
  },
  { timestamps: true }
);

const SqsQueueMessageModel = mongoose.model<ISqsMessage>('SqsQueueMessage', dataSchema);
export default {
  new: new_,
  from,
  isSqsMessage,
  SqsQueueMessageModel
} as const;
