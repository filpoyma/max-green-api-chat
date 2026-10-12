# Архитектура GREEN-API MAX Chat

SPA на React 19 + Vite + TypeScript. Бэкенда нет: браузер ходит в GREEN-API напрямую (ky). Состояние — Zustand с `persist` в localStorage.

## Слои

| Слой | Назначение |
|------|------------|
| `api/` | HTTP: `baseApi.ts` (ky), `greenApi.api.ts` (методы API), `buildMethodUrl` для полного URL |
| `services/` | Валидация и сценарии: login, createChat, sendMessage, разбор входящих уведомлений |
| `store/` | `authStore` (credentials), `chatsStore` (чаты, сообщения, отправка) |
| `hooks/` | `useAuth`, `useChats`, `useNotificationsPolling` |
| `components/` | UI: LoginPage, ChatLayout (NavRail + список + окно чата) |

Паттерн API похож на ulluse: отдельный `*.api.ts` на ky, без React Query и Redux.

## Экраны

В `App.tsx` без роутера: нет credentials → `LoginPage`, иначе → `ChatLayout`.

Формы входа и нового чата — `useActionState` + services. Polling входящих — цикл `receiveNotification` → обработка → `deleteNotification` в `useNotificationsPolling`.

## Данные

- Учётные данные: `idInstance`, `apiTokenInstance`, `apiUrl` (подсказка из первых 4 цифр id).
- Чат создаётся через `checkAccount` → `chatId` из API.
- Сообщения: исходящие с optimistic `pending/sent/failed`, входящие только `textMessage`.
