import { useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useChats } from '../../hooks/useChats.ts';
import { NewChatForm } from '../NewChatForm/NewChatForm.tsx';
import styles from './ChatList.module.css';

const formatListTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const ChatList = () => {
  const { chats, messages, activeChatId, setActiveChat } = useChats();
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState('');

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.phoneNumber.includes(q.replace(/\D/g, '')),
    );
  }, [chats, search]);

  const previewForChat = (chatId: string): string => {
    const chatMessages = messages
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => b.timestamp - a.timestamp);
    const last = chatMessages[0];
    if (!last) return 'Нет сообщений';
    return last.text;
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <button
          type="button"
          className={styles.newBtn}
          onClick={() => setShowNewChat((v) => !v)}
          aria-label={showNewChat ? 'Закрыть' : 'Новый чат'}
        >
          {showNewChat ? (
            <X size={20} strokeWidth={2} aria-hidden />
          ) : (
            <Plus size={20} strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} size={16} strokeWidth={2} aria-hidden />
        <input
          className={styles.search}
          type="search"
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showNewChat && (
        <NewChatForm onClose={() => setShowNewChat(false)} />
      )}

      <ul className={styles.list}>
        {filteredChats.length === 0 && !showNewChat && (
          <li className={styles.empty}>
            {search ? 'Ничего не найдено' : 'Создайте чат по номеру телефона'}
          </li>
        )}
        {filteredChats.map((chat) => (
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
                {chat.title.replace(/\D/g, '').slice(-2) || chat.title.charAt(0)}
              </span>
              <span className={styles.meta}>
                <span className={styles.nameRow}>
                  <span className={styles.name}>{chat.title}</span>
                </span>
                <span className={styles.preview}>{previewForChat(chat.chatId)}</span>
              </span>
              <time className={styles.time}>{formatListTime(chat.lastMessageAt)}</time>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
