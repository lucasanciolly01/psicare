import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Tempo para animação de saída
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop com Blur */}
      <div
        className="absolute inset-0 bg-secondary-900/40 backdrop-blur-[2px] transition-all"
        onClick={onClose}
      />

      {/* Conteúdo do Modal */}
      <div
        className={`
          relative w-full bg-surface rounded-2xl shadow-2xl border border-secondary-100 flex flex-col max-h-[90vh] 
          transform transition-all duration-300 ease-out
          ${sizeClasses[size]}
          ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-secondary-100/80 bg-white rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-xl font-bold text-secondary-900 tracking-tight leading-none">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-secondary-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Fechar"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body (Scrollável) */}
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar bg-surface rounded-b-2xl">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
