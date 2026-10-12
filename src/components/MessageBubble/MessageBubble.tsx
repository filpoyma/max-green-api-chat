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
          {isOutgoing && message.status === 'pending' && (
            <span className={styles.status}>…</span>
          )}
          {isOutgoing && message.status === 'failed' && (
            <span className={styles.statusFailed}>ошибка</span>
          )}
        </div>
      </div>
    </div>
  );
};
