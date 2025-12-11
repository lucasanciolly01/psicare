import { describe, it, expect } from 'vitest'; // ou 'jest', dependendo do seu setup
import { verificarConflito } from './agendamento';

describe('Lógica de Conflito de Agendamento', () => {
  // Mock de dados (agendamento existente às 10:00)
  const agendamentosExistentes = [
    { data: '2025-10-20', hora: '10:00', status: 'ativo' }
  ];

  it('deve bloquear agendamento com menos de 50 minutos de diferença (Ex: 10:30)', () => {
    // Tenta agendar para 10:30 no mesmo dia (diferença de 30min)
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-20', '10:30');
    expect(temConflito).toBe(true);
  });

  it('deve permitir agendamento com 50 minutos ou mais de diferença (Ex: 10:50)', () => {
    // Tenta agendar para 10:50 no mesmo dia (diferença de 50min)
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-20', '10:50');
    expect(temConflito).toBe(false);
  });

  it('deve permitir agendamento em data diferente mesmo no mesmo horário', () => {
    // Tenta agendar para 10:00, mas em outro dia
    const temConflito = verificarConflito(agendamentosExistentes, '2025-10-21', '10:00');
    expect(temConflito).toBe(false);
  });
});