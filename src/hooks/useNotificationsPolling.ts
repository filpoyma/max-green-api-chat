import { useEffect } from 'react';
import { greenApi } from '../api/green-api/index.ts';
import { parseIncomingTextMessage } from '../services/notification.service.ts';
import { useAuth } from './useAuth.ts';
import { useChats } from './useChats.ts';

const ERROR_BACKOFF_MS = 3000;

export const useNotificationsPolling = (): void => {
  const { credentials } = useAuth();
  const { upsertIncomingMessage } = useChats();

  useEffect(() => {
    if (!credentials) return;

    let cancelled = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          const notification = await greenApi.receiveNotification(
            credentials,
            20,
          );

          if (cancelled) break;

          if (notification?.receiptId != null && notification.body) {
            const incoming = parseIncomingTextMessage(notification.body);
            if (incoming) {
              const title = notification.body.senderData?.chatName;
              upsertIncomingMessage(incoming, title);
            }

            try {
              await greenApi.deleteNotification(
                credentials,
                notification.receiptId,
              );
            } catch {
              // очередь может застрять — следующий цикл повторит попытку
            }
          }
        } catch {
          if (cancelled) break;
          await new Promise((r) => setTimeout(r, ERROR_BACKOFF_MS));
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [credentials, upsertIncomingMessage]);
};
