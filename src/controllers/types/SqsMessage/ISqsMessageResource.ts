import { SqsMessageStatusEnum } from '@src/constants/SqsMessageStatus';

export interface ISqsMessageResource {
  id: string;
  body: string;
  status: SqsMessageStatusEnum;
}
