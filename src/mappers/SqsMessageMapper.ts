import { SqsMessageStatusEnum } from '@src/constants/SqsMessageStatus';
import { ISqsMessageResource } from '@src/controllers/types/SqsMessage/ISqsMessageResource';
import { IInQueueMessageRequest } from '@src/controllers/types/SqsMessage/InQueueMessageRequest';
import { ISqsMessage } from '@src/models/SqsMessage';
import { Types } from 'mongoose';

function InQueueRequestToModel(message: IInQueueMessageRequest): ISqsMessage {
  return {
    queueId: new Types.ObjectId(message.queueId),
    body: message.body,
    id: '',
    status: SqsMessageStatusEnum.IN_QUEUE
  };
}

function toResource(message: ISqsMessage): ISqsMessageResource {
  return {
    id: message._id ?? '',
    body: message.body,
    status: message.status
  };
}

export default {
  InQueueRequestToModel,
  toResource
} as const;
