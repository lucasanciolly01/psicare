import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Edit,
  FileText,
  Eye,
  Filter,
} from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { usePacientes } from "../context/PacientesContext";
import type { Paciente, StatusPaciente } from "../types";
import { PatientDetailsModal } from "../components/pacientes/PatientDetailsModal";

export function Pacientes() {
  const { pacientes, adicionarPaciente, removerPaciente, atualizarPaciente } =
    usePacientes();

  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

  const [pacienteParaDeletar, setPacienteParaDeletar] = useState<string | null>(
    null
  );
  const [pacienteEmEdicao, setPacienteEmEdicao] = useState<string | null>(null);
  const [pacienteVisualizar, setPacienteVisualizar] = useState<Paciente | null>(
    null
  );

  const [novoPaciente, setNovoPaciente] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    status: "ATIVO" as StatusPaciente,
    queixaPrincipal: "",
    historicoFamiliar: "",
    observacoesIniciais: "",
    anotacoes: "",
  });

  const mascaraTelefone = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorMascarado = mascaraTelefone(e.target.value);
    setNovoPaciente({ ...novoPaciente, telefone: valorMascarado });
  };

  useEffect(() => {
    if (pacienteEmEdicao) {
      const paciente = pacientes.find((p) => p.id === pacienteEmEdicao);
      if (paciente) {
        setTimeout(() => {
          setNovoPaciente({
            nome: paciente.nome,
            email: paciente.email || "",
            telefone: paciente.telefone,
            dataNascimento: paciente.dataNascimento || "",
            status: paciente.status,
            queixaPrincipal: paciente.queixaPrincipal || "",
            historicoFamiliar: paciente.historicoFamiliar || "",
            observacoesIniciais: paciente.observacoesIniciais || "",
            anotacoes: paciente.anotacoes || "",
          });
          setIsCadastroOpen(true);
        }, 0);
      }
    } else {
      setTimeout(() => {
        setNovoPaciente({
          nome: "",
          email: "",
          telefone: "",
          dataNascimento: "",
          status: "ATIVO",
          queixaPrincipal: "",
          historicoFamiliar: "",
          observacoesIniciais: "",
          anotacoes: "",
        });
      }, 0);
    }
  }, [pacienteEmEdicao, pacientes]);

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    if (pacienteEmEdicao) {
      atualizarPaciente(pacienteEmEdicao, novoPaciente);
      setPacienteEmEdicao(null);
    } else {
      adicionarPaciente(novoPaciente);
    }
    setIsCadastroOpen(false);
  };

  const fecharModalCadastro = () => {
    setIsCadastroOpen(false);
    setPacienteEmEdicao(null);
  };

  const confirmarExclusao = () => {
    if (pacienteParaDeletar) {
      removerPaciente(pacienteParaDeletar);
      setPacienteParaDeletar(null);
    }
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const matchNome = paciente.nome
      .toLowerCase()
      .includes(termoBusca.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" || paciente.status === filtroStatus;
    return matchNome && matchStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const s = status ? status.toUpperCase() : "ATIVO";
    const classes =
      s === "ATIVO"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10"
        : s === "PAUSA"
        ? "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10"
        : "bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/10";

    const dotClass =
      s === "ATIVO"
        ? "bg-emerald-500"
        : s === "PAUSA"
        ? "bg-amber-500"
        : "bg-slate-400";
    const label =
      s === "ATIVO" ? "Acompanhamento" : s === "PAUSA" ? "Pausado" : "Inativo";

    return (
      <span
        className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border ring-1 ring-inset ${classes}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">
            Pacientes
          </h1>
          <p className="text-secondary-500 text-sm font-medium">
            Central de prontuários e dados cadastrais.
          </p>
        </div>

        <button
          onClick={() => setIsCadastroOpen(true)}
          className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95 text-sm"
        >
          <Plus size={18} strokeWidth={2.5} /> Novo Paciente
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-surface p-2 rounded-2xl shadow-sm border border-secondary-100/60 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-11 pr-4 py-3 bg-secondary-50/50 border border-transparent rounded-xl focus:bg-white focus:border-secondary-200 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-secondary-900"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        <div className="relative group min-w-[200px]">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors pointer-events-none"
            size={18}
          />
          <select
            className="w-full pl-11 pr-8 py-3 bg-secondary-50/50 border border-transparent rounded-xl focus:bg-white focus:border-secondary-200 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-secondary-700 appearance-none cursor-pointer"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os Status</option>
            <option value="ATIVO">Ativos</option>
            <option value="PAUSA">Em Pausa</option>
            <option value="INATIVO">Inativos</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
        {/* === VISÃO MOBILE (Cards) === */}
        <div className="block md:hidden divide-y divide-secondary-100">
          {pacientesFiltrados.map((paciente) => (
            <div
              key={paciente.id}
              className="p-5 flex flex-col gap-4 active:bg-secondary-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex-shrink-0 flex items-center justify-center font-bold text-lg border border-white shadow-sm">
                    {paciente.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-secondary-900 text-base truncate leading-tight">
                      {paciente.nome}
                    </h3>
                    <div className="mt-1.5">
                      <StatusBadge status={paciente.status} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0 ml-1">
                  {/* Botões de Ação Mobile */}
                  <button
                    onClick={() => setPacienteVisualizar(paciente)}
                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => setPacienteEmEdicao(paciente.id)}
                    className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                </div>
              </div>

              {/* Infos Mobile */}
              <div className="bg-secondary-50/50 p-4 rounded-xl border border-secondary-100/50 space-y-3">
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <Phone size={14} className="text-secondary-400" />
                  <span className="font-medium">{paciente.telefone}</span>
                </div>
                {paciente.email && (
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <Mail size={14} className="text-secondary-400" />
                    <span className="truncate">{paciente.email}</span>
                  </div>
                )}
                <div className="border-t border-secondary-200/50 pt-2 mt-1">
                  <p className="text-xs text-secondary-500 font-medium flex items-center gap-2">
                    <FileText size={14} />
                    {paciente.queixaPrincipal
                      ? "Prontuário Ativo"
                      : "Sem prontuário inicial"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === VISÃO DESKTOP (Tabela) === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-50/50 border-b border-secondary-100 text-xs uppercase text-secondary-500 font-bold tracking-wider">
                <th className="px-6 py-4 pl-8">Paciente</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right pr-8">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-50">
              {pacientesFiltrados.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-secondary-50/60 transition-colors group"
                >
                  <td className="px-6 py-4 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-sm">
                        {paciente.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-secondary-900">
                          {paciente.nome}
                        </p>
                        <p className="text-xs text-secondary-400 font-medium flex items-center gap-1 mt-0.5">
                          {paciente.queixaPrincipal ? (
                            <>
                              <FileText
                                size={12}
                                className="text-primary-500"
                              />{" "}
                              Prontuário ativo
                            </>
                          ) : (
                            "Cadastro simples"
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 text-sm">
                      <div className="flex items-center gap-2 text-secondary-700 font-medium">
                        <Phone size={14} className="text-secondary-400" />{" "}
                        {paciente.telefone}
                      </div>
                      {paciente.email && (
                        <div className="flex items-center gap-2 text-xs text-secondary-500">
                          <Mail size={12} className="text-secondary-300" />{" "}
                          {paciente.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={paciente.status} />
                  </td>
                  <td className="px-6 py-4 text-right pr-8">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => setPacienteVisualizar(paciente)}
                        className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Ver Prontuário"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setPacienteEmEdicao(paciente.id)}
                        className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setPacienteParaDeletar(paciente.id)}
                        className="p-2 text-secondary-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pacientesFiltrados.length === 0 && (
          <div className="py-16 text-center text-secondary-400 flex flex-col items-center">
            <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="opacity-40" />
            </div>
            <p className="font-medium">Nenhum paciente encontrado.</p>
            <p className="text-sm mt-1 opacity-70">
              Tente buscar por outro termo.
            </p>
          </div>
        )}
      </div>

      {/* === MODAL CADASTRO === */}
      <Modal
        isOpen={isCadastroOpen}
        onClose={fecharModalCadastro}
        title={pacienteEmEdicao ? "Editar Paciente" : "Novo Paciente"}
        size="lg"
      >
        <form onSubmit={handleCadastro} className="space-y-8">
          {/* Seção Pessoal */}
          <div>
            <h4 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-secondary-100 pb-2">
              <User size={14} /> Informações Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                  Nome Completo
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 h-12 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900"
                  placeholder="Ex: João da Silva"
                  value={novoPaciente.nome}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, nome: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                  Telefone
                </label>
                <input
                  required
                  type="text"
                  maxLength={15}
                  className="w-full px-4 h-12 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900"
                  placeholder="(00) 00000-0000"
                  value={novoPaciente.telefone}
                  onChange={handleTelefoneChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  className="w-full px-4 h-12 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-secondary-900 font-medium"
                  value={novoPaciente.dataNascimento}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNovoPaciente({
                      ...novoPaciente,
                      dataNascimento: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                  E-mail{" "}
                  <span className="text-secondary-400 font-normal ml-1">
                    (Opcional)
                  </span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 h-12 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900"
                  placeholder="paciente@email.com"
                  value={novoPaciente.email}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                  Status do Acompanhamento
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 h-12 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none bg-white transition-all font-medium text-secondary-900 appearance-none"
                    value={novoPaciente.status}
                    onChange={(e) =>
                      setNovoPaciente({
                        ...novoPaciente,
                        status: e.target.value as StatusPaciente,
                      })
                    }
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="PAUSA">Pausado</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                  {/* Seta customizada */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Prontuário */}
          <div>
            <h4 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-secondary-100 pb-2">
              <FileText size={14} /> Dados do Prontuário Inicial
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                    Queixa Principal
                  </label>
                  <textarea
                    className="w-full p-4 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none h-24 resize-none text-sm transition-all"
                    placeholder="Motivo da consulta..."
                    value={novoPaciente.queixaPrincipal}
                    onChange={(e) =>
                      setNovoPaciente({
                        ...novoPaciente,
                        queixaPrincipal: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                    Histórico Familiar
                  </label>
                  <textarea
                    className="w-full p-4 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none h-24 resize-none text-sm transition-all"
                    placeholder="Histórico relevante..."
                    value={novoPaciente.historicoFamiliar}
                    onChange={(e) =>
                      setNovoPaciente({
                        ...novoPaciente,
                        historicoFamiliar: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                    Observações Gerais
                  </label>
                  <textarea
                    className="w-full p-4 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none h-24 resize-none text-sm transition-all"
                    placeholder="Observações..."
                    value={novoPaciente.observacoesIniciais}
                    onChange={(e) =>
                      setNovoPaciente({
                        ...novoPaciente,
                        observacoesIniciais: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm font-bold text-amber-700 mb-1.5 ml-1 flex items-center gap-1">
                    Anotações Privadas <AlertTriangle size={12} />
                  </label>
                  <textarea
                    className="w-full p-4 border border-amber-200 bg-amber-50/50 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none h-24 resize-none text-sm transition-all placeholder:text-amber-700/50 text-amber-900"
                    placeholder="Visível apenas para você..."
                    value={novoPaciente.anotacoes}
                    onChange={(e) =>
                      setNovoPaciente({
                        ...novoPaciente,
                        anotacoes: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col-reverse md:flex-row gap-3 border-t border-secondary-100">
            <button
              type="button"
              onClick={fecharModalCadastro}
              className="flex-1 py-3.5 border border-secondary-200 text-secondary-700 rounded-xl font-bold hover:bg-secondary-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
            >
              {pacienteEmEdicao ? "Salvar Alterações" : "Cadastrar Paciente"}
            </button>
          </div>
        </form>
      </Modal>

      {/* === MODAL EXCLUSÃO === */}
      <Modal
        isOpen={!!pacienteParaDeletar}
        onClose={() => setPacienteParaDeletar(null)}
        title="Excluir Paciente"
        size="sm"
      >
        <div className="text-center pt-2">
          <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 ring-8 ring-rose-50/50">
            <Trash2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-secondary-900 mb-2">
            Excluir prontuário?
          </h3>
          <p className="text-secondary-500 mb-8 text-sm max-w-xs mx-auto leading-relaxed">
            Todos os dados, histórico e agendamentos deste paciente serão
            apagados permanentemente.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setPacienteParaDeletar(null)}
              className="flex-1 py-3 border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarExclusao}
              className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-colors"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      </Modal>

      <PatientDetailsModal
        isOpen={!!pacienteVisualizar}
        onClose={() => setPacienteVisualizar(null)}
        paciente={pacienteVisualizar}
      />
    </div>
  );
}
