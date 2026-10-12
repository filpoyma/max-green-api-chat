import {
  FolderOpen,
  LogOut,
  MessageCircle,
  Phone,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import styles from './NavRail.module.css';

interface INavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

const NAV_ITEMS: readonly INavItem[] = [
  { id: 'all', label: 'Все', icon: MessageCircle, active: true },
  { id: 'new', label: 'Новые', icon: FolderOpen },
  { id: 'contacts', label: 'Контакты', icon: Users },
  { id: 'calls', label: 'Звонки', icon: Phone },
];

const ICON_SIZE = 22;

export const NavRail = () => {
  const { logout } = useAuth();

  return (
    <nav className={styles.rail} aria-label="Навигация">
      <div className={styles.top}>
        {NAV_ITEMS.map(({ id, label, icon: Icon, active }) => (
          <button
            key={id}
            type="button"
            className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={ICON_SIZE} strokeWidth={1.75} aria-hidden />
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
      <button type="button" className={styles.item} onClick={logout}>
        <LogOut size={ICON_SIZE} strokeWidth={1.75} aria-hidden />
        <span className={styles.label}>Выйти</span>
      </button>
    </nav>
  );
};
