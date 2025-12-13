import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usePacientes } from './PacientesContext';
import { useAgendamentos } from './AgendamentosContext';
import { type Notificacao } from '../types';
import { isToday, parseISO, differenceInMinutes } from 'date-fns';

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
  
  // Integração com outros contextos para gerar avisos automáticos
  const { pacientes } = usePacientes();
  const { agendamentos } = useAgendamentos();

  // 1. Gerar Notificações de Aniversário
  useEffect(() => {
    const hoje = new Date();
    const aniversariantes = pacientes.filter(p => {
      const dataNasc = parseISO(p.dataNascimento);
      return dataNasc.getDate() === hoje.getDate() && dataNasc.getMonth() === hoje.getMonth();
    });

    aniversariantes.forEach(p => {
      // Evita duplicatas verificando se já existe notificação hoje para este paciente
      const jaExiste = notificacoes.some(n => 
        n.tipo === 'aniversario' && n.pacienteId === p.id && isToday(parseISO(n.data))
      );

      if (!jaExiste) {
        adicionarNotificacaoManual({
          titulo: '🎉 Aniversariante do Dia',
          mensagem: `Hoje é aniversário de ${p.nome}. Que tal enviar uma mensagem?`,
          tipo: 'aniversario',
          pacienteId: p.id,
          link: `/pacientes` // Poderia levar ao perfil específico
        });
      }
    });
  }, [pacientes]);

  // 2. Gerar Notificações de Sessões Próximas (Exemplo: Próxima hora)
  useEffect(() => {
    const agora = new Date();
    
    agendamentos.forEach(a => {
      if (a.status !== 'agendado') return;
      
      const dataSessao = parseISO(`${a.data}T${a.hora}`);
      const diffMinutos = differenceInMinutes(dataSessao, agora);

      // Notificar se faltar entre 0 e 60 minutos
      if (diffMinutos > 0 && diffMinutos <= 60) {
        const jaExiste = notificacoes.some(n => 
          n.tipo === 'agendamento' && n.mensagem.includes(a.hora) && isToday(parseISO(n.data))
        );

        if (!jaExiste) {
          adicionarNotificacaoManual({
            titulo: '⏰ Sessão em Breve',
            mensagem: `Sessão com ${a.pacienteNome} começa às ${a.hora}.`,
            tipo: 'agendamento',
            link: '/agenda'
          });
        }
      }
    });
  }, [agendamentos]);

  const adicionarNotificacaoManual = (dados: Omit<Notificacao, 'id' | 'data' | 'lida'>) => {
    setNotificacoes(current => [
      {
        id: crypto.randomUUID(),
        data: new Date().toISOString(),
        lida: false,
        ...dados
      },
      ...current
    ]);
  };

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

export function useNotificacoes() {
  return useContext(NotificacoesContext);
}