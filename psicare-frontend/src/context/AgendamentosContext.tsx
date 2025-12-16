/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { AgendamentoService } from '../services/AgendamentoService';
import type { CalendarEvent, AgendamentoDetalhes, DadosCadastroAgendamento } from '../types/agendamento'; 
import { useToast } from "./ToastContext";
import { AxiosError } from "axios"; 

// Definições de data para carregar a agenda inicial (mês atual)
// Calculado fora para evitar recriação, mas idealmente deveria ser dinâmico se o app ficar aberto muito tempo.
const getInitialMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    return { start, end };
};

interface AgendamentosContextType {
    agendamentos: CalendarEvent[];
    isLoading: boolean;
    loadAgendamentos: (inicio: string, fim: string) => Promise<void>;
    cadastrarAgendamento: (dados: DadosCadastroAgendamento) => Promise<AgendamentoDetalhes | undefined>;
    editarAgendamento: (id: string, dados: DadosCadastroAgendamento) => Promise<AgendamentoDetalhes | undefined>;
    removerAgendamento: (id: string) => Promise<void>;
}

const AgendamentosContext = createContext<AgendamentosContextType>(
  {} as AgendamentosContextType
);

// Função pura movida para fora do componente para evitar recriação
const mapToCalendarEvent = (detalhe: AgendamentoDetalhes): CalendarEvent => {
    let color = '#3788d8'; 
    if (detalhe.statusSessao === 'CONCLUIDO') {
        color = '#28a745';
    } else if (detalhe.statusSessao === 'CANCELADO' || detalhe.statusSessao === 'FALTOU') {
        color = '#dc3545';
    }

    const dataHoraFim = new Date(detalhe.dataHora);
    dataHoraFim.setHours(dataHoraFim.getHours() + 1); // Assumindo 60 minutos padrão

    return {
        id: detalhe.id,
        title: `${detalhe.pacienteNome} (${detalhe.tipoSessao.replace(/_/g, ' ')})`,
        start: detalhe.dataHora,
        end: dataHoraFim.toISOString(),
        backgroundColor: color,
        borderColor: color,
        allDay: false,
        pacienteNome: detalhe.pacienteNome,
        tipoSessao: detalhe.tipoSessao,
        valorCobrado: detalhe.valorCobrado,
        statusSessao: detalhe.statusSessao,
    } as CalendarEvent;
};

export function AgendamentosProvider({ children }: { children: ReactNode }) {
    const [agendamentos, setAgendamentos] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    // Helper para extrair mensagem de erro do Axios
    const getErrorMessage = useCallback((error: unknown, defaultMessage: string) => {
        if (error instanceof AxiosError && error.response?.data?.message) {
            return error.response.data.message;
        }
        return defaultMessage;
    }, []);

    const loadAgendamentos = useCallback(async (inicio: string, fim: string) => {
        setIsLoading(true);
        try {
            const data = await AgendamentoService.listarAgendamentos(inicio, fim);
            const events = data.map(mapToCalendarEvent);
            setAgendamentos(events);
        } catch (error) { 
            console.error("Falha ao carregar agendamentos:", error);
            addToast({ title: 'Erro ao carregar a agenda.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [addToast]); 

    const cadastrarAgendamento = useCallback(async (dados: DadosCadastroAgendamento) => {
        try {
            const novoAgendamento = await AgendamentoService.agendarSessao(dados);
            const novoEvento = mapToCalendarEvent(novoAgendamento);
            
            setAgendamentos(prev => [...prev, novoEvento]);
            addToast({ title: 'Agendamento criado com sucesso!', type: 'success' });
            
            return novoAgendamento;
        } catch (error) { 
            const msg = getErrorMessage(error, 'Falha ao agendar: Verifique os dados.');
            addToast({ title: msg, type: 'error' });
            return undefined;
        }
    }, [addToast, getErrorMessage]);

    const editarAgendamento = useCallback(async (id: string, dados: DadosCadastroAgendamento) => {
        try {
            const agendamentoAtualizado = await AgendamentoService.atualizarSessao(id, dados);
            const eventoAtualizado = mapToCalendarEvent(agendamentoAtualizado);

            setAgendamentos(prev => prev.map(evt => 
                evt.id === id ? eventoAtualizado : evt
            ));
            
            addToast({ title: 'Agendamento atualizado!', type: 'success' });
            return agendamentoAtualizado;
        } catch (error) {
            const msg = getErrorMessage(error, 'Erro ao atualizar agendamento.');
            addToast({ title: msg, type: 'error' });
            return undefined;
        }
    }, [addToast, getErrorMessage]);
    
    const removerAgendamento = useCallback(async (id: string) => {
        try {
            await AgendamentoService.cancelarSessao(id);
            setAgendamentos(prev => prev.filter(a => a.id !== id));
            addToast({ title: 'Agendamento cancelado com sucesso!', type: 'info' });
        } catch (error) {
             const msg = getErrorMessage(error, 'Erro ao cancelar. Tente novamente.');
             addToast({ title: msg, type: 'error' });
        }
    }, [addToast, getErrorMessage]);

    // Carrega o mês atual na montagem
    useEffect(() => {
        const { start, end } = getInitialMonthRange();
        loadAgendamentos(start, end);
    }, [loadAgendamentos]);

    return (
        <AgendamentosContext.Provider
            value={{
                agendamentos,
                isLoading,
                loadAgendamentos,
                cadastrarAgendamento,
                editarAgendamento,
                removerAgendamento,
            }}
        >
            {children}
        </AgendamentosContext.Provider>
    );
}

export function useAgendamentos() {
  const context = useContext(AgendamentosContext);
  if (!context) {
    throw new Error('useAgendamentos must be used within an AgendamentosProvider');
  }
  return context;
}
