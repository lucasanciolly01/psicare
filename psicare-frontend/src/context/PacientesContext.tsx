import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

// FUNÇÃO DE DEBOUNCE (Adicionada aqui para evitar dependências externas)
const debounce = (func: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export interface Sessao {
  id: string;
  data: string;
  tipo: string;
  statusSessao: 'compareceu' | 'faltou' | 'remarcada' | 'cancelada';
  evolucao: string;
}

export interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  status: 'ativo' | 'inativo' | 'pausa';
  email?: string;
  dataNascimento?: string;
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  anotacoes?: string;
  sessoes: Sessao[]; 
}

interface PacientesContextData {
  pacientes: Paciente[];
  adicionarPaciente: (paciente: Omit<Paciente, 'id' | 'sessoes'> & { sessoes?: Sessao[] }) => void;
  removerPaciente: (id: string) => void;
  atualizarPaciente: (id: string, dados: Partial<Omit<Paciente, 'id'>>) => void;
  totalAtivos: number;
  adicionarSessao: (pacienteId: string, sessao: Omit<Sessao, 'id'>) => void; 
}

const PacientesContext = createContext<PacientesContextData>({} as PacientesContextData);

export function PacientesProvider({ children }: { children: ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const saved = localStorage.getItem('psicare_pacientes_v2');
    
    if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({ ...p, sessoes: p.sessoes || [], })) as Paciente[];
    }

    return [
      { id: '1', nome: 'Ana Souza', telefone: '(11) 99999-9999', status: 'ativo', email: 'ana@email.com', sessoes: [] },
      { id: '2', nome: 'Carlos Mendes', telefone: '(11) 98888-8888', status: 'pausa', email: 'carlos@email.com', sessoes: [] },
    ];
  });

  // 1. Criar a função debounced para salvar (salva com 500ms de delay após a última mudança)
  const debouncedSave = debounce((data: Paciente[]) => {
    localStorage.setItem('psicare_pacientes_v2', JSON.stringify(data));
  }, 500); 

  // 2. Usar o debouncedSave no useEffect
  useEffect(() => {
    debouncedSave(pacientes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacientes]); 

  const adicionarPaciente = (dadosPaciente: Omit<Paciente, 'id' | 'sessoes'> & { sessoes?: Sessao[] }) => {
    const novoPaciente: Paciente = {
      id: Date.now().toString(),
      sessoes: [], 
      ...dadosPaciente,
    };
    setPacientes((state) => [novoPaciente, ...state]);
  };
  
  const adicionarSessao = (pacienteId: string, dadosSessao: Omit<Sessao, 'id'>) => {
    const novaSessao: Sessao = {
      id: Date.now().toString(),
      ...dadosSessao,
    };
    setPacientes((state) => 
      state.map((p) =>
        p.id === pacienteId
          ? { ...p, sessoes: [novaSessao, ...p.sessoes] }
          : p
      )
    );
  };

  const removerPaciente = (id: string) => {
    setPacientes((state) => state.filter((p) => p.id !== id));
  };

  const atualizarPaciente = (id: string, dados: Partial<Omit<Paciente, 'id'>>) => {
    setPacientes((state) => 
      state.map((p) => p.id === id ? { ...p, ...dados } : p)
    );
  };

  const totalAtivos = pacientes.filter(p => p.status === 'ativo').length;

  return (
    <PacientesContext.Provider value={{ pacientes, adicionarPaciente, removerPaciente, atualizarPaciente, totalAtivos, adicionarSessao }}>
      {children}
    </PacientesContext.Provider>
  );
}

export function usePacientes() {
  return useContext(PacientesContext);
}