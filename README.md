# GREEN-API MAX Chat

Минимальный веб-чат для отправки и получения текстовых сообщений в мессенджере MAX через [GREEN-API](https://green-api.com/max).

## Запуск

```bash
npm install
npm run dev
```

Откройте адрес из вывода Vite (обычно http://localhost:5173).

## Требования к инстансу GREEN-API

1. Инстанс авторизован (статус `authorized`).
2. Поле **webhookUrl** в настройках инстанса **пустое** (получение через HTTP API).
3. Включено получение входящих уведомлений (`incomingWebhook` / «Получать уведомления о входящих сообщениях»).

## Использование

1. Введите `idInstance`, `apiTokenInstance` и при необходимости поправьте `apiUrl` (подставляется из первых 4 цифр idInstance).
2. Создайте чат по номеру телефона (11–12 цифр, код 7 или 375).
3. Отправляйте текстовые сообщения; ответы из MAX появятся в чате после опроса `receiveNotification`.

Учётные данные, чаты и история сохраняются через Zustand `persist` (localStorage). Кнопка «Выйти» сбрасывает сторы.

## Стек

- React 19, Vite, TypeScript
- [ky](https://github.com/sindresorhus/ky) для HTTP-запросов к GREEN-API
- [Zustand](https://github.com/pmndrs/zustand) для состояния (авторизация, чаты, сообщения)
- [Lucide React](https://lucide.dev/) для UI-иконок
