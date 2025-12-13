/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { parseISO, isToday, isThisWeek, isAfter, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export interface Agendamento {
  id: string;
  data: string;
  hora: string;
  pacienteNome: string; 
  tipo: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

interface AgendamentosContextData {
  agendamentos: Agendamento[];
  adicionarAgendamento: (dados: Omit<Agendamento, 'id' | 'status'>) => void;
  removerAgendamento: (id: string) => void;
  sessoesHoje: number;
  sessoesSemana: number;
  crescimentoSemanal: number;
  proximosAgendamentos: Agendamento[];
}

const AgendamentosContext = createContext<AgendamentosContextData>({} as AgendamentosContextData);

export function AgendamentosProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const saved = localStorage.getItem('psicare_agendamentos_v2');
    return saved ? JSON.parse(saved) : [
      { id: '1', data: new Date().toISOString().split('T')[0], hora: '09:00', pacienteNome: 'Ana Souza', tipo: 'Consulta', status: 'concluido' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('psicare_agendamentos_v2', JSON.stringify(agendamentos));
  }, [agendamentos]);

  const adicionarAgendamento = (dados: Omit<Agendamento, 'id' | 'status'>) => {
    const novo: Agendamento = {
      id: Date.now().toString(),
      status: 'agendado',
      ...dados,
    };
    setAgendamentos(state => [...state, novo]);
  };

  const removerAgendamento = (id: string) => {
    setAgendamentos(state => state.filter(a => a.id !== id));
  };

  // --- CÁLCULOS DE MÉTRICAS ---
  
  const sessoesHoje = agendamentos.filter(a => 
    isToday(parseISO(a.data)) && a.status !== 'cancelado'
  ).length;

  const sessoesSemana = agendamentos.filter(a => 
    isThisWeek(parseISO(a.data)) && a.status !== 'cancelado'
  ).length;

  const hoje = new Date();
  const inicioSemanaPassada = startOfWeek(subWeeks(hoje, 1));
  const fimSemanaPassada = endOfWeek(subWeeks(hoje, 1));

  const sessoesSemanaPassada = agendamentos.filter(a => {
      const dataSessao = parseISO(a.data);
      return isWithinInterval(dataSessao, { start: inicioSemanaPassada, end: fimSemanaPassada }) 
              && a.status !== 'cancelado';
  }).length;

  let crescimentoSemanal = 0;
  if (sessoesSemanaPassada > 0) {
      crescimentoSemanal = Math.round(((sessoesSemana - sessoesSemanaPassada) / sessoesSemanaPassada) * 100);
  } else if (sessoesSemana > 0) {
      crescimentoSemanal = 100;
  }

  const proximosAgendamentos = agendamentos
    .filter(a => {
       const dataAgendamento = parseISO(a.data + 'T' + a.hora);
       return isAfter(dataAgendamento, new Date()) || isToday(parseISO(a.data));
    })
    .sort((a, b) => new Date(a.data + 'T' + a.hora).getTime() - new Date(b.data + 'T' + b.hora).getTime())
    .slice(0, 5);

  return (
    <AgendamentosContext.Provider value={{ 
      agendamentos, adicionarAgendamento, removerAgendamento,
      sessoesHoje, sessoesSemana, crescimentoSemanal, proximosAgendamentos
    }}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  return useContext(AgendamentosContext);
}