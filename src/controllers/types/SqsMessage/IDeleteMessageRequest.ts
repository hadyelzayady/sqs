//TODO handle message deletion
export interface IDeleteMessageRequest {
	queueId: string;
	messageId: string;
}

export interface IMessageHandledSuccessfullyRequest {
	queueId: string;
}
