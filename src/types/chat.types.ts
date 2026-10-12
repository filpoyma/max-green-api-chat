export type TMessageDirection = 'incoming' | 'outgoing';

export type TMessageStatus = 'pending' | 'sent' | 'failed';

export interface IMessage {
  id: string;
  chatId: string;
  text: string;
  direction: TMessageDirection;
  status: TMessageStatus;
  timestamp: number;
  idMessage?: string;
}

export interface IChat {
  chatId: string;
  phoneNumber: string;
  title: string;
  lastMessageAt: number;
}
