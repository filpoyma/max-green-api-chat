import { greenApi } from '../api/green-api/index.ts';
import { deriveApiUrl } from '../api/green-api/greenApi.utils.ts';
import type { ICredentials } from '../types/greenApi.types.ts';

export type TLoginInput = {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
};

const validateCredentials = (input: TLoginInput): ICredentials => {
  const idInstance = input.idInstance.trim();
  const apiTokenInstance = input.apiTokenInstance.trim();
  let apiUrl = input.apiUrl.trim();

  if (!/^\d+$/.test(idInstance)) {
    throw new Error('idInstance должен содержать только цифры');
  }
  if (!apiTokenInstance) {
    throw new Error('Укажите apiTokenInstance');
  }
  if (!apiUrl) {
    apiUrl = deriveApiUrl(idInstance);
  }
  if (!apiUrl.startsWith('https://')) {
    throw new Error('apiUrl должен начинаться с https://');
  }

  return { idInstance, apiTokenInstance, apiUrl };
};

export const authService = {
  async login(input: TLoginInput): Promise<ICredentials> {
    const credentials = validateCredentials(input);
    const { stateInstance } = await greenApi.getStateInstance(credentials);

    if (stateInstance !== 'authorized') {
      throw new Error(
        `Инстанс не авторизован (статус: ${stateInstance}). Авторизуйте инстанс в личном кабинете GREEN-API.`,
      );
    }

    return credentials;
  },
};
