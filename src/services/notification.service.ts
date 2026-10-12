import type { IMessage } from '../types/chat.types.ts';
import type { IWebhookBody } from '../types/greenApi.types.ts';

export const parseIncomingTextMessage = (
  body: IWebhookBody,
): IMessage | null => {
  if (body.typeWebhook !== 'incomingMessageReceived') return null;
  if (body.messageData?.typeMessage !== 'textMessage') return null;

  const text = body.messageData.textMessageData?.textMessage;
  const chatId = body.senderData?.chatId;
  const idMessage = body.idMessage;

  if (!text || !chatId || !idMessage) return null;

  const timestamp =
    body.timestamp !== undefined ? body.timestamp * 1000 : Date.now();

  return {
    id: idMessage,
    chatId,
    text,
    direction: 'incoming',
    status: 'sent',
    timestamp,
    idMessage,
  };
};
