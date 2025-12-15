import { describe, it, expect } from 'vitest';
import { verificarConflito, type AgendamentoItem } from './agendamento';

describe('verificarConflito', () => {
  // CORREÇÃO: Tipagem explícita ajuda a evitar erros e mudamos 'hora' para 'horario'
  const agendamentosExistentes: AgendamentoItem[] = [
    { data: '2025-10-20', horario: '10:00', status: 'agendado' },
    { data: '2025-10-20', horario: '11:00', status: 'agendado' },
    { data: '2025-10-20', horario: '14:00', status: 'cancelado' } // Status cancelado não deve gerar conflito
  ];

  it('deve retornar true se houver conflito de horário no mesmo dia', () => {
    // Tenta agendar para 10:30 (conflita com 10:00 e 11:00 pois intervalo < 50min)
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-20', '10:30');
    expect(temConflito).toBe(true);
  });

  it('deve retornar false se o horário for compatível (intervalo > 50min)', () => {
    // Tenta agendar para 12:00 (11:00 + 60min = ok)
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-20', '12:00');
    expect(temConflito).toBe(false);
  });

  it('deve retornar false se for em dia diferente', () => {
    // Mesmo horário, dia diferente
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-21', '10:00');
    expect(temConflito).toBe(false);
  });

  it('deve ignorar agendamentos cancelados', () => {
    // 14:00 existe mas está cancelado
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-20', '14:00');
    expect(temConflito).toBe(false);
  });
});