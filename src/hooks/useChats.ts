import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChatsStore } from '../store/chatsStore.ts';

export const useChats = () => {
  const {
    chats,
    messages,
    activeChatId,
    setActiveChat,
    addChat,
    upsertIncomingMessage,
    sendMessage,
    resetChats,
  } = useChatsStore(
    useShallow((s) => ({
      chats: s.chats,
      messages: s.messages,
      activeChatId: s.activeChatId,
      setActiveChat: s.setActiveChat,
      addChat: s.addChat,
      upsertIncomingMessage: s.upsertIncomingMessage,
      sendMessage: s.sendMessage,
      resetChats: s.resetChats,
    })),
  );

  const activeChat = useMemo(
    () => chats.find((c) => c.chatId === activeChatId) ?? null,
    [chats, activeChatId],
  );

  const activeMessages = useMemo(
    () =>
      messages
        .filter((m) => m.chatId === activeChatId)
        .sort((a, b) => a.timestamp - b.timestamp),
    [messages, activeChatId],
  );

  return {
    chats,
    messages,
    activeChatId,
    activeChat,
    activeMessages,
    setActiveChat,
    addChat,
    upsertIncomingMessage,
    sendMessage,
    resetChats,
  };
};
