import { useNotificationsPolling } from '../../hooks/useNotificationsPolling.ts';
import { ChatList } from '../ChatList/ChatList.tsx';
import { ChatWindow } from '../ChatWindow/ChatWindow.tsx';
import { NavRail } from '../NavRail/NavRail.tsx';
import styles from './ChatLayout.module.css';

export const ChatLayout = () => {
  useNotificationsPolling();

  return (
    <div className={styles.root}>
      <div className={styles.body}>
        <NavRail />
        <ChatList />
        <ChatWindow />
      </div>
    </div>
  );
};
