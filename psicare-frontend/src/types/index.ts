// --- ENUMS E TIPOS GERAIS ---
export type StatusSessao = 'COMPARECEU' | 'FALTOU' | 'REMARCADA' | 'CANCELADA';

// MUDANÇA: Status agora é MAIÚSCULO para alinhar com o Java e parar os erros de build
export type StatusPaciente = 'ATIVO' | 'INATIVO' | 'PAUSA'; 

export type TipoNotificacao = 'agendamento' | 'aniversario' | 'financeiro' | 'sistema';

// --- INTERFACES ---

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

export interface Sessao {
  id: string;
  data: string; // YYYY-MM-DD
  tipo: string;
  statusSessao: StatusSessao;
  evolucao: string;
}

export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  email?: string;
  telefone: string;
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  
  // Agora usa o tipo maiúsculo
  status: StatusPaciente;
  
  frequenciaSessao?: 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'AVULSO';
  avatarColor?: string;
  anotacoes?: string;
  sessoes?: Sessao[];
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

export interface DashboardData {
  totalPacientes: number;
  pacientesAtivos: number;
  pacientesInativos: number;
  sessoesMesAtual: number;
}

export interface Agendamento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  data: string;     // YYYY-MM-DD
  horario: string;  // HH:mm (Esta é a propriedade que faltava!)
  tipo: string;     // 'Primeira Consulta', 'Sessão', etc.
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
}