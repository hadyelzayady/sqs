import { SqsMessageStatusEnum } from "@src/constants/SqsMessageStatus";
import SqsMessage, { ISqsMessage } from "@src/models/SqsMessage";
import mongoose from "mongoose";
import { setTimeout } from "timers/promises";

const SqsQueueMessageModel = SqsMessage.SqsQueueMessageModel;

async function getOne(name: string): Promise<ISqsMessage | null> {
	const sqsQueue = await SqsQueueMessageModel.findOne({ name });
	return sqsQueue;
}

async function getAll(): Promise<ISqsMessage[]> {
	const queues = await SqsQueueMessageModel.find();
	return queues;
}

async function inQueue(sqsQueue: ISqsMessage): Promise<ISqsMessage> {
	const result = await SqsQueueMessageModel.create(sqsQueue);
	return result;
}

async function update(sqsQueue: ISqsMessage): Promise<void> {
	await SqsQueueMessageModel.updateOne({ sqsQueue });
	return;
}

async function delete_(id: string): Promise<void> {
	await SqsQueueMessageModel.deleteOne({ _id: id });
}

async function exists(id: string): Promise<boolean> {
	const result = await SqsQueueMessageModel.exists({ _id: id });
	return result !== null;
}

async function queueHasInProgressMessages(queueId: string): Promise<boolean> {
	const result = await SqsQueueMessageModel.exists({
		queueId,
		status: SqsMessageStatusEnum.IN_PROCESS,
	});
	return result !== null;
}

let x = 0;
async function deQueue(
	queueId: string,
	batchSize: number,
): Promise<ISqsMessage[]> {
	// TODO try using mutex lock
	const session = await mongoose.startSession({
		defaultTransactionOptions: {
			maxTimeMS: 15000,
			retryWrites: true,
		},
	});
	session.startTransaction();
	const updatedMessages = await SqsQueueMessageModel.find(
		{
			queueId,
		},
		null,
		{ sort: { createdAt: 1 }, limit: batchSize },
	).session(session);

	console.log("updatedMessages", updatedMessages, x);
	if (x === 0) {
		x = x + 1;
		await setTimeout(5000);
	} else {
		x = 0;
	}
	if (
		updatedMessages.some(
			(item) => item.status === SqsMessageStatusEnum.IN_PROCESS,
		)
	) {
		session.abortTransaction();
		return [];
	}
	try {
		await SqsQueueMessageModel.updateMany(
			{
				_id: { $in: updatedMessages.map((item) => item._id) },
			},
			{ $set: { status: SqsMessageStatusEnum.IN_PROCESS } },
		).session(session);

		console.log("commit");
		const result = await session.commitTransaction();
		const resultMessages = await SqsQueueMessageModel.find(
			{
				queueId,
			},
			null,
			{ sort: { createdAt: 1 }, limit: batchSize },
		).session(session);
		console.log("result", result);
		return resultMessages;
	} catch (ex) {
		console.log("ex", ex);
		return [];
	}
}

async function getAllByQueueId(queueId: string): Promise<ISqsMessage[]> {
	const result = await SqsQueueMessageModel.find(
		{ queueId: queueId },
		undefined,
		{
			sort: { createdAt: 1 },
		},
	);
	return result;
}

async function updateStatusMany(
	queueId: string,
	messageIds: string[],
	status: SqsMessageStatusEnum,
): Promise<void> {
	await SqsQueueMessageModel.updateMany(
		{ queueId: queueId, _id: { $in: messageIds } },
		{ $set: { status: status } },
	);
	return;
}
async function deleteVisible(queueId: string) {
	return await SqsQueueMessageModel.deleteMany({
		queueId: queueId,
		status: SqsMessageStatusEnum.IN_PROCESS,
	});
}

export default {
	getOne,
	getAll,
	inQueue,
	update,
	delete: delete_,
	exists,
	queueHasInProgressMessages,
	deQueue,
	getAllByQueueId,
	updateStatusMany,
	deleteVisible,
} as const;
