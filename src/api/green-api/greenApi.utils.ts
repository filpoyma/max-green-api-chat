import type { ICredentials } from '../../types/greenApi.types.ts';

export const deriveApiUrl = (idInstance: string): string => {
  const digits = idInstance.replace(/\D/g, '');
  const prefix = digits.slice(0, 4);
  if (prefix.length < 4) return 'https://api.green-api.com';
  return `https://${prefix}.api.green-api.com`;
};

const trimTrailingSlash = (apiUrl: string): string => apiUrl.replace(/\/$/, '');

export const buildMethodUrl = (
  credentials: ICredentials,
  method: string,
  suffix = '',
): string => {
  const { idInstance, apiTokenInstance } = credentials;
  const path = `waInstance${idInstance}/${method}/${apiTokenInstance}`;
  const fullPath = suffix ? `${path}/${suffix}` : path;
  return `${trimTrailingSlash(credentials.apiUrl)}/${fullPath}`;
};

export const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  return digits;
};

export const isValidPhone = (phone: string): boolean => {
  if (!/^\d+$/.test(phone)) return false;
  if (phone.length !== 11 && phone.length !== 12) return false;
  return phone.startsWith('7') || phone.startsWith('375');
};

export const formatPhoneDisplay = (phone: string): string => {
  if (phone.length === 11 && phone.startsWith('7')) {
    return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
  }
  return `+${phone}`;
};
