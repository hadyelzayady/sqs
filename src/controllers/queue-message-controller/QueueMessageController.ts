import { ISqsMessageResource } from "../types/SqsMessage/ISqsMessageResource";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { IReq, IRes } from "../types/express/misc";
import { IInQueueMessageRequest } from "../types/SqsMessage/InQueueMessageRequest";
import MessageQueueSerivce from "@src/services/MessageQueueService";
import SqsMessageMapper from "@src/mappers/SqsMessageMapper";
import { IDeQueueMessageRequest } from "../types/SqsMessage/DeQueueMessageRequest";
import {
	IDeleteMessageRequest,
	IMessageHandledSuccessfullyRequest,
} from "../types/SqsMessage/IDeleteMessageRequest";

async function inQueueMessage(
	req: IReq<IInQueueMessageRequest>,
	res: IRes<ISqsMessageResource>,
) {
	const inQueuMessageRequest = req.body;
	console.log(req.body);
	const result = await MessageQueueSerivce.inQueueMessage(inQueuMessageRequest);

	const resource = SqsMessageMapper.toResource(result);
	return res.status(HttpStatusCodes.OK).json(resource);
}

async function deQueueMessage(
	req: IReq<IDeQueueMessageRequest>,
	res: IRes<ISqsMessageResource[]>,
) {
	const deQueuMessageRequest = req.body;
	const result = await MessageQueueSerivce.deQueueMessage(
		deQueuMessageRequest.queueId,
	);
	if (!result) {
		return res.status(HttpStatusCodes.OK).end();
	}
	const resources = result.map(SqsMessageMapper.toResource);
	return res.status(HttpStatusCodes.OK).json(resources);
}

async function deleteMessage(
	req: IReq<IDeleteMessageRequest>,
	res: IRes<void>,
) {
	const messageId = req.params.messageId;
	await MessageQueueSerivce.delete(messageId);
	return res.status(HttpStatusCodes.OK).json();
}

async function messagesHandledSuccessfully(
	req: IReq<IMessageHandledSuccessfullyRequest>,
	res: IRes<void>,
) {
	console.log("handler");
	const queueId = req.params.queueId;
	await MessageQueueSerivce.messagesHandledSuccessfully(queueId);
	return res.status(HttpStatusCodes.OK).json();
}

export default {
	inQueueMessage,
	deQueueMessage,
	deleteMessage,
	messagesHandledSuccessfully,
} as const;
