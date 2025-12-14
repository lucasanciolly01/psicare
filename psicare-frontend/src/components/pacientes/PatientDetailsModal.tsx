import { Modal } from "../ui/Modal";
import { type Paciente, type Sessao, type StatusSessao } from "../../types";
import { sessaoService } from "../../services/sessaoService";
import { useToast } from "../../context/ToastContext";
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
} from "lucide-react";
import { useState, useEffect, useCallback, type ElementType } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

// --- HELPER: Componente Visual de Informação ---
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
    className={`p-4 rounded-xl border ${
      isPrivate ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100"
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <div
        className={`p-1 rounded-md ${
          isPrivate
            ? "bg-amber-100 text-amber-600"
            : "bg-white text-primary shadow-sm"
        }`}
      >
        <Icon size={14} />
      </div>
      <h4
        className={`text-xs font-bold uppercase tracking-wide ${
          isPrivate ? "text-amber-800" : "text-gray-400"
        }`}
      >
        {title}
      </h4>
    </div>
    <div
      className={`text-sm leading-relaxed ${
        isPrivate ? "text-amber-900" : "text-gray-700"
      }`}
    >
      {content ? (
        <p className="whitespace-pre-wrap">{content}</p>
      ) : (
        <span className="text-gray-400 italic text-xs">Não registrado.</span>
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

  // Estado inicial
  const [novaSessao, setNovaSessao] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo: "Sessão de Acompanhamento",
    status: "REALIZADO" as StatusSessao,
    evolucao: "",
  });

  const carregarHistorico = useCallback(async (pacienteId: string) => {
    try {
      setLoadingHistory(true);
      const dados = await sessaoService.listarPorPaciente(pacienteId);
      setSessoes(dados);
    } catch (error) {
      console.error(error);
      if (addToast) addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar histórico.' });
    } finally {
      setLoadingHistory(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isOpen && paciente) {
      carregarHistorico(paciente.id);
    }
  }, [isOpen, paciente, carregarHistorico]);

  if (!paciente) return null;

  const dataNascimentoFormatada = paciente.dataNascimento
    ? format(parseISO(paciente.dataNascimento), "dd/MM/yyyy", { locale: ptBR })
    : "N/A";

  // --- CORES DOS BADGES ---
  const getStatusClasses = (
    status: string,
    isSelected: boolean = false
  ) => {
    const s = status ? status.toUpperCase() : "";

    if (isSelected) {
      switch (s) {
        case "REALIZADO":
          return "bg-green-600 border-green-700 text-white shadow-md ring-2 ring-green-200";
        case "FALTOU":
          return "bg-red-600 border-red-700 text-white shadow-md ring-2 ring-red-200";
        case "AGENDADO": // Mapeia para Remarcada/Agendada
          return "bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-200";
        case "CANCELADO_PACIENTE": // Mapeia para Cancelada
        case "CANCELADO_TERAPEUTA":
          return "bg-gray-600 border-gray-700 text-white shadow-md ring-2 ring-gray-200";
        default: return "bg-gray-600 text-white";
      }
    }
    // Cores para a lista (timeline)
    switch (s) {
      case "REALIZADO":
        return "bg-green-100 text-green-700 border-green-200";
      case "FALTOU":
        return "bg-red-100 text-red-700 border-red-200";
      case "AGENDADO":
      case "CONFIRMADO":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleAdicionarSessao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente) return;

    try {
      const dataIso = new Date(novaSessao.data).toISOString(); 

      const sessaoCriada = await sessaoService.criar(paciente.id, {
        dataInicio: dataIso,
        // O status aqui JÁ ESTÁ correto pois vem do botão que define o ENUM exato
        status: novaSessao.status, 
        evolucao: novaSessao.evolucao,
        anotacoes: novaSessao.tipo 
      });

      setSessoes([sessaoCriada, ...sessoes]);
      
      setNovaSessao({
        data: new Date().toISOString().split("T")[0],
        tipo: "Sessão de Acompanhamento",
        status: "REALIZADO",
        evolucao: "",
      });
      setIsNewSessaoModalOpen(false);
      
      if (addToast) addToast({ type: 'success', title: 'Sucesso', description: 'Evolução salva!' });

    } catch (error) {
      console.error(error);
      if (addToast) addToast({ type: 'error', title: 'Erro', description: 'Erro ao salvar evolução.' });
    }
  };

  // Helper visual para traduzir o ENUM para Português na tela
  const traduzirStatus = (status: string) => {
      if (status === 'AGENDADO') return 'Remarcada';
      if (status === 'CANCELADO_PACIENTE') return 'Cancelada';
      if (status === 'REALIZADO') return 'Realizado';
      if (status === 'FALTOU') return 'Faltou';
      return status;
  }

  const statusPacienteDisplay = paciente.status === 'ATIVO' ? 'Acompanhamento' : 
                                paciente.status === 'PAUSA' ? 'Pausado' : 'Inativo';

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Prontuário Digital"
        size="xl"
      >
        <div className="space-y-6">
          {/* HEADER */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100">
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                {paciente.nome.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {paciente.nome}
                  </h2>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      paciente.status === "ATIVO"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {statusPacienteDisplay}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-lg border border-green-50">
                    <Phone size={14} className="text-primary" />{" "}
                    {paciente.telefone}
                  </span>
                  {paciente.email && (
                    <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-lg border border-green-50">
                      <Mail size={14} className="text-primary" />{" "}
                      {paciente.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-lg border border-green-50">
                    <CalendarIcon size={14} className="text-primary" />{" "}
                    {dataNascimentoFormatada}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-100/50 rounded-full blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Activity size={16} className="text-gray-400" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Dados Clínicos
                </h3>
              </div>
              <InfoSection icon={Activity} title="Queixa Principal" content={paciente.queixaPrincipal} />
              <InfoSection icon={Activity} title="Histórico Familiar" content={paciente.historicoFamiliar} />
              <InfoSection icon={FileText} title="Observações Iniciais" content={paciente.observacoesIniciais} />
              <InfoSection icon={Lock} title="Anotações Privadas" content={paciente.anotacoes} isPrivate={true} />
            </div>

            <div className="md:col-span-7 flex flex-col h-full">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Histórico ({sessoes.length || 0})
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewSessaoModalOpen(true)}
                  className="text-xs font-bold text-primary hover:text-green-700 flex items-center gap-1 transition-colors bg-green-50 px-3 py-1.5 rounded-lg"
                >
                  <Plus size={14} /> Nova Evolução
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-3 custom-scrollbar">
                {loadingHistory ? (
                  <div className="text-center py-10 text-gray-500">Carregando...</div>
                ) : sessoes.length > 0 ? (
                  sessoes.map((sessao) => (
                    <div
                      key={sessao.id}
                      className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all hover:border-primary/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {sessao.anotacoes || "Sessão de Acompanhamento"}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <CalendarIcon size={10} />
                            {sessao.dataInicio ? format(parseISO(sessao.dataInicio), "dd 'de' MMM, yyyy", { locale: ptBR }) : "Data n/a"}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase border ${getStatusClasses(sessao.status)}`}>
                          {traduzirStatus(sessao.status)}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-colors">
                        {sessao.evolucao || "Sem descrição."}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <FileText size={32} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Nenhuma evolução registrada.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isNewSessaoModalOpen}
        onClose={() => setIsNewSessaoModalOpen(false)}
        title={`Nova Evolução: ${paciente.nome}`}
        size="md"
      >
        <form onSubmit={handleAdicionarSessao} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Tipo de Sessão</label>
              <div className="relative">
                <select
                  required
                  className="w-full pl-4 pr-10 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all appearance-none text-base text-gray-700"
                  value={novaSessao.tipo}
                  onChange={(e) => setNovaSessao({ ...novaSessao, tipo: e.target.value })}
                >
                  <option>Sessão de Acompanhamento</option>
                  <option>Anamnese Inicial</option>
                  <option>Retorno/Reavaliação</option>
                  <option>Entrevista Familiar</option>
                </select>
                <ArrowRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Data</label>
              <div className="relative">
                <CalendarIcon size={18} className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none left-3 md:left-auto md:right-3" />
                <input
                  required
                  type="date"
                  className="w-full h-12 pl-10 pr-4 md:pl-4 md:pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-700 bg-white text-base appearance-none"
                  value={novaSessao.data}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNovaSessao({ ...novaSessao, data: e.target.value })}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Status da Sessão</label>
              
              {/* --- AQUI ESTAVA O PROBLEMA: CORRIGIDO PARA ENVIAR ENUM DO JAVA --- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "REALIZADO", label: "Realizado", icon: CheckCircle },
                  { id: "FALTOU", label: "Faltou", icon: XCircle },
                  { id: "AGENDADO", label: "Remarcada", icon: Clock }, // Remarcada envia AGENDADO
                  { id: "CANCELADO_PACIENTE", label: "Cancelada", icon: XCircle } // Cancelada envia CANCELADO_PACIENTE
                ].map((item) => {
                    const isSelected = novaSessao.status === item.id;
                    const IconComp = item.icon;
                    
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setNovaSessao({ ...novaSessao, status: item.id as StatusSessao })}
                        className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 border min-h-[48px] active:scale-95
                        ${isSelected ? getStatusClasses(item.id, true) : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"}`}
                      >
                        <IconComp size={18} />
                        <span className="text-xs font-bold capitalize">{item.label}</span>
                      </button>
                    );
                  }
                )}
              </div>

            </div>

            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700 mb-1.5">Evolução / Anotações</label>
              <textarea
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-40 resize-none text-base leading-relaxed transition-all shadow-sm appearance-none"
                placeholder="Detalhes da sessão..."
                value={novaSessao.evolucao}
                onChange={(e) => setNovaSessao({ ...novaSessao, evolucao: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="pt-2 flex flex-col-reverse md:flex-row gap-3">
            <button type="button" onClick={() => setIsNewSessaoModalOpen(false)} className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-green-700 shadow-md">Salvar Evolução</button>
          </div>
        </form>
      </Modal>
    </>
  );
}