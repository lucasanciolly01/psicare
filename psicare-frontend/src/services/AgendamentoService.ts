import { api } from "./api";
import { type AxiosResponse } from 'axios';
import type { AgendamentoDetalhes, DadosCadastroAgendamento } from '../types/agendamento';

export const AgendamentoService = {

  /**
   * Busca a agenda do psicólogo logado em um período específico.
   * GET /agendamentos?inicio=...&fim=...
   */
  async listarAgendamentos(inicio: string, fim: string): Promise<AgendamentoDetalhes[]> {
    try {
      const response: AxiosResponse<AgendamentoDetalhes[]> = await api.get('/agendamentos', {
        params: { inicio, fim }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      throw error;
    }
  },

  /**
   * Agenda uma nova sessão.
   * POST /agendamentos
   */
  async agendarSessao(dados: DadosCadastroAgendamento): Promise<AgendamentoDetalhes> {
    try {
      const response: AxiosResponse<AgendamentoDetalhes> = await api.post('/agendamentos', dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar agendamento:", error);
      throw error; 
    }
  },

  /**
   * Atualiza um agendamento existente.
   * PUT /agendamentos/{id}
   */
  async atualizarSessao(id: string, dados: DadosCadastroAgendamento): Promise<AgendamentoDetalhes> {
    try {
      const response: AxiosResponse<AgendamentoDetalhes> = await api.put(`/agendamentos/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Cancela um agendamento existente pelo ID.
   * DELETE /agendamentos/{id}
   */
  async cancelarSessao(id: string): Promise<void> {
    try {
        await api.delete(`/agendamentos/${id}`);
    } catch (error) {
        console.error(`Erro ao cancelar agendamento ${id}:`, error);
        throw error;
    }
  },
};
