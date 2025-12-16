// src/types/agendamento.ts

// Tipos base para o serviço (reflectindo AgendamentoDetalhes do Java)
export interface AgendamentoDetalhes {
    id: string; 
    pacienteId: string; 
    pacienteNome: string;
    dataHora: string; // LocalDateTime formatado como string ISO 8601
    tipoSessao: string; // Enum (TipoSessao)
    valorCobrado: number; // Mapeado do BigDecimal (Backend)
    statusSessao: string; // Enum (StatusSessao)
}

// Tipo de entrada para a API (reflectindo DadosCadastroAgendamento do Java)
export interface DadosCadastroAgendamento {
    pacienteId: string;
    dataHora: string; // Formato ISO 8601 (e.g., "2025-12-15T10:00:00")
    tipoSessao: string;
    valorCobrado: number;
}

// Interface usada para representar o agendamento no estado do calendário/agenda
export interface CalendarEvent {
    id: string;
    title: string;
    start: string | Date; 
    end: string | Date;
    backgroundColor: string;
    borderColor: string;
    allDay: boolean;
    pacienteNome: string;
    tipoSessao: string;
    valorCobrado: number;
    statusSessao: string;
}