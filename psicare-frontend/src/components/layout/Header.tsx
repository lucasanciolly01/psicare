import { useState, useRef, useEffect } from 'react'; // Hooks adicionados
import { Bell, Menu } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import { useNotificacoes } from '../../context/NotificacoesContext'; // Importar contexto
import { NotificationsMenu } from './NotificationsMenu'; // Importar componente

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { usuario } = useAuth();
  const { naoLidasCount } = useNotificacoes(); // Usar hook
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            Olá, {usuario?.nome.split(' ')[0]} 
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Container de Notificações */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-colors rounded-lg ${showNotifications ? 'bg-primary/5 text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            <Bell size={20} />
            {naoLidasCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] flex items-center justify-center text-white font-bold">
                {naoLidasCount > 9 ? '9+' : naoLidasCount}
              </span>
            )}
          </button>

          {/* Renderização Condicional do Menu */}
          {showNotifications && (
            <NotificationsMenu onClose={() => setShowNotifications(false)} />
          )}
        </div>
        
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 overflow-hidden relative">
          {usuario?.foto ? (
            <img 
              src={usuario.foto} 
              alt="Foto de perfil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{usuario?.iniciais}</span>
          )}
        </div>
      </div>
    </header>
  );
}