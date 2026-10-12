import { useActionState, useState } from 'react';
import { deriveApiUrl } from '../../api/green-api/index.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { authService } from '../../services/auth.service.ts';
import styles from './LoginPage.module.css';

type TLoginState = { error: string | null };

const initialLoginState: TLoginState = { error: null };

export const LoginPage = () => {
  const { setCredentials } = useAuth();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiUrlManual, setApiUrlManual] = useState(false);

  const handleIdInstanceChange = (value: string) => {
    setIdInstance(value);
    if (!apiUrlManual) {
      setApiUrl(deriveApiUrl(value));
    }
  };

  const [state, formAction, isPending] = useActionState(
    async (_prev: TLoginState, formData: FormData): Promise<TLoginState> => {
      try {
        const credentials = await authService.login({
          idInstance: String(formData.get('idInstance') ?? ''),
          apiTokenInstance: String(formData.get('apiTokenInstance') ?? ''),
          apiUrl: String(formData.get('apiUrl') ?? ''),
        });
        setCredentials(credentials);
        return { error: null };
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Ошибка входа';
        return { error: message };
      }
    },
    initialLoginState,
  );

  return (
    <div className={styles.page}>
      <form className={styles.card} action={formAction}>
        <h1 className={styles.title}>MAX · GREEN-API</h1>
        <p className={styles.subtitle}>Введите данные инстанса из личного кабинета</p>

        <label className={styles.label}>
          idInstance
          <input
            className={styles.input}
            name="idInstance"
            value={idInstance}
            onChange={(e) => handleIdInstanceChange(e.target.value)}
            placeholder="3100123456"
            required
            autoComplete="off"
          />
        </label>

        <label className={styles.label}>
          apiTokenInstance
          <input
            className={styles.input}
            name="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
            autoComplete="off"
          />
        </label>

        <label className={styles.label}>
          apiUrl
          <input
            className={styles.input}
            name="apiUrl"
            value={apiUrl}
            onChange={(e) => {
              setApiUrlManual(true);
              setApiUrl(e.target.value);
            }}
            placeholder="https://3100.api.green-api.com"
            required
          />
        </label>

        {state.error && (
          <p className={styles.error} role="alert" title={state.error}>
            {state.error}
          </p>
        )}

        <button className={styles.button} type="submit" disabled={isPending}>
          {isPending ? 'Проверка…' : 'Войти'}
        </button>
      </form>
    </div>
  );
};
