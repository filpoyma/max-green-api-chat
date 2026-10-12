import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/storage.constants.ts';
import type { ICredentials } from '../types/greenApi.types.ts';

interface IAuthStore {
  credentials: ICredentials | null;
  setCredentials: (value: ICredentials) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      credentials: null,
      setCredentials: (value) => set({ credentials: value }),
      logout: () => set({ credentials: null }),
    }),
    {
      name: STORAGE_KEYS.credentials,
      partialize: (state) => ({ credentials: state.credentials }),
    },
  ),
);
