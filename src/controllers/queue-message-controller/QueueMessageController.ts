import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { IDeleteMessageRequest } from '../types/SqsMessage/IDeleteMessageRequest';
import { ISqsMessageResource } from '../types/SqsMessage/ISqsMessageResource';
import { IInQueueMessageRequest } from '../types/SqsMessage/InQueueMessageRequest';
import { IReq, IRes } from '../types/express/misc';
import MessageQueueSerivce from '@src/services/MessageQueueService';
import { IDeQueueMessageRequest } from '../types/SqsMessage/DeQueueMessageRequest';
import SqsMessageMapper from '@src/mappers/SqsMessageMapper';

async function inQueueMessage(
  req: IReq<IInQueueMessageRequest>,
  res: IRes<ISqsMessageResource>
) {
  const inQueuMessageRequest = req.body;
  const result = await MessageQueueSerivce.inQueueMessage(inQueuMessageRequest);

  const resource = SqsMessageMapper.toResource(result);
  return res.status(HttpStatusCodes.OK).json(resource);
}

async function deQueueMessage(
  req: IReq<IDeQueueMessageRequest>,
  res: IRes<ISqsMessageResource>
) {
  const deQueuMessageRequest = req.body;
  const result = await MessageQueueSerivce.deQueueMessage(deQueuMessageRequest.queueId);
  if (!result) {
    return res.status(HttpStatusCodes.OK).end();
  }
  const resource = SqsMessageMapper.toResource(result);
  return res.status(HttpStatusCodes.OK).json(resource);
}

async function deleteMessage(req: IReq<IDeleteMessageRequest>, res: IRes<void>) {
  const messageId = req.params.messageId;
  await MessageQueueSerivce.delete(messageId);
  return res.status(HttpStatusCodes.OK).json();
}

export default {
  inQueueMessage,
  deQueueMessage,
  deleteMessage
} as const;
