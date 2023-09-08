import { SqsMessageStatusEnum } from '@src/constants/SqsMessageStatus';
import { Optional } from '@src/types/Generics';
import mongoose, { Types } from 'mongoose';

const INVALID_CONSTRUCTOR_PARAM = `nameOrObj arg must a string or an object with the appropriate sqsQueue keys.`;

export interface ISqsMessage {
  _id?: string;
  id: string;
  queueId: Types.ObjectId;
  body: string;
  sequence: number;
  status?: Optional<SqsMessageStatusEnum>;
}

function new_(
  queueId: string,
  body: string,
  sequence: number,
  id?: string // id last cause usually set by db
): ISqsMessage {
  return {
    id: id ?? '',
    queueId: new Types.ObjectId(queueId),
    body: body,
    sequence: sequence
  };
}

function from(param: object): ISqsMessage {
  if (!isSqsMessage(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get user instance
  const p = param as ISqsMessage;
  return new_(p.queueId.toString(), p.body, p.sequence, p.id);
}

function isSqsMessage(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'queueId' in arg &&
    'id' in arg &&
    'body' in arg &&
    'sequence' in arg
  );
}

const dataSchema = new mongoose.Schema<ISqsMessage>({
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
  sequence: {
    required: true,
    type: Number,
    unique: true
  },
  status: {
    required: true,
    type: String,
    enum: SqsMessageStatusEnum
  }
});

const SqsQueueMessageModel = mongoose.model<ISqsMessage>('SqsQueueMessage', dataSchema);
export default {
  new: new_,
  from,
  isSqsMessage,
  SqsQueueMessageModel
} as const;
