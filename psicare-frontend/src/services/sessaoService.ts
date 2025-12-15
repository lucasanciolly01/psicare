import { api } from './api';
import type { Sessao } from '../types'; // Importa do dicionário global

export const sessaoService = {
  // Busca lista de sessões do backend
  listarPorPaciente: async (pacienteId: string): Promise<Sessao[]> => {
    const response = await api.get<Sessao[]>(`/pacientes/${pacienteId}/sessoes`);
    return response.data;
  },

  // Cria nova sessão enviando os nomes corretos para o Java
  criar: async (pacienteId: string, dados: Omit<Sessao, 'id'>) => {
    const payload = {
      data: dados.data,                 // Envia 'data'
      tipo: dados.tipo,
      statusSessao: dados.statusSessao, // Envia 'statusSessao'
      evolucao: dados.evolucao
    };

    const response = await api.post<Sessao>(`/pacientes/${pacienteId}/sessoes`, payload);
    return response.data;
  },
};