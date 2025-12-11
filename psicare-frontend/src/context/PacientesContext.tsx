import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { storageService } from '../services/storageService';

// 1. Definição da Sessão (Evolução)
export interface Sessao {
  id: string;
  data: string;
  tipo: string;
  statusSessao: 'compareceu' | 'faltou' | 'remarcada' | 'cancelada';
  evolucao: string;
}

// 2. Definição do Paciente (Atualizada com Sessões)
export interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  status: 'ativo' | 'inativo' | 'pausa';
  
  // Prontuário
  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  anotacoes?: string;
  
  // Histórico de Evoluções
  sessoes: Sessao[];
}

interface PacientesContextData {
  pacientes: Paciente[];
  adicionarPaciente: (paciente: Omit<Paciente, 'id' | 'status' | 'sessoes'>) => void;
  editarPaciente: (id: string, dados: Partial<Paciente>) => void;
  removerPaciente: (id: string) => void;
  atualizarPaciente: (id: string, dados: Partial<Paciente>) => void;
  
  // Nova função exportada
  adicionarSessao: (pacienteId: string, sessao: Omit<Sessao, 'id'>) => void;
}

const PacientesContext = createContext<PacientesContextData>({} as PacientesContextData);

export function PacientesProvider({ children }: { children: ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const data = storageService.get<Paciente[]>('pacientes');
    // Garante que todo paciente tenha um array de sessoes, mesmo os antigos
    return data ? data.map(p => ({ ...p, sessoes: p.sessoes || [] })) : [];
  });

  useEffect(() => {
    storageService.set('pacientes', pacientes);
  }, [pacientes]);

  const adicionarPaciente = (dados: Omit<Paciente, 'id' | 'status' | 'sessoes'>) => {
    const novoPaciente: Paciente = {
      id: crypto.randomUUID(),
      status: 'ativo',
      sessoes: [], // Inicia com histórico vazio
      ...dados,
    };
    setPacientes((state) => [...state, novoPaciente]);
  };

  const editarPaciente = (id: string, dados: Partial<Paciente>) => {
    setPacientes((state) =>
      state.map((p) => (p.id === id ? { ...p, ...dados } : p))
    );
  };

  const removerPaciente = (id: string) => {
    setPacientes((state) => state.filter((p) => p.id !== id));
  };

  // 3. Função para adicionar evolução ao histórico do paciente
  const adicionarSessao = (pacienteId: string, sessao: Omit<Sessao, 'id'>) => {
    setPacientes((state) => 
      state.map((p) => {
        if (p.id === pacienteId) {
          const novaSessao: Sessao = { ...sessao, id: crypto.randomUUID() };
          // Adiciona a nova sessão no topo ou final da lista
          return { ...p, sessoes: [...p.sessoes, novaSessao] };
        }
        return p;
      })
    );
  };

  return (
    <PacientesContext.Provider value={{ 
      pacientes, 
      adicionarPaciente, 
      editarPaciente, 
      atualizarPaciente: editarPaciente, 
      removerPaciente,
      adicionarSessao 
    }}>
      {children}
    </PacientesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePacientes() {
  return useContext(PacientesContext);
}