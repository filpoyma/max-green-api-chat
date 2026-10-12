import { useShallow } from 'zustand/react/shallow';
import {
  selectActiveChat,
  selectActiveMessages,
  useChatsStore,
} from '../store/chatsStore.ts';

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

  const activeChat = useChatsStore(selectActiveChat);
  const activeMessages = useChatsStore(selectActiveMessages);

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
