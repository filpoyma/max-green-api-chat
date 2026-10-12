import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore.ts';
import { useChatsStore } from '../store/chatsStore.ts';

export const useAuth = () => {
  const credentials = useAuthStore((s) => s.credentials);
  const setCredentials = useAuthStore((s) => s.setCredentials);
  const clearCredentials = useAuthStore((s) => s.logout);

  const logout = useCallback(() => {
    useChatsStore.getState().resetChats();
    clearCredentials();
  }, [clearCredentials]);

  return { credentials, setCredentials, logout };
};
