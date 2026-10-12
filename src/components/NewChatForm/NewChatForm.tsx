import { useActionState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useChats } from '../../hooks/useChats.ts';
import { chatService } from '../../services/chat.service.ts';
import styles from './NewChatForm.module.css';

type TFormState = { error: string | null };

const initialState: TFormState = { error: null };

interface INewChatFormProps {
  onClose: () => void;
}

export const NewChatForm = ({ onClose }: INewChatFormProps) => {
  const { credentials } = useAuth();
  const { addChat, setActiveChat, chats } = useChats();

  const [state, formAction, isPending] = useActionState(
    async (_prev: TFormState, formData: FormData): Promise<TFormState> => {
      if (!credentials) return { error: 'Нет учётных данных' };

      try {
        const phone = String(formData.get('phone') ?? '');
        const chat = await chatService.createChat(credentials, phone);
        const existing = chats.find((c) => c.chatId === chat.chatId);
        if (existing) {
          setActiveChat(existing.chatId);
        } else {
          addChat(chat);
        }
        onClose();
        return { error: null };
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Не удалось создать чат';
        return { error: message };
      }
    },
    initialState,
  );

  return (
    <form className={styles.form} action={formAction}>
      <h3 className={styles.title}>Новый чат</h3>
      <label className={styles.label}>
        Номер телефона
        <input
          className={styles.input}
          name="phone"
          type="tel"
          placeholder="79991234567"
          required
          autoFocus
        />
      </label>
      {state.error && <p className={styles.error} role="alert">{state.error}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className={styles.primary} disabled={isPending}>
          {isPending ? 'Проверка…' : 'Создать'}
        </button>
      </div>
    </form>
  );
};
