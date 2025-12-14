// src/types/index.ts

export type StatusPaciente = 'ATIVO' | 'INATIVO' | 'PAUSA' | 'ALTA';
// Adicionei os tipos do Java para StatusSessao
export type StatusSessao = 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO_PACIENTE' | 'CANCELADO_TERAPEUTA' | 'REALIZADO' | 'FALTOU';
export type FrequenciaSessao = 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'AVULSO';

export interface Paciente {
  id: string;
  nome: string;
  email: string; // Tornando obrigatório para bater com Java se necessário, ou mantenha opcional ?
  telefone: string;
  dataNascimento: string; // YYYY-MM-DD
  
  // Prontuário
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  
  // Configurações
  status: StatusPaciente;
  frequenciaSessao?: FrequenciaSessao;
  avatarColor?: string;
  
  // Mantemos sessoes para compatibilidade futura (será a próxima fase)
  sessoes: Sessao[]; 
  anotacoes?: string;
}

export interface Sessao {
  id: string;
  pacienteId: string;
  dataInicio: string; // ISO DateTime do Java (substitui 'data' e 'hora' separadas)
  dataFim?: string;
  status: StatusSessao; // (substitui 'statusSessao')
  evolucao?: string;  // O prontuário em si
  anotacoes?: string; // Notas privadas
  
  // Campos legados para compatibilidade temporária com seu front antigo (opcionais)
  data?: string; 
  tipo?: string;
  statusSessao?: string; 
}

// DTO de Envio (O que o Java espera receber no cadastro de sessão)
export interface CadastroSessaoDTO {
  dataInicio: string;
  dataFim?: string;
  status: StatusSessao;
  evolucao?: string;
  anotacoes?: string;
}

// Demais interfaces mantidas...
export interface Agendamento {
  id: string;
  pacienteId: string;
  data: string;
  hora: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  iniciais: string;
  foto?: string;
  token?: string;
}

export type TipoNotificacao = 'agendamento' | 'aniversario' | 'financeiro' | 'sistema';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  lida: boolean;
  data: string;
  link?: string;
  pacienteId?: string;
}

// Interface para o Pagamento do Spring Boot (Page<T>)
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CadastroPacienteDTO {
  nome: string;
  email?: string;
  telefone: string;
  dataNascimento: string;
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  frequenciaSessao?: FrequenciaSessao;
  avatarColor?: string;
}