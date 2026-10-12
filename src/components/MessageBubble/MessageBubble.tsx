import { Check, CircleAlert, Clock } from 'lucide-react';
import type { IMessage } from '../../types/chat.types.ts';
import styles from './MessageBubble.module.css';

interface IMessageBubbleProps {
  message: IMessage;
}

const formatTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const MessageBubble = ({ message }: IMessageBubbleProps) => {
  const isOutgoing = message.direction === 'outgoing';

  return (
    <div
      className={
        isOutgoing ? `${styles.row} ${styles.rowOutgoing}` : styles.row
      }
    >
      <div
        className={
          isOutgoing
            ? `${styles.bubble} ${styles.bubbleOutgoing}`
            : styles.bubble
        }
      >
        <p className={styles.text}>{message.text}</p>
        <div className={styles.footer}>
          <time className={styles.time}>{formatTime(message.timestamp)}</time>
          {isOutgoing && message.status === 'sent' && (
            <Check className={styles.status} size={14} strokeWidth={2.25} aria-label="Отправлено" />
          )}
          {isOutgoing && message.status === 'pending' && (
            <Clock className={styles.status} size={12} strokeWidth={2} aria-label="Отправляется" />
          )}
          {isOutgoing && message.status === 'failed' && (
            <CircleAlert className={styles.statusFailed} size={14} strokeWidth={2} aria-label="Ошибка" />
          )}
        </div>
      </div>
    </div>
  );
};
