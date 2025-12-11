import { describe, it, expect } from 'vitest';
import { verificarConflito, validarHorarioComercial } from './agendaUtils';

describe('Lógica de Agendamento', () => {
  
  it('Deve detectar conflito se o horário já estiver ocupado', () => {
    const agendamentosExistentes = [
      { id: '1', data: '2023-10-20', horario: '14:00', pacienteId: '123' }
    ];
    
    const existeConflito = verificarConflito('14:00', agendamentosExistentes);
    
    // Esperamos que retorne TRUE (verdadeiro) pois já existe agendamento às 14:00
    expect(existeConflito).toBe(true);
  });

  it('NÃO deve detectar conflito em horário livre', () => {
    const agendamentosExistentes = [
      { id: '1', data: '2023-10-20', horario: '14:00', pacienteId: '123' }
    ];
    
    const existeConflito = verificarConflito('15:00', agendamentosExistentes);
    
    // Esperamos que retorne FALSE, pois 15:00 está livre
    expect(existeConflito).toBe(false);
  });

  it('Deve bloquear horários fora do expediente', () => {
    expect(validarHorarioComercial('07:00')).toBe(false); // Muito cedo
    expect(validarHorarioComercial('19:00')).toBe(false); // Muito tarde
    expect(validarHorarioComercial('10:00')).toBe(true);  // Horário válido
  });
});