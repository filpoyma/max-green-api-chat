import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/storage.constants.ts';
import { chatService } from '../services/chat.service.ts';
import type { IChat, IMessage } from '../types/chat.types.ts';
import { useAuthStore } from './authStore.ts';

const sortChats = (chats: IChat[]): IChat[] =>
  [...chats].sort((a, b) => b.lastMessageAt - a.lastMessageAt);

interface IChatsStore {
  chats: IChat[];
  messages: IMessage[];
  activeChatId: string | null;
  setActiveChat: (chatId: string | null) => void;
  addChat: (chat: IChat) => void;
  upsertIncomingMessage: (message: IMessage, title?: string) => void;
  sendMessage: (text: string) => Promise<void>;
  resetChats: () => void;
}

export const useChatsStore = create<IChatsStore>()(
  persist(
    (set, get) => ({
      chats: [],
      messages: [],
      activeChatId: null,

      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      addChat: (chat) => {
        const { chats } = get();
        const exists = chats.some((c) => c.chatId === chat.chatId);
        const next = exists
          ? chats.map((c) =>
              c.chatId === chat.chatId ? { ...c, ...chat } : c,
            )
          : [chat, ...chats];
        set({ chats: sortChats(next), activeChatId: chat.chatId });
      },

      upsertIncomingMessage: (message, title) => {
        const { chats, messages } = get();
        const duplicate = messages.some(
          (m) =>
            m.id === message.id ||
            (message.idMessage !== undefined &&
              m.idMessage === message.idMessage),
        );
        if (duplicate) return;

        const chatExists = chats.some((c) => c.chatId === message.chatId);
        const nextChats = !chatExists
          ? [
              {
                chatId: message.chatId,
                phoneNumber: '',
                title: title || message.chatId,
                lastMessageAt: message.timestamp,
              },
              ...chats,
            ]
          : chats.map((c) =>
              c.chatId === message.chatId
                ? {
                    ...c,
                    title: title && c.title === c.chatId ? title : c.title,
                    lastMessageAt: Math.max(c.lastMessageAt, message.timestamp),
                  }
                : c,
            );

        set({
          chats: sortChats(nextChats),
          messages: [...messages, message],
        });
      },

      sendMessage: async (text) => {
        const credentials = useAuthStore.getState().credentials;
        const { activeChatId } = get();
        if (!credentials || !activeChatId) return;

        const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const pending: IMessage = {
          id: localId,
          chatId: activeChatId,
          text: text.trim(),
          direction: 'outgoing',
          status: 'pending',
          timestamp: Date.now(),
        };

        const { chats, messages } = get();
        set({
          messages: [...messages, pending],
          chats: sortChats(
            chats.map((c) =>
              c.chatId === activeChatId
                ? { ...c, lastMessageAt: pending.timestamp }
                : c,
            ),
          ),
        });

        try {
          const idMessage = await chatService.sendMessage(
            credentials,
            activeChatId,
            text,
          );
          set({
            messages: get().messages.map((m) =>
              m.id === localId
                ? {
                    ...m,
                    status: 'sent',
                    idMessage,
                    id: idMessage,
                  }
                : m,
            ),
          });
        } catch {
          set({
            messages: get().messages.map((m) =>
              m.id === localId ? { ...m, status: 'failed' } : m,
            ),
          });
          throw new Error('Не удалось отправить сообщение');
        }
      },

      resetChats: () =>
        set({ chats: [], messages: [], activeChatId: null }),
    }),
    {
      name: STORAGE_KEYS.chats,
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
        activeChatId: state.activeChatId,
      }),
    },
  ),
);

export const selectActiveChat = (state: IChatsStore): IChat | null =>
  state.chats.find((c) => c.chatId === state.activeChatId) ?? null;

export const selectActiveMessages = (state: IChatsStore): IMessage[] =>
  state.messages
    .filter((m) => m.chatId === state.activeChatId)
    .sort((a, b) => a.timestamp - b.timestamp);
