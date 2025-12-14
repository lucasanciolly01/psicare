import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import type { Paciente, Sessao } from "../types";

interface PacientesContextData {
  pacientes: Paciente[];
  isLoading: boolean;
  adicionarPaciente: (dados: Partial<Paciente>) => Promise<void>;
  editarPaciente: (id: string, dados: Partial<Paciente>) => Promise<void>;
  removerPaciente: (id: string) => Promise<void>;
  atualizarPaciente: (id: string, dados: Partial<Paciente>) => Promise<void>;
  adicionarSessao: (pacienteId: string, sessao: Omit<Sessao, "id">) => void;
}

const PacientesContext = createContext<PacientesContextData>(
  {} as PacientesContextData
);

export function PacientesProvider({ children }: { children: ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { usuario } = useAuth();
  const { addToast } = useToast();

  const carregarPacientes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/pacientes?size=100");

      // CORREÇÃO LINT 1: Tipamos a resposta explicitamente antes do map para evitar 'any'
      const conteudoResponse = response.data.content as Partial<Paciente>[];

      const dadosFormatados: Paciente[] = conteudoResponse.map(
        (p) => ({
          ...p,
          // Garante campos obrigatórios caso venham nulos do back
          id: p.id || "",
          nome: p.nome || "Sem Nome",
          email: p.email || "",
          telefone: p.telefone || "",
          sessoes: [], 
          dataNascimento: p.dataNascimento || "",
          // Tipagem segura do status
          status: p.status as Paciente['status'], 
          frequenciaSessao: p.frequenciaSessao,
        })
      );

      setPacientes(dadosFormatados);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      if (addToast)
        addToast({
          type: "error",
          title: "Erro",
          description: "Não foi possível carregar a lista de pacientes.",
        });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (usuario) {
      carregarPacientes();
    } else {
      setPacientes([]);
    }
  }, [usuario, carregarPacientes]);

  const adicionarPaciente = async (dados: Partial<Paciente>) => {
    try {
      const payload = {
        ...dados,
        status: dados.status ? dados.status.toUpperCase() : "ATIVO",
        frequenciaSessao:
          dados.frequenciaSessao?.toUpperCase() || "SEMANAL",
      };

      const response = await api.post("/pacientes", payload);

      const novoPaciente: Paciente = {
        ...response.data,
        sessoes: [],
      };

      setPacientes((prev) => [...prev, novoPaciente]);
      if (addToast)
        addToast({
          type: "success",
          title: "Sucesso",
          description: "Paciente cadastrado com sucesso!",
        });
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      if (addToast)
        addToast({
          type: "error",
          title: "Erro",
          description: "Erro ao cadastrar paciente.",
        });
      throw error;
    }
  };

  const editarPaciente = async (id: string, dados: Partial<Paciente>) => {
    try {
      const payload = {
        id,
        ...dados,
        status: dados.status ? dados.status.toUpperCase() : undefined,
        frequenciaSessao: dados.frequenciaSessao
          ? dados.frequenciaSessao.toUpperCase()
          : undefined,
      };

      const response = await api.put("/pacientes", payload);

      setPacientes((state) =>
        state.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              ...response.data,
              sessoes: p.sessoes,
            };
          }
          return p;
        })
      );

      if (addToast)
        addToast({
          type: "success",
          title: "Sucesso",
          description: "Dados atualizados.",
        });
    } catch (error) {
      console.error("Erro ao editar paciente:", error);
      if (addToast)
        addToast({
          type: "error",
          title: "Erro",
          description: "Não foi possível salvar as alterações.",
        });
      throw error;
    }
  };

  const removerPaciente = async (id: string) => {
    try {
      await api.delete(`/pacientes/${id}`);
      setPacientes((state) => state.filter((p) => p.id !== id));
      if (addToast)
        addToast({
          type: "success",
          title: "Sucesso",
          description: "Paciente removido.",
        });
    } catch (error) {
      console.error("Erro ao excluir:", error);
      if (addToast)
        addToast({
          type: "error",
          title: "Erro",
          description: "Erro ao excluir paciente.",
        });
      throw error;
    }
  };

  // CORREÇÃO LINT 2: Removemos os argumentos não utilizados para satisfazer o eslint
  const adicionarSessao = () => {
    console.warn(
      "Atenção: Use o sessaoService no Modal. Esta função é apenas um fallback."
    );
  };

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        isLoading,
        adicionarPaciente,
        editarPaciente,
        atualizarPaciente: editarPaciente,
        removerPaciente,
        adicionarSessao,
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePacientes() {
  return useContext(PacientesContext);
}