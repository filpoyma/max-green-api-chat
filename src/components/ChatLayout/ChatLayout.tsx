import { useAuth } from '../../hooks/useAuth.ts';
import { useNotificationsPolling } from '../../hooks/useNotificationsPolling.ts';
import { ChatList } from '../ChatList/ChatList.tsx';
import { ChatWindow } from '../ChatWindow/ChatWindow.tsx';
import styles from './ChatLayout.module.css';

export const ChatLayout = () => {
  const { logout } = useAuth();
  useNotificationsPolling();

  return (
    <div className={styles.root}>
      <ChatList />
      <div className={styles.main}>
        <button type="button" className={styles.logout} onClick={logout}>
          Выйти
        </button>
        <ChatWindow />
      </div>
    </div>
  );
};
