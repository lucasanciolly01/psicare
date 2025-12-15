/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  parseISO,
  isToday,
  isThisWeek,
  isAfter,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from "date-fns";
import { type Agendamento } from "../types"; // <--- 1. Importando o tipo global correto

interface AgendamentosContextData {
  agendamentos: Agendamento[];
  adicionarAgendamento: (dados: Omit<Agendamento, "id" | "status">) => void;
  editarAgendamento: (id: string, dados: Partial<Agendamento>) => void; // <--- 2. Nova função essencial
  removerAgendamento: (id: string) => void;
  sessoesHoje: number;
  sessoesSemana: number;
  crescimentoSemanal: number;
  proximosAgendamentos: Agendamento[];
}

const AgendamentosContext = createContext<AgendamentosContextData>(
  {} as AgendamentosContextData
);

export function AgendamentosProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const saved = localStorage.getItem("psicare_agendamentos_v3"); // Mudei a chave para v3 para limpar cache antigo
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            pacienteId: "1", // Adicionado para compatibilidade
            pacienteNome: "Ana Souza",
            data: new Date().toISOString().split("T")[0], // Hoje
            horario: "09:00", // <--- CORRIGIDO: horario em vez de hora
            tipo: "Consulta",
            status: "agendado",
          },
          {
            id: "2",
            pacienteId: "2",
            pacienteNome: "Carlos Silva",
            data: new Date().toISOString().split("T")[0],
            horario: "14:30",
            tipo: "Terapia",
            status: "agendado",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem(
      "psicare_agendamentos_v3",
      JSON.stringify(agendamentos)
    );
  }, [agendamentos]);

  const adicionarAgendamento = (dados: Omit<Agendamento, "id" | "status">) => {
    const novo: Agendamento = {
      id: Date.now().toString(),
      status: "agendado",
      ...dados,
    };
    setAgendamentos((state) => [...state, novo]);
  };

  // Nova função para permitir edição (concluir sessão, remarcar, etc)
  const editarAgendamento = (id: string, dados: Partial<Agendamento>) => {
    setAgendamentos((state) =>
      state.map((agendamento) =>
        agendamento.id === id ? { ...agendamento, ...dados } : agendamento
      )
    );
  };

  const removerAgendamento = (id: string) => {
    setAgendamentos((state) => state.filter((a) => a.id !== id));
  };

  // --- CÁLCULOS DE MÉTRICAS ---

  const sessoesHoje = agendamentos.filter(
    (a) => isToday(parseISO(a.data)) && a.status !== "cancelado"
  ).length;

  const sessoesSemana = agendamentos.filter(
    (a) => isThisWeek(parseISO(a.data)) && a.status !== "cancelado"
  ).length;

  const hoje = new Date();
  const inicioSemanaPassada = startOfWeek(subWeeks(hoje, 1));
  const fimSemanaPassada = endOfWeek(subWeeks(hoje, 1));

  const sessoesSemanaPassada = agendamentos.filter((a) => {
    const dataSessao = parseISO(a.data);
    return (
      isWithinInterval(dataSessao, {
        start: inicioSemanaPassada,
        end: fimSemanaPassada,
      }) && a.status !== "cancelado"
    );
  }).length;

  let crescimentoSemanal = 0;
  if (sessoesSemanaPassada > 0) {
    crescimentoSemanal = Math.round(
      ((sessoesSemana - sessoesSemanaPassada) / sessoesSemanaPassada) * 100
    );
  } else if (sessoesSemana > 0) {
    crescimentoSemanal = 100;
  }

  const proximosAgendamentos = agendamentos
    .filter((a) => {
      // Correção aqui: usar a.horario
      const dataAgendamento = parseISO(a.data + "T" + a.horario);
      return (
        (isAfter(dataAgendamento, new Date()) || isToday(parseISO(a.data))) &&
        a.status === "agendado"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.data + "T" + a.horario).getTime() -
        new Date(b.data + "T" + b.horario).getTime()
    )
    .slice(0, 5);

  return (
    <AgendamentosContext.Provider
      value={{
        agendamentos,
        adicionarAgendamento,
        editarAgendamento,
        removerAgendamento,
        sessoesHoje,
        sessoesSemana,
        crescimentoSemanal,
        proximosAgendamentos,
      }}
    >
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  return useContext(AgendamentosContext);
}
