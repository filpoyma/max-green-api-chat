import api from '../baseApi.ts';
import type {
  ICheckAccountResponse,
  ICredentials,
  IReceivedNotification,
  ISendMessageResponse,
  IStateInstanceResponse,
} from '../../types/greenApi.types.ts';
import { buildMethodUrl } from './greenApi.utils.ts';

export const greenApi = {
  getStateInstance(credentials: ICredentials): Promise<IStateInstanceResponse> {
    return api.get(buildMethodUrl(credentials, 'getStateInstance')).json();
  },

  checkAccount(
    credentials: ICredentials,
    phoneNumber: number,
  ): Promise<ICheckAccountResponse> {
    return api
      .post(buildMethodUrl(credentials, 'checkAccount'), {
        json: { phoneNumber },
      })
      .json();
  },

  sendMessage(
    credentials: ICredentials,
    chatId: string,
    message: string,
  ): Promise<ISendMessageResponse> {
    return api
      .post(buildMethodUrl(credentials, 'sendMessage'), {
        json: { chatId, message },
      })
      .json();
  },

  receiveNotification(
    credentials: ICredentials,
    receiveTimeout = 20,
  ): Promise<IReceivedNotification | null> {
    return api
      .get(buildMethodUrl(credentials, 'receiveNotification'), {
        searchParams: { receiveTimeout },
      })
      .json<IReceivedNotification | null>();
  },

  deleteNotification(
    credentials: ICredentials,
    receiptId: number,
  ): Promise<void> {
    return api
      .delete(buildMethodUrl(credentials, 'deleteNotification', String(receiptId)))
      .json();
  },
};
