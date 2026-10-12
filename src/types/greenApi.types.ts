export interface ICredentials {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export interface IStateInstanceResponse {
  stateInstance: string;
}

export interface ICheckAccountResponse {
  exist: boolean;
  chatId: string;
  fromCache?: boolean;
  status?: boolean;
  reason?: string;
}

export interface ISendMessageResponse {
  idMessage: string;
}

export interface IReceivedNotification {
  receiptId: number;
  body: IWebhookBody;
}

export interface IWebhookBody {
  typeWebhook: TWebhookType;
  instanceData?: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp?: number;
  idMessage?: string;
  senderData?: {
    chatId: string;
    chatName?: string;
    chatType?: string;
    sender?: string;
    senderName?: string;
    senderPhoneNumber?: number;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
}

export type TWebhookType =
  | 'incomingMessageReceived'
  | 'outgoingMessageStatus'
  | 'stateInstanceChanged'
  | string;
