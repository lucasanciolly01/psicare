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
    }, message.duration || 4000); // 4 segundos padrão para leitura confortável

    return () => clearTimeout(timer);
  }, [message, onRemove]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} strokeWidth={2.5} />,
    error: <AlertCircle className="text-rose-500" size={20} strokeWidth={2.5} />,
    info: <Info className="text-blue-500" size={20} strokeWidth={2.5} />
  };

  const styleClasses = {
    success: 'border-l-emerald-500 shadow-emerald-500/10',
    error: 'border-l-rose-500 shadow-rose-500/10',
    info: 'border-l-blue-500 shadow-blue-500/10'
  };

  return (
    <div 
      className={`
        flex items-start gap-3 w-full max-w-sm bg-white shadow-xl rounded-xl p-4 pointer-events-auto 
        transition-all animate-in slide-in-from-right duration-300 border border-secondary-100 
        border-l-[6px] backdrop-blur-sm relative overflow-hidden group
        ${styleClasses[message.type]}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[message.type]}</div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-secondary-900 leading-tight mb-0.5">{message.title}</h3>
        {message.description && (
          <p className="text-xs text-secondary-500 font-medium leading-relaxed">{message.description}</p>
        )}
      </div>
      
      <button 
        onClick={() => onRemove(message.id)} 
        className="text-secondary-400 hover:text-secondary-800 hover:bg-secondary-50 p-1 rounded-md transition-colors"
      >
        <X size={16} />
      </button>

      {/* Progress bar visual (opcional - simples animação css se desejado, mas mantendo clean aqui) */}
    </div>
  );
}