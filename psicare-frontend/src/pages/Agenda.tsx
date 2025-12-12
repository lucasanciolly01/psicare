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
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Imports internos
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
  const [erroConflito, setErroConflito] = useState<string | null>(null);

  const [novoAgendamento, setNovoAgendamento] = useState({
    pacienteId: "",
    hora: "",
    tipo: "Terapia Individual",
  });

  const pacientesAtivos = pacientes.filter((p) => p.status === "ativo");

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setErroConflito(null);

    if (!novoAgendamento.pacienteId || !novoAgendamento.hora) return;

    // Validação de horário passado e conflitos (mantida a lógica original)
    const [horasInput, minutosInput] = novoAgendamento.hora
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

    if (
      verificarConflito(agendamentos, dataSelecionadaStr, novoAgendamento.hora)
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
        hora: novoAgendamento.hora,
        pacienteNome: pacienteSelecionado.nome,
        tipo: novoAgendamento.tipo,
      });

      addToast({
        type: "success",
        title: "Agendamento Confirmado",
        description: `${pacienteSelecionado.nome} agendado para ${novoAgendamento.hora}`,
      });
    }

    setIsModalOpen(false);
    setNovoAgendamento({
      pacienteId: "",
      hora: "",
      tipo: "Terapia Individual",
    });
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setErroConflito(null);
  };

  const agendamentosDoDia = agendamentos
    .filter((a) => a.data === selectedDate.toISOString().split("T")[0])
    .sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
          <p className="text-gray-500 text-sm">
            Organize suas sessões e compromissos
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-180px)]">
        {/* --- CALENDÁRIO --- */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px] lg:h-auto min-h-[420px]">
          {/* Header Calendário */}
          <div className="p-4 md:p-5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base md:text-lg font-bold text-gray-800 capitalize flex items-center gap-2">
              <CalendarIcon size={20} className="text-primary" />
              {formatMonthYear()}
            </h2>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToToday}
                className="text-xs font-bold text-gray-600 hover:bg-white hover:shadow-sm px-3 py-1.5 rounded-md uppercase tracking-wide"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cabeçalho dias da semana */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
            {days.slice(0, 7).map((day) => (
              <div
                key={day.toString()}
                className="py-3 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                {formatWeekDay(day).substring(0, 3)}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 grid-rows-6 flex-1">
            {days.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);
              const temAgendamento = agendamentos.some(
                (a) => a.data === day.toISOString().split("T")[0]
              );

              return (
                <div
                  key={day.toString()}
                  onClick={() => {
                    setSelectedDate(day);
                    // LÓGICA NOVA: Redirecionar se clicar fora do mês atual
                    if (!isCurrentMonth) {
                      if (day < currentDate) {
                        prevMonth();
                      } else {
                        nextMonth();
                      }
                    }
                  }}
                  className={`
                      relative border-b border-r border-gray-50 p-1 cursor-pointer transition-all duration-200
                      flex flex-col items-center justify-center
                      ${
                        !isCurrentMonth
                          ? "bg-gray-50/30 text-gray-300 opacity-30" // LÓGICA NOVA: Adicionado opacity-30
                          : "bg-white active:bg-green-50"
                      }
                      ${
                        isSelected
                          ? "!bg-green-50 ring-2 ring-inset ring-primary z-10"
                          : ""
                      }
                    `}
                >
                  <span
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-xs md:text-sm font-medium transition-all
                      ${
                        isDayToday && !isSelected
                          ? "bg-gray-900 text-white shadow-md"
                          : ""
                      }
                      ${
                        isSelected
                          ? "text-primary font-bold text-base md:text-lg scale-110"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {temAgendamento && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm mt-1"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- LISTA DE AGENDAMENTOS --- */}
        <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-auto lg:h-full min-h-[300px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Agendamentos
              </h3>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 bg-primary text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center transition-all active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex-1 lg:overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {agendamentosDoDia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center p-8 border-2 border-dashed border-gray-100 rounded-xl m-2">
                <Clock size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium text-gray-400">
                  Nenhum agendamento
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-primary text-xs font-bold hover:underline uppercase tracking-wide"
                >
                  + Adicionar horário
                </button>
              </div>
            ) : (
              agendamentosDoDia.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="group relative flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md bg-white transition-all duration-300 cursor-default"
                >
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center justify-center min-w-[3.5rem] border-r border-gray-100 pr-4 pl-2">
                    <span className="text-lg font-bold text-gray-800 tracking-tight">
                      {agendamento.hora}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">
                      Horário
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
                      {agendamento.pacienteNome}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium border border-gray-200 truncate">
                        {agendamento.tipo}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removerAgendamento(agendamento.id);
                      addToast({ type: "info", title: "Agendamento removido" });
                    }}
                    className="self-start text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Cancelar agendamento"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- MODAL RESPONSIVO UNIVERSAL --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={fecharModal}
          title="Novo Agendamento"
          size="md"
        >
          <form onSubmit={handleSaveAppointment} className="space-y-6">
            {/* Card de Data */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-wrap items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                <CalendarIcon size={20} />
              </div>
              <div className="flex-1 min-w-[150px]">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  Data Selecionada
                </p>
                <p className="text-sm font-medium text-gray-700 capitalize truncate">
                  {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            {/* ALERTA DE ERRO */}
            {erroConflito && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm animate-fade-in shadow-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="font-medium">{erroConflito}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Paciente
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <select
                    required
                    className="w-full pl-10 pr-10 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white appearance-none text-gray-800 text-base"
                    value={novoAgendamento.pacienteId}
                    onChange={(e) =>
                      setNovoAgendamento({
                        ...novoAgendamento,
                        pacienteId: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecione um paciente...</option>
                    {pacientesAtivos.length > 0 ? (
                      pacientesAtivos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))
                    ) : (
                      <option disabled>Nenhum paciente ativo cadastrado</option>
                    )}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Horário
                  </label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="time"
                      required
                      className={`w-full pl-10 pr-3 h-12 border rounded-xl focus:ring-2 outline-none transition-all text-base bg-white text-gray-900 appearance-none ${
                        erroConflito
                          ? "border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-primary/20 focus:border-primary"
                      }`}
                      value={novoAgendamento.hora}
                      onChange={(e) => {
                        setNovoAgendamento({
                          ...novoAgendamento,
                          hora: e.target.value,
                        });
                        if (erroConflito) setErroConflito(null);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Tipo de Sessão
                  </label>
                  <div className="relative">
                    <AlignLeft
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <select
                      className="w-full pl-10 pr-8 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white appearance-none text-base text-gray-800"
                      value={novoAgendamento.tipo}
                      onChange={(e) =>
                        setNovoAgendamento({
                          ...novoAgendamento,
                          tipo: e.target.value,
                        })
                      }
                    >
                      <option>Terapia Individual</option>
                      <option>Primeira Consulta</option>
                      <option>Acompanhamento</option>
                      <option>Terapia de Casal</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse md:flex-row gap-3 border-t border-gray-50 mt-2">
              <button
                type="button"
                onClick={fecharModal}
                className="w-full md:w-auto flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full md:w-auto flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-all active:scale-95 shadow-green-200"
              >
                Confirmar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}