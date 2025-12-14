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

export interface Sessao {
  id: string;
  data: string;
  tipo: string;
  statusSessao: "compareceu" | "faltou" | "remarcada" | "cancelada";
  evolucao: string;
}

export interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  status: "ativo" | "inativo" | "pausa";

  queixaPrincipal?: string;
  historicoFamiliar?: string;
  observacoesIniciais?: string;
  frequenciaSessao?: "SEMANAL" | "QUINZENAL" | "MENSAL" | "AVULSO";
  avatarColor?: string;
  anotacoes?: string;

  sessoes: Sessao[];
}

interface PacientesContextData {
  pacientes: Paciente[];
  isLoading: boolean;
  adicionarPaciente: (paciente: Partial<Paciente>) => Promise<void>;
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

      // CORREÇÃO AQUI: Trocamos 'any' por 'Partial<Paciente>' para satisfazer o lint
      // O 'Partial' diz que o objeto pode ter as chaves de Paciente, mas não garante que todas existam, o que é seguro para dados de API.
      const dadosFormatados: Paciente[] = response.data.content.map(
        (p: Partial<Paciente>) => ({
          ...p,
          sessoes: [], // Garante array vazio se vier null
          dataNascimento: p.dataNascimento || "",
          // Adaptador de Status: Garante minúsculo para o front
          status: p.status
            ? (p.status.toLowerCase() as Paciente["status"])
            : "ativo",
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
      // Envia para o Java em Maiúsculo (se for enum)
      const payload = {
        ...dados,
        frequenciaSessao: dados.frequenciaSessao?.toUpperCase() || "SEMANAL",
      };

      const response = await api.post("/pacientes", payload);

      // Ao receber de volta, aplica o mesmo adaptador localmente
      const novoPaciente: Paciente = {
        ...response.data,
        sessoes: [],
        status: response.data.status
          ? (response.data.status.toLowerCase() as Paciente["status"])
          : "ativo",
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
      // ADAPTADOR DE ENVIO (Correção do Teste 3)
      // Antes de mandar pro Java, transformamos os Enums em MAIÚSCULO
      const payload = {
        id,
        ...dados,
        // Se o dado existir, converte. Se não, manda undefined para o Java ignorar.
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
              // ADAPTADOR DE RECEBIMENTO
              // O Java devolve MAIÚSCULO, nós convertemos para minúsculo para o React não quebrar
              status: response.data.status
                ? (response.data.status.toLowerCase() as Paciente["status"])
                : p.status,
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

  const adicionarSessao = (pacienteId: string, sessao: Omit<Sessao, "id">) => {
    console.warn(
      "Backend de Sessões ainda não implementado. Salvando apenas em memória."
    );
    setPacientes((state) =>
      state.map((p) => {
        if (p.id === pacienteId) {
          const novaSessao: Sessao = { ...sessao, id: crypto.randomUUID() };
          return { ...p, sessoes: [...p.sessoes, novaSessao] };
        }
        return p;
      })
    );
    if (addToast)
      addToast({
        type: "info",
        title: "Atenção",
        description: "Sessão salva apenas localmente (Backend pendente).",
      });
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
