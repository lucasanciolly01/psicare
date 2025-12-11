export interface Agendamento {
  id: string;
  data: string; // formato YYYY-MM-DD
  horario: string; // formato HH:mm
  pacienteId: string;
}

export const verificarConflito = (
  novoHorario: string,
  agendamentosDoDia: Agendamento[]
): boolean => {
  // Retorna TRUE se houver conflito, FALSE se estiver livre
  return agendamentosDoDia.some((agendamento) => agendamento.horario === novoHorario);
};

export const validarHorarioComercial = (horario: string): boolean => {
  const hora = parseInt(horario.split(':')[0]);
  // Permite agendamentos apenas entre 08:00 e 18:00
  return hora >= 8 && hora < 18;
};