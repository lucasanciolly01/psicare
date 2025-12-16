import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { usePacientes } from './PacientesContext';
import { useAgendamentos } from './AgendamentosContext';
import { type Notificacao } from '../types';
import { isToday, parseISO, differenceInMinutes, format } from 'date-fns';

interface NotificacoesContextData {
  notificacoes: Notificacao[];
  naoLidasCount: number;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  removerNotificacao: (id: string) => void;
  adicionarNotificacao: (notificacao: Omit<Notificacao, 'id' | 'data' | 'lida'>) => void;
}

const NotificacoesContext = createContext<NotificacoesContextData>({} as NotificacoesContextData);

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  
  const { pacientes } = usePacientes();
  const { agendamentos } = useAgendamentos();

  const adicionarNotificacaoManual = useCallback((dados: Omit<Notificacao, 'id' | 'data' | 'lida'>) => {
    setNotificacoes(current => [
      {
        id: crypto.randomUUID(),
        data: new Date().toISOString(),
        lida: false,
        ...dados
      },
      ...current
    ]);
  }, []);

  // 1. Gerar Notificações de Aniversário
  useEffect(() => {
    const hoje = new Date();
    const aniversariantes = pacientes.filter(p => {
      if (!p.dataNascimento) return false;
      const partes = p.dataNascimento.split('-');
      if (partes.length !== 3) return false;
      
      const mesNasc = parseInt(partes[1], 10) - 1; 
      const diaNasc = parseInt(partes[2], 10);
      
      return diaNasc === hoje.getDate() && mesNasc === hoje.getMonth();
    });

    aniversariantes.forEach(p => {
      const jaExiste = notificacoes.some(n => 
        n.tipo === 'aniversario' && n.pacienteId === p.id && isToday(parseISO(n.data))
      );

      if (!jaExiste) {
        adicionarNotificacaoManual({
          titulo: '🎉 Aniversariante do Dia',
          mensagem: `Hoje é aniversário de ${p.nome}. Que tal enviar uma mensagem?`,
          tipo: 'aniversario',
          pacienteId: p.id,
          link: `/pacientes`
        });
      }
    });
  }, [pacientes, notificacoes, adicionarNotificacaoManual]);

  // 2. Gerar Notificações de Sessões Próximas
  useEffect(() => {
    const agora = new Date();
    
    agendamentos.forEach(a => {
      // Adaptação para o tipo CalendarEvent que usa 'start' em vez de data/horario separados
      const dataSessao = typeof a.start === 'string' ? parseISO(a.start) : a.start;
      const diffMinutos = differenceInMinutes(dataSessao, agora);

      if (diffMinutos > 0 && diffMinutos <= 60) {
        const horario = format(dataSessao, 'HH:mm');
        const jaExiste = notificacoes.some(n => 
          n.tipo === 'agendamento' && n.mensagem.includes(horario) && isToday(parseISO(n.data))
        );

        if (!jaExiste) {
          adicionarNotificacaoManual({
            titulo: '⏰ Sessão em Breve',
            mensagem: `Sessão com ${a.pacienteNome} começa às ${horario}.`,
            tipo: 'agendamento',
            link: '/agenda'
          });
        }
      }
    });
  }, [agendamentos, notificacoes, adicionarNotificacaoManual]);

  const marcarComoLida = (id: string) => {
    setNotificacoes(current =>
      current.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(current =>
      current.map(n => ({ ...n, lida: true }))
    );
  };

  const removerNotificacao = (id: string) => {
    setNotificacoes(current => current.filter(n => n.id !== id));
  };

  const naoLidasCount = notificacoes.filter(n => !n.lida).length;

  return (
    <NotificacoesContext.Provider value={{
      notificacoes,
      naoLidasCount,
      marcarComoLida,
      marcarTodasComoLidas,
      removerNotificacao,
      adicionarNotificacao: adicionarNotificacaoManual
    }}>
      {children}
    </NotificacoesContext.Provider>
  );
}

// Adicionado comentário para silenciar o aviso do ESLint sobre Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export function useNotificacoes() {
  return useContext(NotificacoesContext);
}