// src/types/index.ts

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

export interface Agendamento {
  id: string;
  pacienteId: string;
  data: string; // ISO YYYY-MM-DD
  hora: string; // HH:mm
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
}

// ATUALIZAÇÃO: Adicionadas propriedades foto e telefone
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  iniciais: string;
  foto?: string; // Base64 da imagem
}