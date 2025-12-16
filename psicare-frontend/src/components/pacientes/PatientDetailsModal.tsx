import { Modal } from "../ui/Modal";
import { sessaoService } from "../../services/sessaoService";
import { type Paciente, type StatusSessao, type Sessao } from "../../types";
import { useToast } from "../../context/ToastContext";
import { AxiosError } from "axios"; // <--- Importação Adicionada
import {
  Phone,
  Mail,
  Activity,
  Clock,
  Plus,
  FileText,
  Lock,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  ArrowRight,
  User,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback, type ElementType } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

// Interface para mapear o erro de validação que vem do Java (TratadorDeErros)
interface BackendValidationError {
  campo: string;
  mensagem: string;
}

// Interface para mensagens de erro simples (ex: regras de negócio genéricas)
interface BackendMessageError {
  message: string;
}

const InfoSection = ({
  icon: Icon,
  title,
  content,
  isPrivate = false,
}: {
  icon: ElementType;
  title: string;
  content?: string;
  isPrivate?: boolean;
}) => (
  <div
    className={`p-5 rounded-xl border transition-all ${
      isPrivate
        ? "bg-amber-50/50 border-amber-100 hover:border-amber-200"
        : "bg-white border-secondary-100 hover:border-secondary-200 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center gap-2 mb-3">
      <div
        className={`p-1.5 rounded-lg ${
          isPrivate
            ? "bg-amber-100 text-amber-600"
            : "bg-primary-50 text-primary-600"
        }`}
      >
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <h4
        className={`text-xs font-bold uppercase tracking-wider ${
          isPrivate ? "text-amber-800" : "text-secondary-400"
        }`}
      >
        {title}
      </h4>
    </div>
    <div
      className={`text-sm leading-relaxed ${
        isPrivate ? "text-amber-900" : "text-secondary-700"
      }`}
    >
      {content ? (
        <p className="whitespace-pre-wrap font-medium">{content}</p>
      ) : (
        <span className="text-secondary-400 italic text-xs">
          Informação não registrada.
        </span>
      )}
    </div>
  </div>
);

export function PatientDetailsModal({
  isOpen,
  onClose,
  paciente,
}: PatientDetailsProps) {
  const { addToast } = useToast();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [isNewSessaoModalOpen, setIsNewSessaoModalOpen] = useState(false);

  const [novaSessao, setNovaSessao] = useState<{
    data: string;
    tipo: string;
    statusSessao: StatusSessao;
    evolucao: string;
  }>({
    data: new Date().toISOString().split("T")[0],
    tipo: "Sessão de Acompanhamento",
    statusSessao: "COMPARECEU",
    evolucao: "",
  });

  const carregarHistorico = useCallback(async (pacienteId: string) => {
    try {
      setLoadingHistory(true);
      const dados = await sessaoService.listarPorPaciente(pacienteId);
      setSessoes(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && paciente) {
      carregarHistorico(paciente.id);
    }
  }, [isOpen, paciente, carregarHistorico]);

  if (!paciente) return null;

  const dataNascimentoFormatada = paciente.dataNascimento
    ? format(parseISO(paciente.dataNascimento), "dd/MM/yyyy", { locale: ptBR })
    : "N/A";

  const getStatusClasses = (status: string, isSelected: boolean = false) => {
    const s = status ? status.toUpperCase() : "";

    if (isSelected) {
      switch (s) {
        case "COMPARECEU":
          return "bg-emerald-600 border-emerald-700 text-white shadow-md ring-2 ring-emerald-200";
        case "FALTOU":
          return "bg-rose-600 border-rose-700 text-white shadow-md ring-2 ring-rose-200";
        case "REMARCADA":
          return "bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-200";
        case "CANCELADA":
          return "bg-secondary-600 border-secondary-700 text-white shadow-md ring-2 ring-secondary-200";
        default:
          return "bg-secondary-600 text-white";
      }
    }
    switch (s) {
      case "COMPARECEU":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10";
      case "FALTOU":
        return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10";
      case "REMARCADA":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10";
      default:
        return "bg-secondary-50 text-secondary-700 border-secondary-100";
    }
  };

  const handleAdicionarSessao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente) return;

    try {
      const sessaoCriada = await sessaoService.criar(paciente.id, novaSessao);

      setSessoes([sessaoCriada, ...sessoes]);

      setNovaSessao({
        data: new Date().toISOString().split("T")[0],
        tipo: "Sessão de Acompanhamento",
        statusSessao: "COMPARECEU",
        evolucao: "",
      });
      setIsNewSessaoModalOpen(false);

      if (addToast)
        addToast({
          type: "success",
          title: "Sucesso",
          description: "Evolução registrada.",
        });
    } catch (error) { // Removido o ': any'
      console.error("Erro ao salvar sessão:", error);
      
      let mensagemErro = "Não foi possível salvar a sessão.";
      
      // Tipagem segura usando AxiosError
      const err = error as AxiosError<BackendValidationError[] | BackendMessageError>;

      // Lógica para extrair mensagens do TratadorDeErros (Java)
      if (err.response?.data) {
        const dadosErro = err.response.data;
        
        // Caso 1: Array de erros de validação (ex: @NotNull, @NotBlank)
        if (Array.isArray(dadosErro)) {
          // Formata: "Campo: erro" (ex: "data: não deve ser nulo")
          const detalhes = dadosErro
            .map(e => `${e.campo}: ${e.mensagem}`)
            .join(' | ');
          mensagemErro = `Verifique os campos: ${detalhes}`;
        } 
        // Caso 2: Erro genérico com mensagem simples
        else if ('message' in dadosErro) {
          mensagemErro = dadosErro.message;
        }
      }

      if (addToast)
        addToast({
          type: "error",
          title: "Erro de Validação",
          description: mensagemErro,
        });
    }
  };

  const traduzirStatus = (status: string) => {
    if (status === "COMPARECEU") return "Realizado";
    if (status === "FALTOU") return "Faltou";
    if (status === "REMARCADA") return "Remarcada";
    if (status === "CANCELADA") return "Cancelada";
    return status;
  };

  const statusPacienteDisplay =
    paciente.status === "ATIVO"
      ? "Acompanhamento"
      : paciente.status === "PAUSA"
      ? "Pausado"
      : "Inativo";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Prontuário Digital"
        size="xl"
      >
        <div className="space-y-8 animate-fade-in">
          {/* Header do Prontuário */}
          <div className="relative overflow-hidden bg-secondary-900 p-8 rounded-2xl shadow-lg border border-secondary-800 text-white">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-20 h-20 rounded-full bg-secondary-800 text-primary-400 flex items-center justify-center text-3xl font-bold border-4 border-secondary-700 shadow-xl">
                {paciente.nome.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {paciente.nome}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      paciente.status === "ATIVO"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-white/10 text-gray-300 border-white/10"
                    }`}
                  >
                    {statusPacienteDisplay}
                  </span>
                </div>

                <p className="text-secondary-400 text-sm">
                  Prontuário #{paciente.id.substring(0, 8)}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs font-medium text-secondary-300 mt-3">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/15 transition-colors cursor-default">
                    <Phone size={14} className="text-primary-400" />{" "}
                    {paciente.telefone}
                  </span>
                  {paciente.email && (
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/15 transition-colors cursor-default">
                      <Mail size={14} className="text-primary-400" />{" "}
                      {paciente.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/15 transition-colors cursor-default">
                    <CalendarIcon size={14} className="text-primary-400" />{" "}
                    {dataNascimentoFormatada}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Coluna Esquerda: Dados Fixos */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
                <User size={16} className="text-secondary-400" />
                <h3 className="text-xs font-bold text-secondary-400 uppercase tracking-widest">
                  Ficha Clínica
                </h3>
              </div>
              <InfoSection
                icon={Activity}
                title="Queixa Principal"
                content={paciente.queixaPrincipal}
              />
              <InfoSection
                icon={Activity}
                title="Histórico Familiar"
                content={paciente.historicoFamiliar}
              />
              <InfoSection
                icon={FileText}
                title="Observações Iniciais"
                content={paciente.observacoesIniciais}
              />
              <InfoSection
                icon={Lock}
                title="Anotações Privadas"
                content={paciente.anotacoes}
                isPrivate={true}
              />
            </div>

            {/* Coluna Direita: Timeline de Sessões */}
            <div className="md:col-span-7 flex flex-col h-full bg-secondary-50/50 rounded-2xl p-4 border border-secondary-100">
              <div className="flex items-center justify-between gap-2 pb-4 mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-secondary-400" />
                  <h3 className="text-xs font-bold text-secondary-400 uppercase tracking-widest">
                    Evolução Clínica
                  </h3>
                  <span className="bg-secondary-200 text-secondary-600 px-1.5 rounded text-[10px] font-bold">
                    {sessoes.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsNewSessaoModalOpen(true)}
                  className="text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1.5 transition-colors px-3 py-2 rounded-lg shadow-sm active:scale-95"
                >
                  <Plus size={14} strokeWidth={3} /> Nova Sessão
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[600px] pr-2 space-y-4 custom-scrollbar">
                {loadingHistory ? (
                  <div className="flex justify-center py-10">
                    <Loader2
                      className="animate-spin text-primary-600"
                      size={24}
                    />
                  </div>
                ) : sessoes.length > 0 ? (
                  sessoes.map((sessao, idx) => (
                    <div
                      key={sessao.id}
                      className="group relative bg-white border border-secondary-200/60 rounded-xl p-5 hover:shadow-card hover:border-primary-200 transition-all duration-300"
                    >
                      {/* Linha conectora visual (Timeline effect) */}
                      {idx !== sessoes.length - 1 && (
                        <div className="absolute left-[26px] top-[60px] bottom-[-20px] w-px bg-secondary-100 -z-10 group-hover:bg-primary-100 transition-colors"></div>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-secondary-50 border border-secondary-100 text-secondary-500 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                            <CalendarIcon size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-secondary-900 leading-tight">
                              {sessao.tipo}
                            </p>
                            <p className="text-xs text-secondary-400 font-medium">
                              {sessao.data
                                ? format(
                                    parseISO(sessao.data),
                                    "dd 'de' MMM, yyyy",
                                    { locale: ptBR }
                                  )
                                : "Data n/a"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase border ring-1 ring-inset ${getStatusClasses(
                            sessao.statusSessao
                          )}`}
                        >
                          {traduzirStatus(sessao.statusSessao)}
                        </span>
                      </div>

                      <div className="pl-[42px]">
                        <div className="bg-secondary-50/50 rounded-lg p-3 text-sm text-secondary-700 leading-relaxed border border-transparent group-hover:bg-white group-hover:border-secondary-100 transition-colors">
                          {sessao.evolucao || "Sem descrição."}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-secondary-200 rounded-xl bg-white/50">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-3">
                      <FileText size={24} className="text-secondary-400" />
                    </div>
                    <p className="text-sm text-secondary-900 font-bold">
                      Nenhuma evolução registrada.
                    </p>
                    <p className="text-xs text-secondary-500 mt-1 max-w-[200px]">
                      Clique em "Nova Sessão" para iniciar o histórico deste
                      paciente.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Interno: Nova Sessão */}
      <Modal
        isOpen={isNewSessaoModalOpen}
        onClose={() => setIsNewSessaoModalOpen(false)}
        title={`Nova Evolução: ${paciente.nome}`}
        size="md"
      >
        <form onSubmit={handleAdicionarSessao} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                Tipo de Sessão
              </label>
              <div className="relative group">
                <select
                  required
                  className="w-full pl-4 pr-10 h-11 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none bg-white transition-all appearance-none text-sm font-medium text-secondary-900"
                  value={novaSessao.tipo}
                  onChange={(e) =>
                    setNovaSessao({ ...novaSessao, tipo: e.target.value })
                  }
                >
                  <option>Sessão de Acompanhamento</option>
                  <option>Anamnese Inicial</option>
                  <option>Retorno/Reavaliação</option>
                  <option>Entrevista Familiar</option>
                </select>
                <ArrowRight
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 rotate-90 pointer-events-none group-hover:text-primary-600 transition-colors"
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                Data
              </label>
              <div className="relative group">
                <CalendarIcon
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none left-3 group-hover:text-primary-600 transition-colors"
                />
                <input
                  required
                  type="date"
                  className="w-full h-11 pl-10 pr-4 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-secondary-900 bg-white text-sm font-medium"
                  value={novaSessao.data}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNovaSessao({ ...novaSessao, data: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-secondary-700 mb-2 uppercase tracking-wide">
                Resultado da Sessão
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(
                  [
                    { id: "COMPARECEU", label: "Realizado", icon: CheckCircle },
                    { id: "FALTOU", label: "Faltou", icon: XCircle },
                    { id: "REMARCADA", label: "Remarcada", icon: Clock },
                    { id: "CANCELADA", label: "Cancelada", icon: XCircle },
                  ] as const
                ).map((item) => {
                  const isSelected = novaSessao.statusSessao === item.id;
                  const IconComp = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setNovaSessao({ ...novaSessao, statusSessao: item.id })
                      }
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 border cursor-pointer active:scale-95 ${
                        isSelected
                          ? getStatusClasses(item.id, true)
                          : "bg-white border-secondary-200 text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300"
                      }`}
                    >
                      <IconComp size={18} strokeWidth={isSelected ? 2.5 : 2} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                Descrição da Evolução
              </label>
              <textarea
                required
                className="w-full p-4 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none h-32 resize-none text-sm leading-relaxed transition-all shadow-sm placeholder:text-secondary-400 font-medium"
                placeholder="Descreva os pontos principais abordados..."
                value={novaSessao.evolucao}
                onChange={(e) =>
                  setNovaSessao({ ...novaSessao, evolucao: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          <div className="pt-2 flex flex-col-reverse md:flex-row gap-3 border-t border-secondary-100">
            <button
              type="button"
              onClick={() => setIsNewSessaoModalOpen(false)}
              className="flex-1 py-3 border border-secondary-200 text-secondary-700 rounded-xl font-bold hover:bg-secondary-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
            >
              Salvar Evolução
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}