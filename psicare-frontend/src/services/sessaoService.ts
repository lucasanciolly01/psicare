import { api } from './api';
// AQUI ESTAVA O ERRO: Adicionamos 'type' antes das interfaces
import type { Sessao, CadastroSessaoDTO } from '../types';

export const sessaoService = {
  // Busca o histórico de um paciente específico
  listarPorPaciente: async (pacienteId: string) => {
    const { data } = await api.get<Sessao[]>(`/pacientes/${pacienteId}/sessoes`);
    return data;
  },

  // Cria uma nova evolução/sessão
  criar: async (pacienteId: string, dados: CadastroSessaoDTO) => {
    const { data } = await api.post<Sessao>(`/pacientes/${pacienteId}/sessoes`, dados);
    return data;
  }
};