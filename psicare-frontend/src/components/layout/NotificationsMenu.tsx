import { Bell, Check, X, Calendar, Gift, AlertCircle } from 'lucide-react';
import { useNotificacoes } from '../../context/NotificacoesContext';
import { type Notificacao } from '../../types';
import { useNavigate } from 'react-router-dom';

interface NotificationsMenuProps {
  onClose: () => void;
}

export function NotificationsMenu({ onClose }: NotificationsMenuProps) {
  const { notificacoes, marcarComoLida, marcarTodasComoLidas, removerNotificacao } = useNotificacoes();
  const navigate = useNavigate();

  const handleClickNotificacao = (notificacao: Notificacao) => {
    marcarComoLida(notificacao.id);
    if (notificacao.link) {
      navigate(notificacao.link);
      onClose();
    }
  };

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'aniversario': return <Gift className="text-pink-500" size={18} />;
      case 'agendamento': return <Calendar className="text-blue-500" size={18} />;
      case 'financeiro': return <AlertCircle className="text-amber-500" size={18} />;
      default: return <Bell className="text-secondary-400" size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-secondary-200/80 overflow-hidden flex flex-col max-h-[480px]">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-secondary-100 flex justify-between items-center bg-secondary-50/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <h3 className="font-bold text-secondary-900 text-sm">Notificações</h3>
           {notificacoes.filter(n => !n.lida).length > 0 && (
             <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
               {notificacoes.filter(n => !n.lida).length} novas
             </span>
           )}
        </div>
        
        {notificacoes.length > 0 && (
          <button 
            onClick={marcarTodasComoLidas}
            className="text-[11px] text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 transition-colors bg-primary-50 px-2 py-1 rounded-lg hover:bg-primary-100"
          >
            <Check size={12} strokeWidth={3} /> Marcar lidas
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="overflow-y-auto custom-scrollbar bg-white">
        {notificacoes.length === 0 ? (
          <div className="py-12 px-8 text-center flex flex-col items-center">
            <div className="bg-secondary-50 p-4 rounded-full mb-3 ring-8 ring-secondary-50/50">
              <Bell size={24} className="text-secondary-300" />
            </div>
            <p className="text-sm font-bold text-secondary-900">Tudo limpo!</p>
            <p className="text-xs text-secondary-500 mt-1 max-w-[180px]">
              Você não possui novas notificações no momento.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-secondary-50">
            {notificacoes.map((notif) => (
              <li 
                key={notif.id} 
                className={`group relative transition-all hover:bg-secondary-50/80 ${!notif.lida ? 'bg-primary-50/30' : ''}`}
              >
                <div 
                  className="p-4 flex gap-3.5 cursor-pointer relative z-0"
                  onClick={() => handleClickNotificacao(notif)}
                >
                  {/* Ícone */}
                  <div className={`
                    mt-1 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-colors
                    ${!notif.lida ? 'bg-white border-secondary-100 shadow-sm' : 'bg-secondary-50 border-transparent'}
                  `}>
                    {getIcone(notif.tipo)}
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm leading-snug ${!notif.lida ? 'font-bold text-secondary-900' : 'font-medium text-secondary-600'}`}>
                        {notif.titulo}
                      </p>
                      <span className="text-[10px] font-medium text-secondary-400 whitespace-nowrap">
                        {new Date(notif.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1 line-clamp-2 leading-relaxed">
                      {notif.mensagem}
                    </p>
                  </div>
                </div>

                {/* Botão de Remover (Hover) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); removerNotificacao(notif.id); }}
                  className="absolute top-3 right-3 p-1.5 text-secondary-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Remover"
                >
                  <X size={14} />
                </button>
                
                {/* Indicador Lateral (Não lida) */}
                {!notif.lida && (
                  <span className="absolute left-0 top-4 bottom-4 w-1 bg-primary-500 rounded-r-full shadow-[0_0_8px_rgba(44,167,122,0.4)]" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}