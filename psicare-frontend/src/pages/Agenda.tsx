import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Calendar as CalendarIcon,
  User,
  AlignLeft,
  Trash2,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useCalendar } from "../hooks/useCalendar";
import { Modal } from "../components/ui/Modal";
import { useAgendamentos } from "../context/AgendamentosContext";
import { usePacientes } from "../context/PacientesContext";
import { useToast } from "../context/ToastContext";
import { verificarConflito } from "../utils/agendamento";

export function Agenda() {
  const {
    days,
    currentDate,
    selectedDate,
    setSelectedDate,
    nextMonth,
    prevMonth,
    goToToday,
    formatMonthYear,
    formatWeekDay,
    isSameMonth,
    isSameDay,
    isToday,
  } = useCalendar();

  const { agendamentos, adicionarAgendamento, removerAgendamento } =
    useAgendamentos();
  const { pacientes } = usePacientes();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState<
    string | null
  >(null);
  const [erroConflito, setErroConflito] = useState<string | null>(null);

  // CORREÇÃO: Estado inicial usa 'horario'
  const [novoAgendamento, setNovoAgendamento] = useState({
    pacienteId: "",
    horario: "", // <--- MUDADO
    tipo: "Terapia Individual",
  });

  const pacientesAtivos = pacientes.filter((p) => p.status === "ATIVO");

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setErroConflito(null);

    // CORREÇÃO: Verifica .horario
    if (!novoAgendamento.pacienteId || !novoAgendamento.horario) return;

    // CORREÇÃO: Usa .horario no split
    const [horasInput, minutosInput] = novoAgendamento.horario
      .split(":")
      .map(Number);
    const dataAgendamento = new Date(selectedDate);
    dataAgendamento.setHours(horasInput, minutosInput, 0, 0);

    const agora = new Date();
    if (dataAgendamento < agora) {
      setErroConflito("Não é possível agendar para o passado.");
      return;
    }

    const dataSelecionadaStr = selectedDate.toISOString().split("T")[0];

    // CORREÇÃO: Passa .horario para verificarConflito
    if (
      verificarConflito(agendamentos, dataSelecionadaStr, novoAgendamento.horario)
    ) {
      setErroConflito(
        "Conflito! Horário já ocupado (intervalo mínimo de 50min)."
      );
      return;
    }

    const pacienteSelecionado = pacientes.find(
      (p) => p.id === novoAgendamento.pacienteId
    );

    if (pacienteSelecionado) {
      adicionarAgendamento({
        data: dataSelecionadaStr,
        horario: novoAgendamento.horario, // <--- CORREÇÃO
        pacienteId: pacienteSelecionado.id, // ID Obrigatório
        pacienteNome: pacienteSelecionado.nome,
        tipo: novoAgendamento.tipo,
      });

      addToast({
        type: "success",
        title: "Agendamento Confirmado",
        description: `${pacienteSelecionado.nome} agendado para ${novoAgendamento.horario}`,
      });
    }

    setIsModalOpen(false);
    setNovoAgendamento({
      pacienteId: "",
      horario: "", // <--- RESET
      tipo: "Terapia Individual",
    });
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setErroConflito(null);
  };

  const confirmarExclusao = () => {
    if (agendamentoParaExcluir) {
      removerAgendamento(agendamentoParaExcluir);
      addToast({ type: "info", title: "Agendamento cancelado" });
      setAgendamentoParaExcluir(null);
    }
  };

  const agendamentosDoDia = agendamentos
    .filter((a) => a.data === selectedDate.toISOString().split("T")[0])
    // CORREÇÃO: Sort por .horario
    .sort((a, b) => a.horario.localeCompare(b.horario));

  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-fade-in">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">
            Agenda
          </h1>
          <p className="text-secondary-500 text-sm font-medium">
            Gerencie suas sessões e organize sua semana.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-180px)]">
        {/* --- CALENDÁRIO (CÓDIGO IGUAL AO ANTERIOR, OMITIDO PARA BREVIDADE) --- */}
        <div className="flex-1 bg-surface rounded-2xl shadow-card border border-secondary-100/60 flex flex-col h-[500px] lg:h-auto min-h-[450px] overflow-hidden">
          {/* ... (Mantenha o código do calendário igual) ... */}
          {/* Header Calendário */}
          <div className="p-6 flex items-center justify-between border-b border-secondary-100 flex-shrink-0 bg-secondary-50/30">
            <h2 className="text-lg font-bold text-secondary-900 capitalize flex items-center gap-2.5">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                <CalendarIcon size={20} />
              </div>
              {formatMonthYear()}
            </h2>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-secondary-200 shadow-sm">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-secondary-50 text-secondary-500 hover:text-secondary-900 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToToday}
                className="text-xs font-bold text-secondary-600 hover:bg-secondary-50 px-4 py-2 rounded-lg uppercase tracking-wide transition-colors border-x border-transparent hover:border-secondary-100"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-secondary-50 text-secondary-500 hover:text-secondary-900 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cabeçalho dias da semana */}
          <div className="grid grid-cols-7 border-b border-secondary-100 bg-secondary-50/50 flex-shrink-0">
            {days.slice(0, 7).map((day) => (
              <div
                key={day.toString()}
                className="py-3 text-center text-[11px] font-bold text-secondary-400 uppercase tracking-widest"
              >
                {formatWeekDay(day).substring(0, 3)}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 grid-rows-6 flex-1 h-full bg-white">
            {days.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);
              const temAgendamento = agendamentos.some(
                (a) => a.data === day.toISOString().split("T")[0]
              );

              return (
                <button
                  type="button"
                  key={day.toString()}
                  onClick={() => {
                    setSelectedDate(day);
                    if (!isCurrentMonth) {
                      if (day < currentDate) {
                        prevMonth();
                      } else {
                        nextMonth();
                      }
                    }
                  }}
                  className={`
                      relative border-b border-r border-secondary-100/50 p-1 cursor-pointer transition-all duration-200
                      flex flex-col items-center justify-center h-full w-full group outline-none
                      focus:z-20 focus:ring-2 focus:ring-inset focus:ring-primary-500/50
                      ${
                        !isCurrentMonth
                          ? "bg-secondary-50/30 text-secondary-300"
                          : "hover:bg-primary-50/30"
                      }
                      ${isSelected ? "!bg-primary-50/50 z-10" : ""}
                    `}
                >
                  <span
                    className={`
                      w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all pointer-events-none
                      ${
                        isDayToday && !isSelected
                          ? "bg-secondary-900 text-white shadow-lg"
                          : ""
                      }
                      ${
                        isSelected
                          ? "bg-primary-600 text-white shadow-md shadow-primary-200 scale-105 font-bold"
                          : isCurrentMonth
                          ? "text-secondary-700"
                          : "text-secondary-400 opacity-40"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {temAgendamento && (
                    <span
                      className={`
                      absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors
                      ${isSelected ? "bg-primary-600" : "bg-primary-400"}
                    `}
                    ></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- LISTA LATERAL --- */}
        <div className="w-full lg:w-[400px] bg-surface rounded-2xl shadow-card border border-secondary-100/60 flex flex-col h-auto lg:h-full min-h-[400px]">
          <div className="p-6 border-b border-secondary-100 flex justify-between items-center bg-secondary-50/30">
            <div>
              <h3 className="text-base font-bold text-secondary-900">
                Agenda do Dia
              </h3>
              <p className="text-xs font-medium text-secondary-500 capitalize mt-1">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 lg:overflow-y-auto p-5 space-y-3 custom-scrollbar bg-white">
            {agendamentosDoDia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-secondary-400 text-center p-8 border-2 border-dashed border-secondary-100 rounded-xl bg-secondary-50/30">
                <Clock size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">
                  Nenhum agendamento para este dia.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 text-primary-600 text-xs font-bold hover:underline uppercase tracking-wide"
                >
                  Agendar agora
                </button>
              </div>
            ) : (
              agendamentosDoDia.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="group relative flex gap-4 p-4 rounded-xl border border-secondary-100 hover:border-primary-200 hover:shadow-soft bg-white transition-all duration-300"
                >
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex flex-col items-center justify-center min-w-[3.5rem] border-r border-secondary-100 pr-4 pl-1">
                    <span className="text-lg font-bold text-secondary-900 tracking-tight">
                      {/* CORREÇÃO: exibe .horario */}
                      {agendamento.horario}
                    </span>
                    <span className="text-[10px] text-secondary-400 font-bold uppercase">
                      H
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-secondary-900 truncate group-hover:text-primary-700 transition-colors">
                      {agendamento.pacienteNome}
                    </h4>
                    <span className="text-xs text-secondary-500 font-medium truncate mt-0.5">
                      {agendamento.tipo}
                    </span>
                  </div>

                  <button
                    onClick={() => setAgendamentoParaExcluir(agendamento.id)}
                    className="self-center text-secondary-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Cancelar agendamento"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- MODAL NOVO AGENDAMENTO --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={fecharModal}
          title="Novo Agendamento"
          size="md"
        >
          <form onSubmit={handleSaveAppointment} className="space-y-6">
            {/* ... Info Box (igual) ... */}
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex flex-wrap items-center gap-3">
               {/* ... */}
            </div>

            {erroConflito && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 flex items-start gap-3 text-sm animate-fade-in shadow-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="font-medium">{erroConflito}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Select Paciente (igual) */}
               <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">Paciente</label>
                <div className="relative group">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                  <select
                    required
                    className="w-full pl-10 pr-10 h-12 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all bg-white appearance-none text-secondary-900 font-medium"
                    value={novoAgendamento.pacienteId}
                    onChange={(e) => setNovoAgendamento({ ...novoAgendamento, pacienteId: e.target.value })}
                  >
                    <option value="">Selecione um paciente...</option>
                    {pacientesAtivos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                   <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                </div>
               </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                    Horário
                  </label>
                  <div className="relative group">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors pointer-events-none"
                    />
                    <input
                      type="time"
                      required
                      className={`w-full pl-10 pr-3 h-12 border rounded-xl focus:ring-4 outline-none transition-all font-medium appearance-none ${
                        erroConflito
                          ? "border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50"
                          : "border-secondary-200 focus:ring-primary-500/10 focus:border-primary-500 bg-white"
                      }`}
                      // CORREÇÃO: Input ligado a .horario
                      value={novoAgendamento.horario}
                      onChange={(e) => {
                        setNovoAgendamento({
                          ...novoAgendamento,
                          horario: e.target.value, // <--- MUDADO
                        });
                        if (erroConflito) setErroConflito(null);
                      }}
                    />
                  </div>
                </div>

                {/* Tipo (Igual) */}
                <div>
                 <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">Tipo</label>
                 <div className="relative group">
                   <AlignLeft size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                   <select
                     className="w-full pl-10 pr-8 h-12 border border-secondary-200 rounded-xl outline-none bg-white appearance-none font-medium text-secondary-900"
                     value={novoAgendamento.tipo}
                     onChange={(e) => setNovoAgendamento({...novoAgendamento, tipo: e.target.value})}
                   >
                     <option>Terapia Individual</option>
                     <option>Primeira Consulta</option>
                     {/* ... */}
                   </select>
                 </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse md:flex-row gap-3 border-t border-secondary-100 mt-2">
              <button
                type="button"
                onClick={fecharModal}
                className="flex-1 py-3.5 border border-secondary-200 text-secondary-700 rounded-xl font-bold hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </form>
        </Modal>

        {/* ... Modal Exclusão (igual) ... */}
        <Modal
          isOpen={!!agendamentoParaExcluir}
          onClose={() => setAgendamentoParaExcluir(null)}
          title="Cancelar Agendamento"
          size="sm"
        >
             {/* ... Conteúdo do modal de exclusão ... */}
             <div className="text-center pt-2">
            <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 ring-8 ring-rose-50/50">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">
              Tem certeza?
            </h3>
            <p className="text-secondary-500 mb-8 text-sm leading-relaxed">
              Isso irá remover este agendamento da sua agenda. <br /> Essa ação
              não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAgendamentoParaExcluir(null)}
                className="flex-1 py-3 border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={confirmarExclusao}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}