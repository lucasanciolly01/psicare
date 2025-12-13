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
      case 'aniversario': return <Gift className="text-pink-500" size={20} />;
      case 'agendamento': return <Calendar className="text-blue-500" size={20} />;
      case 'financeiro': return <AlertCircle className="text-yellow-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animation-fade-in">
      {/* Cabeçalho do Menu */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-800">Notificações</h3>
        {notificacoes.length > 0 && (
          <button 
            onClick={marcarTodasComoLidas}
            className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            <Check size={14} /> Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Lista de Notificações */}
      <div className="max-h-[400px] overflow-y-auto">
        {notificacoes.length === 0 ? (
          // Estado de Vazio
          <div className="p-8 text-center flex flex-col items-center text-gray-400">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <Bell size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600">Tudo tranquilo por aqui!</p>
            <p className="text-xs mt-1">Nenhuma nova notificação no momento.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {notificacoes.map((notif) => (
              <li 
                key={notif.id} 
                className={`relative group transition-colors hover:bg-gray-50 ${!notif.lida ? 'bg-blue-50/30' : ''}`}
              >
                <div 
                  className="p-4 flex gap-3 cursor-pointer"
                  onClick={() => handleClickNotificacao(notif)}
                >
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!notif.lida ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    {getIcone(notif.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${!notif.lida ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                        {notif.titulo}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {new Date(notif.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {notif.mensagem}
                    </p>
                    
                    {/* Ações Rápidas (Exemplo) */}
                    {notif.tipo === 'agendamento' && !notif.lida && (
                      <div className="mt-2 flex gap-2">
                        <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors font-medium">
                          Ver Detalhes
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão de Remover (Aparece no Hover) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); removerNotificacao(notif.id); }}
                  className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover notificação"
                >
                  <X size={14} />
                </button>
                
                {/* Indicador de não lida */}
                {!notif.lida && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}