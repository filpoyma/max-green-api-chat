import { useEffect, useRef } from 'react';
import { useChats } from '../../hooks/useChats.ts';
import { MessageBubble } from '../MessageBubble/MessageBubble.tsx';
import { MessageInput } from '../MessageInput/MessageInput.tsx';
import styles from './ChatWindow.module.css';

export const ChatWindow = () => {
  const { activeChat, activeMessages, sendMessage } = useChats();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeChat?.chatId]);

  if (!activeChat) {
    return (
      <div className={styles.placeholder}>
        <p>Выберите чат или создайте новый</p>
      </div>
    );
  }

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <div className={styles.headerAvatar}>
          {activeChat.title.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className={styles.headerTitle}>{activeChat.title}</h2>
          {activeChat.phoneNumber && (
            <p className={styles.headerSub}>+{activeChat.phoneNumber}</p>
          )}
        </div>
      </header>

      <div className={styles.messages}>
        {activeMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
};
