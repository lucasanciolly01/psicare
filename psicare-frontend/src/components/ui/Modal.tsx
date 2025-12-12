import { X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Trava o scroll do body para evitar rolagem dupla
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-lg',
    lg: 'md:max-w-2xl',
    xl: 'md:max-w-4xl'
  };

  return createPortal(
    // Z-INDEX alto e fixed inset-0 garantem sobreposição total
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in touch-none">
      
      {/* Overlay clicável para fechar */}
      <div className="absolute inset-0 transition-opacity" onClick={onClose} />
      
      {/* Container do Modal */}
      {/* Mobile: h-[100dvh] (tela cheia), w-full, rounded-none */}
      {/* Desktop: Altura automática, rounded-2xl, largura controlada */}
      <div 
        className={`
          bg-white w-full h-[100dvh] md:h-auto md:max-h-[90vh] 
          md:rounded-2xl shadow-2xl flex flex-col relative z-10 
          animate-slide-up md:animate-scale-in
          ${sizeClasses[size]}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fixo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-white md:rounded-t-2xl">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-1">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors active:scale-95"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corpo com Scroll Independente */}
        {/* pb-safe garante respeito à área de gestos do iPhone */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar pb-safe">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}