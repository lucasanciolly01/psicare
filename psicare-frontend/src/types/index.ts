// Definição do Paciente
export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  email?: string;
  telefone: string;
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  status: 'ativo' | 'inativo' | 'pausa';
  frequenciaSessao?: 'semanal' | 'quinzenal' | 'mensal' | 'avulso';
  avatarColor?: string;
}

// Definição do Agendamento
export interface Agendamento {
  id: string;
  pacienteId: string;
  data: string; // ISO YYYY-MM-DD
  hora: string; // HH:mm
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
}

// Definição do Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  iniciais: string;
}