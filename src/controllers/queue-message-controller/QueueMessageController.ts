import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { IReq, IRes } from '../types/express/misc';
import { IInQueueMessageRequest } from '../types/SqsMessage/InQueueMessageRequest';
import MessageQueueSerivce from '@src/services/MessageQueueService';
import SqsMessageMapper from '@src/mappers/SqsMessageMapper';
import { IDeQueueMessageRequest } from '../types/SqsMessage/DeQueueMessageRequest';
import { IDeleteMessageRequest } from '../types/SqsMessage/IDeleteMessageRequest';

async function inQueueMessage(req: IReq<IInQueueMessageRequest>, res: IRes) {
  const inQueuMessageRequest = req.body;
  const result = await MessageQueueSerivce.inQueueMessage(inQueuMessageRequest);

  const resource = SqsMessageMapper.toResource(result);
  return res.status(HttpStatusCodes.OK).json(resource);
}

async function deQueueMessage(req: IReq<IDeQueueMessageRequest>, res: IRes) {
  const deQueuMessageRequest = req.body;
  const result = await MessageQueueSerivce.deQueueMessage(deQueuMessageRequest.queueId);
  if (!result) {
    return res.status(HttpStatusCodes.OK).end();
  }
  const resource = SqsMessageMapper.toResource(result);
  return res.status(HttpStatusCodes.OK).json(resource);
}

async function deleteMessage(req: IReq<IDeleteMessageRequest>, res: IRes) {
  const messageId = req.params.messageId;
  await MessageQueueSerivce.delete(messageId);
  return res.status(HttpStatusCodes.OK).json();
}

export default {
  inQueueMessage,
  deQueueMessage,
  deleteMessage
} as const;
