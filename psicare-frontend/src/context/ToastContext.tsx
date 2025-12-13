/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast, type ToastMessage, type ToastType } from '../components/ui/Toast';

interface ToastContextData {
  addToast: (params: { type: ToastType; title: string; description?: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({ type, title, description, duration = 3000 }: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID();
    setMessages((state) => [...state, { id, type, title, description, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 p-4 pointer-events-none max-h-screen overflow-hidden">
        {messages.map((message) => (
          <Toast key={message.id} message={message} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}