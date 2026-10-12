import { useEffect, useMemo, useRef } from 'react';
import { Phone, Search, Video } from 'lucide-react';
import { useChats } from '../../hooks/useChats.ts';
import type { IMessage } from '../../types/chat.types.ts';
import { MessageBubble } from '../MessageBubble/MessageBubble.tsx';
import { MessageInput } from '../MessageInput/MessageInput.tsx';
import styles from './ChatWindow.module.css';

const formatDateLabel = (ts: number): string =>
  new Date(ts).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const groupMessagesByDate = (
  messages: IMessage[],
): { date: string; items: IMessage[] }[] => {
  const groups: { date: string; items: IMessage[] }[] = [];
  for (const msg of messages) {
    const date = formatDateLabel(msg.timestamp);
    const last = groups[groups.length - 1];
    if (last?.date === date) {
      last.items.push(msg);
    } else {
      groups.push({ date, items: [msg] });
    }
  }
  return groups;
};

export const ChatWindow = () => {
  const { activeChat, activeMessages, sendMessage } = useChats();
  const bottomRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(
    () => groupMessagesByDate(activeMessages),
    [activeMessages],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeChat?.chatId]);

  if (!activeChat) {
    return (
      <div className={styles.placeholder}>
        <p className={styles.placeholderText}>Выберите чат или создайте новый</p>
      </div>
    );
  }

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerAvatar}>
            {activeChat.title.replace(/\D/g, '').slice(-2) || activeChat.title.charAt(0)}
          </div>
          <div>
            <h2 className={styles.headerTitle}>{activeChat.title}</h2>
            <p className={styles.headerSub}>
              {activeChat.phoneNumber
                ? `+${activeChat.phoneNumber}`
                : 'в сети'}
            </p>
          </div>
        </div>
        <div className={styles.headerActions} aria-hidden>
          <span className={styles.headerIcon}>
            <Phone size={20} strokeWidth={1.75} />
          </span>
          <span className={styles.headerIcon}>
            <Video size={22} strokeWidth={1.75} />
          </span>
          <span className={styles.headerIcon}>
            <Search size={20} strokeWidth={1.75} />
          </span>
        </div>
      </header>

      <div className={styles.messages}>
        {groups.map((group) => (
          <div key={group.date}>
            <div className={styles.datePill}>{group.date}</div>
            {group.items.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
};
