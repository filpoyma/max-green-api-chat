import ky, { isHTTPError, type BeforeErrorHook } from 'ky';

type TApiErrorBody = { message?: unknown };

const errorInterceptor: BeforeErrorHook = async (input) => {
  const { error } = input;
  if (!isHTTPError(error)) return error;

  try {
    const data: unknown = await error.response.clone().json();
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as TApiErrorBody).message;
      if (typeof message === 'string') error.message = message;
    }
  } catch {
    const text = await error.response.clone().text().catch(() => '');
    if (text) error.message = text;
  }

  if (
    error.response.status === 400 &&
    error.message.toLowerCase().includes('webhook')
  ) {
    error.message =
      'У инстанса задан webhookUrl. Очистите его в личном кабинете GREEN-API и подождите около минуты.';
  }

  return error;
};

const api = ky.create({
  timeout: 25_000,
  hooks: {
    beforeError: [errorInterceptor],
  },
});

export default api;
