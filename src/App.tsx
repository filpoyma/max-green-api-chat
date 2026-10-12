import { useAuth } from './hooks/useAuth.ts';
import { ChatLayout } from './components/ChatLayout/ChatLayout.tsx';
import { LoginPage } from './components/LoginPage/LoginPage.tsx';

function App() {
  const { credentials } = useAuth();

  if (!credentials) {
    return <LoginPage />;
  }

  return <ChatLayout />;
}

export default App;
