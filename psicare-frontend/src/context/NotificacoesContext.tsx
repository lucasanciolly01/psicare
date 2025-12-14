// src/context/NotificacoesContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { usePacientes } from './PacientesContext';
import { useAgendamentos } from './AgendamentosContext';
import { type Notificacao } from '../types';
import { isToday, parseISO, differenceInMinutes } from 'date-fns';

interface NotificacoesContextData {
  notificacoes: Notificacao[];
  naoLidasCount: number; // Correção: Garante que é number
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

  // Função memorizada para evitar loops nos useEffects
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
    // Filtra aniversariantes do dia (Mês e Dia iguais)
    const aniversariantes = pacientes.filter(p => {
      if (!p.dataNascimento) return false;
      // Garante parsing seguro da data (tratando string YYYY-MM-DD)
      const partes = p.dataNascimento.split('-');
      if (partes.length !== 3) return false;
      
      const mesNasc = parseInt(partes[1], 10) - 1; // Mês em JS começa em 0
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

  // 2. Gerar Notificações de Sessões Próximas (Ex: faltam 60 min)
  useEffect(() => {
    const agora = new Date();
    
    agendamentos.forEach(a => {
      if (a.status !== 'agendado') return;
      
      const dataSessao = parseISO(`${a.data}T${a.hora}`);
      const diffMinutos = differenceInMinutes(dataSessao, agora);

      // Notifica se faltar entre 0 e 60 minutos
      if (diffMinutos > 0 && diffMinutos <= 60) {
        // Evita duplicatas checando se já existe notificação hoje para este horário
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

// eslint-disable-next-line react-refresh/only-export-components
export function useNotificacoes() {
  return useContext(NotificacoesContext);
}