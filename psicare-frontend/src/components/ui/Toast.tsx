import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

export function Toast({ message, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(message.id);
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message, onRemove]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />
  };

  const borderClass = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500'
  };

  return (
    <div className={`flex items-start gap-3 w-full max-w-sm bg-white shadow-lg rounded-lg p-4 pointer-events-auto transition-all animate-in slide-in-from-right duration-300 border-l-4 ${borderClass[message.type]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[message.type]}</div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{message.title}</h3>
        {message.description && <p className="mt-1 text-sm text-gray-500">{message.description}</p>}
      </div>
      <button onClick={() => onRemove(message.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}