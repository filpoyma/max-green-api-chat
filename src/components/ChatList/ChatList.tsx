import { useState } from 'react';
import { useChats } from '../../hooks/useChats.ts';
import { NewChatForm } from '../NewChatForm/NewChatForm.tsx';
import styles from './ChatList.module.css';

export const ChatList = () => {
  const { chats, activeChatId, setActiveChat } = useChats();
  const [showNewChat, setShowNewChat] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>MAX</span>
        <button
          type="button"
          className={styles.newBtn}
          onClick={() => setShowNewChat((v) => !v)}
        >
          {showNewChat ? '×' : '+'}
        </button>
      </div>

      {showNewChat && (
        <NewChatForm onClose={() => setShowNewChat(false)} />
      )}

      <ul className={styles.list}>
        {chats.length === 0 && !showNewChat && (
          <li className={styles.empty}>Создайте чат по номеру телефона</li>
        )}
        {chats.map((chat) => (
          <li key={chat.chatId}>
            <button
              type="button"
              className={
                chat.chatId === activeChatId
                  ? `${styles.item} ${styles.itemActive}`
                  : styles.item
              }
              onClick={() => setActiveChat(chat.chatId)}
            >
              <span className={styles.avatar}>
                {chat.title.charAt(0).toUpperCase()}
              </span>
              <span className={styles.meta}>
                <span className={styles.name}>{chat.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
