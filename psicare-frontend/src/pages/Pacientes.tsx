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
  Calendar as CalendarIcon,
} from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { usePacientes, type Paciente } from "../context/PacientesContext";
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
    status: "ativo" as Paciente["status"],
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

  // ... (Mantenha os useEffects e handlers originais aqui sem alteração) ...
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
          status: "ativo",
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
  // ... (Fim dos handlers) ...

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const matchNome = paciente.nome
      .toLowerCase()
      .includes(termoBusca.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" || paciente.status === filtroStatus;
    return matchNome && matchStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1.5 border
      ${
        status === "ativo"
          ? "bg-green-50 text-green-700 border-green-100"
          : status === "pausa"
          ? "bg-yellow-50 text-yellow-700 border-yellow-100"
          : "bg-gray-50 text-gray-600 border-gray-100"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "ativo"
            ? "bg-green-500"
            : status === "pausa"
            ? "bg-yellow-500"
            : "bg-gray-400"
        }`}
      ></span>
      {status === "ativo"
        ? "Acompanhamento"
        : status === "pausa"
        ? "Pausado"
        : "Inativo"}
    </span>
  );

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
          <p className="text-gray-500 text-sm">
            Gerencie seus pacientes e prontuários
          </p>
        </div>

        <button
          onClick={() => setIsCadastroOpen(true)}
          className="w-full md:w-auto bg-primary hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Novo Paciente
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-10 pr-4 py-3 md:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-auto border border-gray-200 rounded-lg px-4 py-3 md:py-2 outline-none focus:ring-2 focus:ring-primary/20 bg-white min-w-[150px] text-base"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="pausa">Em Pausa</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* === VISÃO MOBILE (Cards) - OTIMIZADA E ROBUSTA === */}
        <div className="block md:hidden divide-y divide-gray-100">
          {pacientesFiltrados.map((paciente) => (
            <div key={paciente.id} className="p-4 flex flex-col gap-4">
              
              {/* LINHA SUPERIOR: Identidade e Ações */}
              <div className="flex items-start justify-between gap-3">
                {/* Esquerda: Avatar e Textos */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-primary flex-shrink-0 flex items-center justify-center font-bold text-lg border border-green-200">
                    {paciente.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate leading-tight">
                      {paciente.nome}
                    </h3>
                    <div className="mt-1">
                        <StatusBadge status={paciente.status} />
                    </div>
                  </div>
                </div>

                {/* Direita: Ações (shrink-0 impede que botões sejam esmagados) */}
                <div className="flex gap-1 shrink-0 ml-1">
                  <button
                    onClick={() => setPacienteVisualizar(paciente)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-primary bg-white hover:bg-green-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => setPacienteEmEdicao(paciente.id)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-blue-500 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setPacienteParaDeletar(paciente.id)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* LINHA INFERIOR: Informações de Contato (Grid) */}
              <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                    <Phone size={13} />
                  </div>
                  <span className="font-medium">{paciente.telefone}</span>
                </div>

                {paciente.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                      <Mail size={13} />
                    </div>
                    <span className="truncate max-w-[220px]">{paciente.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm text-gray-700 border-t border-gray-100 pt-2.5 mt-1">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                    <FileText size={13} />
                  </div>
                  <span className={`${paciente.queixaPrincipal ? "text-green-600 font-medium" : "text-gray-500"}`}>
                    {paciente.queixaPrincipal
                      ? "Prontuário Iniciado"
                      : "Aguardando Prontuário"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === VISÃO DESKTOP (Tabela Original - MANTIDA) === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pacientesFiltrados.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-primary flex items-center justify-center font-bold text-sm">
                        {paciente.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {paciente.nome}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {paciente.queixaPrincipal ? (
                            <FileText size={12} />
                          ) : null}
                          {paciente.queixaPrincipal
                            ? "Prontuário iniciado"
                            : "Sem prontuário"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />{" "}
                        {paciente.telefone}
                      </div>
                      {paciente.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={12} /> {paciente.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={paciente.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPacienteVisualizar(paciente)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"
                        title="Ver Prontuário"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setPacienteEmEdicao(paciente.id)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setPacienteParaDeletar(paciente.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="py-12 text-center text-gray-400 flex flex-col items-center">
            <User size={48} className="opacity-20 mb-3" />
            <p>Nenhum paciente encontrado.</p>
          </div>
        )}
      </div>

      {/* --- MODAL DE CADASTRO (MANTIDO O MESMO) --- */}
      <Modal
        isOpen={isCadastroOpen}
        onClose={fecharModalCadastro}
        title={pacienteEmEdicao ? "Editar Paciente" : "Novo Paciente"}
        size="lg"
      >
        <form onSubmit={handleCadastro} className="space-y-6">
           {/* ... (Conteúdo do formulário mantido igual ao anterior) ... */}
           {/* Para brevidade, replique o conteúdo do form fornecido no código anterior aqui */}
           <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={14} /> Dados Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nome Completo
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
                  placeholder="Ex: João da Silva"
                  value={novoPaciente.nome}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, nome: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Telefone
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                  />
                  <input
                    required
                    type="text"
                    maxLength={15}
                    className="w-full pl-10 pr-4 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
                    placeholder="(00) 00000-0000"
                    value={novoPaciente.telefone}
                    onChange={handleTelefoneChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Data de Nascimento
                </label>
                <div className="relative">
                  <CalendarIcon size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-600 bg-white text-base appearance-none"
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
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-mail (Opcional)
                </label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                    <input
                    type="email"
                    className="w-full pl-10 pr-4 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
                    placeholder="paciente@email.com"
                    value={novoPaciente.email}
                    onChange={(e) =>
                        setNovoPaciente({ ...novoPaciente, email: e.target.value })
                    }
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  className="w-full px-4 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all text-base"
                  value={novoPaciente.status}
                  onChange={(e) =>
                    setNovoPaciente({
                      ...novoPaciente,
                      status: e.target.value as Paciente["status"],
                    })
                  }
                >
                  <option value="ativo">Ativo</option>
                  <option value="pausa">Pausado</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={14} /> Dados do Prontuário
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Queixa Principal
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none text-base transition-all"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Histórico Familiar
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none text-base transition-all"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações Iniciais
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-20 resize-none text-base transition-all"
                    placeholder="Observações gerais..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anotações Privadas
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-20 resize-none text-base transition-all bg-yellow-50/50"
                    placeholder="Anotações administrativas..."
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

          <div className="pt-4 flex flex-col-reverse md:flex-row gap-3 border-t border-gray-50">
            <button
              type="button"
              onClick={fecharModalCadastro}
              className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-all hover:-translate-y-0.5"
            >
              {pacienteEmEdicao ? "Salvar Alterações" : "Cadastrar Paciente"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!pacienteParaDeletar}
        onClose={() => setPacienteParaDeletar(null)}
        title="Excluir Paciente"
      >
        <div className="text-center p-2">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tem certeza?</h3>
          <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
            Essa ação removerá permanentemente o prontuário e histórico deste
            paciente.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setPacienteParaDeletar(null)}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarExclusao}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
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