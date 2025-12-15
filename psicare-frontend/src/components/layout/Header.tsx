import { useState, useRef, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotificacoes } from "../../context/NotificacoesContext";
import { NotificationsMenu } from "./NotificationsMenu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { usuario } = useAuth();
  const { naoLidasCount } = useNotificacoes();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // UI 3.0: Adicionado backdrop-blur e z-index ajustado
    <header className="bg-white/90 backdrop-blur-md border-b border-secondary-200 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900 rounded-lg md:hidden transition-colors"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-secondary-900 tracking-tight flex items-center gap-2">
            Olá,{" "}
            <span className="text-primary-600">
              {usuario?.nome.split(" ")[0]}
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Container de Notificações */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              showNotifications
                ? "bg-primary-50 text-primary-600 shadow-inner"
                : "text-secondary-400 hover:text-primary-600 hover:bg-secondary-50"
            }`}
          >
            <Bell size={20} strokeWidth={2.5} />
            {naoLidasCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white flex items-center justify-center animate-pulse">
                {/* Indicador simples sem número para visual mais limpo, ou mantenha o número se preferir */}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 z-50 animate-scale-in origin-top-right">
              <NotificationsMenu onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>

        {/* Divisor Vertical */}
        <div className="h-8 w-px bg-secondary-200 hidden sm:block"></div>

        {/* Perfil */}
        <div className="flex items-center gap-3 pl-1 group cursor-default">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 p-[2px] shadow-sm ring-2 ring-transparent group-hover:ring-primary-100 transition-all">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {usuario?.foto ? (
                <img
                  src={usuario.foto}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary-700 font-bold text-sm">
                  {usuario?.iniciais}
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:block text-left leading-tight">
            <span className="block text-sm font-bold text-secondary-900">
              {usuario?.nome.split(" ")[0]}
            </span>
            <span className="block text-[10px] font-medium text-secondary-400 uppercase tracking-wider">
              Profissional
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
