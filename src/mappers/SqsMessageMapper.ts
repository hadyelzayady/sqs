import { ISqsMessageResource } from '@src/controllers/types/SqsMessage/ISqsMessageResource';
import { IInQueueMessageRequest } from '@src/controllers/types/SqsMessage/InQueueMessageRequest';
import { ISqsMessage } from '@src/models/SqsMessage';
import { Types } from 'mongoose';

function InQueueRequestToModel(message: IInQueueMessageRequest): ISqsMessage {
  return {
    queueId: new Types.ObjectId(message.queueId),
    body: message.body,
    sequence: message.sequence,
    id: ''
  };
}

function toResource(message: ISqsMessage): ISqsMessageResource {
  return {
    id: message._id ?? '',
    sequence: message.sequence,
    body: message.body
  };
}

export default {
  InQueueRequestToModel,
  toResource
} as const;
