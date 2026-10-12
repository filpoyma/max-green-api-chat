import { useState, type KeyboardEvent } from 'react';
import { ArrowUp, Paperclip, Smile } from 'lucide-react';
import styles from './MessageInput.module.css';

interface IMessageInputProps {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: IMessageInputProps) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const value = text.trim();
    if (!value || sending || disabled) return;

    setSending(true);
    setError(null);
    try {
      await onSend(value);
      setText('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка отправки');
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className={styles.wrap}>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.bar}>
        <span className={styles.iconSlot} aria-hidden>
          <Paperclip size={20} strokeWidth={1.75} />
        </span>
        <textarea
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Сообщение"
          rows={1}
          maxLength={4000}
          disabled={disabled || sending}
        />
        <span className={styles.iconSlot} aria-hidden>
          <Smile size={20} strokeWidth={1.75} />
        </span>
        <button
          type="button"
          className={styles.send}
          onClick={() => void handleSend()}
          disabled={disabled || sending || !text.trim()}
          aria-label="Отправить"
        >
          <ArrowUp size={20} strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  );
};
