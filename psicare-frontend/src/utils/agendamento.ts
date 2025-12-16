// Definição compatível com a interface do Contexto
export interface AgendamentoItem {
  data: string;
  hora: string;
  status?: string; 
  // REMOVIDO: [key: string]: unknown; -> Isso causava o erro de build
}

export const verificarConflito = (
  agendamentos: AgendamentoItem[], 
  data: string, 
  horaNova: string
): boolean => {
  // Converte a hora nova para minutos
  const [hNova, mNova] = horaNova.split(':').map(Number);
  const minutosNovo = hNova * 60 + mNova;

  // Filtra agendamentos do mesmo dia e que não estão cancelados
  const agendamentosDoDia = agendamentos.filter(
    a => a.data === data && a.status !== 'cancelado'
  );

  for (const agendamento of agendamentosDoDia) {
    const [hExistente, mExistente] = agendamento.hora.split(':').map(Number);
    const minutosExistente = hExistente * 60 + mExistente;

    // Calcula a diferença absoluta
    const diferenca = Math.abs(minutosNovo - minutosExistente);

    // Se a diferença for menor que 50 minutos, é conflito
    if (diferenca < 50) {
      return true; 
    }
  }

  return false;
};