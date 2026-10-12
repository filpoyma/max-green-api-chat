import { greenApi } from '../api/green-api/index.ts';
import {
  formatPhoneDisplay,
  isValidPhone,
  normalizePhone,
} from '../api/green-api/greenApi.utils.ts';
import type { ICredentials } from '../types/greenApi.types.ts';
import type { IChat } from '../types/chat.types.ts';

export const chatService = {
  async createChat(credentials: ICredentials, phoneRaw: string): Promise<IChat> {
    const phoneNumber = normalizePhone(phoneRaw);
    if (!isValidPhone(phoneNumber)) {
      throw new Error(
        'Номер должен содержать 11 или 12 цифр и начинаться с 7 или 375',
      );
    }

    const response = await greenApi.checkAccount(
      credentials,
      Number(phoneNumber),
    );

    if (response.status === false && response.reason) {
      throw new Error(response.reason);
    }

    if (!response.exist || !response.chatId) {
      throw new Error('У номера нет аккаунта MAX');
    }

    const now = Date.now();
    return {
      chatId: response.chatId,
      phoneNumber,
      title: formatPhoneDisplay(phoneNumber),
      lastMessageAt: now,
    };
  },

  async sendMessage(
    credentials: ICredentials,
    chatId: string,
    message: string,
  ): Promise<string> {
    const text = message.trim();
    if (!text) {
      throw new Error('Введите текст сообщения');
    }
    if (text.length > 4000) {
      throw new Error('Сообщение не должно превышать 4000 символов');
    }

    const { idMessage } = await greenApi.sendMessage(credentials, chatId, text);
    return idMessage;
  },
};
