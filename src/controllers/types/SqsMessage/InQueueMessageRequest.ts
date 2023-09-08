export interface IInQueueMessageRequest {
  queueId: string;
  body: string;
  sequence: number;
}
