import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { ISqsMessage } from "@src/models/SqsMessage";
import { RouteError } from "@src/other/classes";
import SqsMessageRepo from "@src/repos/SqsMessageRepo";
import { SQSQUEUE_NOT_FOUND_ERR } from "./SqsQueueService";
import { IInQueueMessageRequest } from "@src/controllers/types/SqsMessage/InQueueMessageRequest";
import SqsMessageMapper from "@src/mappers/SqsMessageMapper";
import { SqsMessageStatusEnum } from "@src/constants/SqsMessageStatus";
import { Optional } from "@src/types/Generics";
import { VISIBILITY_TIMEOUT } from "@src/constants/SqsMessageConfig";
import SqsQueueRepo from "@src/repos/SqsQueueRepo";

//TODO make distributed queue message service
function inQueueMessage(
	sqsMessage: IInQueueMessageRequest,
): Promise<ISqsMessage> {
	const inQueueMessage = SqsMessageMapper.InQueueRequestToModel(sqsMessage);
	inQueueMessage.status = SqsMessageStatusEnum.IN_QUEUE;
	return SqsMessageRepo.inQueue(inQueueMessage);
}

async function deQueueMessage(queueId: string): Promise<ISqsMessage[]> {
	const batchSize = await SqsQueueRepo.getQueueBatchSize(queueId);
	const queueItems = await SqsMessageRepo.deQueue(queueId, batchSize);
	if (queueItems.length > 0) {
		setTimeout(
			async (queueId, messageIds) => {
				await SqsMessageRepo.updateStatusMany(
					queueId,
					messageIds,
					SqsMessageStatusEnum.IN_QUEUE,
				);
			},
			VISIBILITY_TIMEOUT,
			queueId,
			queueItems.map((item) => item._id as string),
		);
	}
	return queueItems;
}

function getAll(): Promise<ISqsMessage[]> {
	return SqsMessageRepo.getAll();
}

async function updateOne(sqsQueue: ISqsMessage): Promise<void> {
	const persists = await SqsMessageRepo.exists(sqsQueue.id);
	if (!persists) {
		throw new RouteError(HttpStatusCodes.NOT_FOUND, SQSQUEUE_NOT_FOUND_ERR);
	}
	return SqsMessageRepo.update(sqsQueue);
}

async function _delete(id: string): Promise<void> {
	const persists = await SqsMessageRepo.exists(id);
	if (!persists) {
		throw new RouteError(HttpStatusCodes.NOT_FOUND, SQSQUEUE_NOT_FOUND_ERR);
	}
	return SqsMessageRepo.delete(id);
}

async function getAllByQueueId(queueId: string): Promise<ISqsMessage[]> {
	return SqsMessageRepo.getAllByQueueId(queueId);
}

export default {
	getAll,
	updateOne,
	delete: _delete,
	inQueueMessage,
	deQueueMessage,
	getAllByQueueId,
} as const;
