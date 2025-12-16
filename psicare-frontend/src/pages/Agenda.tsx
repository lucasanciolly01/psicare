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
  Loader2, // Importado para indicadores de loading (Saving/Deleting)
  DollarSign, // Adicionado para compatibilidade com o formulário API
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useCalendar } from "../hooks/useCalendar";
import { Modal } from "../components/ui/Modal";

// MUDANÇA: Agora usa o contexto assíncrono e os tipos da API
import { useAgendamentos } from "../context/AgendamentosContext";
import type { CalendarEvent, DadosCadastroAgendamento } from '../types/agendamento'; 

import { usePacientes } from "../context/PacientesContext";
// REMOVIDO: import { verificarConflito } from "../utils/agendamento"; // Já que a validação é feita na API
import { AxiosError } from "axios"; // Importado para verificar erros de API

// Tipos para o estado do formulário (incluindo valorCobrado e tipoSessao)
interface NovoAgendamentoState {
  pacienteId: string;
  horario: string; 
  tipoSessao: string; // Mapeado do Enum Java TipoSessao
  valorCobrado: number | string; // Permitir string para input
}

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

  // MUDANÇA: Desestruturação para usar as funções e estado assíncronos
  const { 
    agendamentos, 
    cadastrarAgendamento, 
    removerAgendamento, 
    isLoading // Estado de loading da busca na API
  } = useAgendamentos(); 
  
  const { pacientes } = usePacientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ADICIONADO: Estado de salvamento
  const [isDeleting, setIsDeleting] = useState(false); // ADICIONADO: Estado de deleção
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState<
    string | null
  >(null);
  const [erroConflito, setErroConflito] = useState<string | null>(null);

  // MUDANÇA: Novo estado com todas as propriedades da API
  const [novoAgendamento, setNovoAgendamento] = useState<NovoAgendamentoState>({
    pacienteId: "",
    horario: "", 
    tipoSessao: "PSICOTERAPIA_INDIVIDUAL", // Padrão
    valorCobrado: "",
  });

  const pacientesAtivos = pacientes.filter((p) => p.status === "ATIVO");

  // MUDANÇA: Função assíncrona para salvar
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroConflito(null);

    const { pacienteId, horario, tipoSessao, valorCobrado } = novoAgendamento;

    // 1. Validação local de campos (agora incluindo tipo e valor)
    if (!pacienteId || !horario || !tipoSessao || valorCobrado === "" || isNaN(Number(valorCobrado))) {
        setErroConflito("Preencha todos os campos corretamente.");
        return;
    }

    const valorNumerico = Number(valorCobrado);
    
    // 2. Formatação de data/hora para ISO (Backend Java)
    const dataSelecionadaStr = format(selectedDate, "yyyy-MM-dd");
    const dataHoraISO = `${dataSelecionadaStr}T${horario}:00`;

    // 3. Validação de data no passado
    if (new Date(dataHoraISO) < new Date()) {
      setErroConflito("Não é possível agendar para o passado.");
      return;
    }

    setIsSaving(true);
    
    try {
        const dadosParaApi: DadosCadastroAgendamento = {
            pacienteId,
            dataHora: dataHoraISO, 
            tipoSessao,
            valorCobrado: valorNumerico, 
        };

        const resultado = await cadastrarAgendamento(dadosParaApi);
        
        if (resultado) {
            // Sucesso: Fecha modal e reseta formulário
            setIsModalOpen(false);
            setNovoAgendamento({
                pacienteId: "",
                horario: "",
                tipoSessao: "PSICOTERAPIA_INDIVIDUAL",
                valorCobrado: "",
            });
        }
    } catch (error: unknown) { 
        console.error("Erro ao agendar:", error);

        // O Context já exibe um Toast, mas podemos pegar o erro específico para o modal
        let displayError = "Ocorreu um erro desconhecido ao agendar.";
        if (error instanceof AxiosError && error.response?.data?.message) {
            displayError = error.response.data.message;
        }

        setErroConflito(displayError);

    } finally {
        setIsSaving(false);
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setErroConflito(null);
    // MUDANÇA: Reseta o estado completo
    setNovoAgendamento({
        pacienteId: "",
        horario: "", 
        tipoSessao: "PSICOTERAPIA_INDIVIDUAL",
        valorCobrado: "",
    });
  };

  // MUDANÇA: Função assíncrona para remoção
  const confirmarExclusao = async () => {
    if (!agendamentoParaExcluir) return;

    setIsDeleting(true);
    try {
        await removerAgendamento(agendamentoParaExcluir);
        setAgendamentoParaExcluir(null); // Fecha o modal de exclusão
    } catch {
        // O Toast de erro já é tratado no Context
    } finally {
        setIsDeleting(false);
    }
  };

  // MUDANÇA: Filtra usando propriedades CalendarEvent (data está em 'start')
  const agendamentosDoDia = agendamentos
    .filter((a: CalendarEvent) => a.start.toString().split("T")[0] === selectedDate.toISOString().split("T")[0])
    .sort((a, b) => a.start.toString().localeCompare(b.start.toString())); // Ordena por hora

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
        {/* --- CALENDÁRIO --- */}
        <div className="flex-1 bg-surface rounded-2xl shadow-card border border-secondary-100/60 flex flex-col h-[500px] lg:h-auto min-h-[450px] overflow-hidden">
          
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
              
              // MUDANÇA: Usa a.start para verificar se há agendamentos
              const temAgendamento = agendamentos.some(
                (a: CalendarEvent) => a.start.toString().split("T")[0] === day.toISOString().split("T")[0]
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
              onClick={() => {
                setIsModalOpen(true);
                // Pré-preenche o horário
                if (isToday(selectedDate) && !novoAgendamento.horario) {
                    const now = new Date();
                    const nextHalfHour = new Date(now.getTime() + 30 * 60000);
                    const hours = nextHalfHour.getHours().toString().padStart(2, '0');
                    const minutes = (Math.round(nextHalfHour.getMinutes() / 30) * 30) % 60;
                    setNovoAgendamento(prev => ({...prev, horario: `${hours}:${minutes.toString().padStart(2, '0')}`}));
                }
              }}
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center transition-all active:scale-95"
              disabled={isSaving || isLoading}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* MUDANÇA: Indicador de Carregamento Geral */}
          {(isLoading || isSaving) && (
             <div className="flex items-center justify-center text-primary-500 p-4">
                <Loader2 className="animate-spin mr-2" size={20} />
                {isSaving ? 'Agendando...' : 'Carregando...'}
            </div>
          )}

          <div className="flex-1 lg:overflow-y-auto p-5 space-y-3 custom-scrollbar bg-white">
            {agendamentosDoDia.length === 0 && !isLoading ? (
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
              agendamentosDoDia.map((agendamento: CalendarEvent) => {
                // MUDANÇA: Extrai a hora de 'start'
                const horaFormatada = agendamento.start.toString().split("T")[1]?.substring(0, 5) || agendamento.start.toString().substring(11, 16);

                return (
                  <div
                    key={agendamento.id}
                    className="group relative flex gap-4 p-4 rounded-xl border border-secondary-100 hover:border-primary-200 hover:shadow-soft bg-white transition-all duration-300"
                  >
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col items-center justify-center min-w-[3.5rem] border-r border-secondary-100 pr-4 pl-1">
                      <span className="text-lg font-bold text-secondary-900 tracking-tight">
                        {horaFormatada}
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
                        {agendamento.tipoSessao.replace(/_/g, ' ')} {/* MUDANÇA: Usando tipoSessao */}
                      </span>
                      <span className="text-xs text-secondary-500 font-medium truncate mt-0.5">
                        R$ {agendamento.valorCobrado ? agendamento.valorCobrado.toFixed(2).replace('.', ',') : '0,00'} {/* MUDANÇA: Usando valorCobrado */}
                      </span>
                    </div>

                    <button
                      onClick={() => setAgendamentoParaExcluir(agendamento.id)}
                      className="self-center text-secondary-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Cancelar agendamento"
                      disabled={isDeleting} // Desabilita durante a exclusão
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
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
            
            {/* Info Box (igual) */}
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex flex-wrap items-center gap-3">
                 <CalendarIcon size={20} className="text-primary-600 shrink-0" />
                 <span className="text-sm font-medium text-primary-700">
                    Agendando para:{" "}
                    <span className="font-bold">
                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </span>
                </span>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Horário (igual) */}
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
                      value={novoAgendamento.horario}
                      onChange={(e) => {
                        setNovoAgendamento({
                          ...novoAgendamento,
                          horario: e.target.value,
                        });
                        if (erroConflito) setErroConflito(null);
                      }}
                    />
                  </div>
                </div>

                {/* NOVO: Valor Cobrado */}
                <div>
                  <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">
                    Valor (R$)
                  </label>
                  <div className="relative group">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors pointer-events-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ex: 150.00"
                      className={`w-full pl-10 pr-3 h-12 border rounded-xl focus:ring-4 outline-none transition-all font-medium ${
                        erroConflito
                          ? "border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50"
                          : "border-secondary-200 focus:ring-primary-500/10 focus:border-primary-500 bg-white"
                      }`}
                      value={novoAgendamento.valorCobrado}
                      onChange={(e) => setNovoAgendamento({ ...novoAgendamento, valorCobrado: e.target.value })}
                    />
                  </div>
                </div>

                {/* NOVO: Tipo de Sessão */}
                <div>
                 <label className="block text-sm font-bold text-secondary-700 mb-1.5 ml-1">Tipo</label>
                 <div className="relative group">
                   <AlignLeft size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                   <select
                      required
                      className="w-full pl-10 pr-8 h-12 border border-secondary-200 rounded-xl outline-none bg-white appearance-none font-medium text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                      value={novoAgendamento.tipoSessao}
                      onChange={(e) => setNovoAgendamento({...novoAgendamento, tipoSessao: e.target.value})}
                    >
                      {/* Mapeando os Enums de TipoSessao do Java */}
                      <option value="PSICOTERAPIA_INDIVIDUAL">Terapia Individual</option>
                      <option value="PRIMEIRA_CONSULTA">Primeira Consulta</option>
                      <option value="PSICOTERAPIA_CASAL">Terapia de Casal</option>
                      <option value="ANAMNESE_INICIAL">Anamnese Inicial</option>
                   </select>
                   <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                 </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse md:flex-row gap-3 border-t border-secondary-100 mt-2">
              <button
                type="button"
                onClick={fecharModal}
                className="flex-1 py-3.5 border border-secondary-200 text-secondary-700 rounded-xl font-bold hover:bg-secondary-50 transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:shadow-none"
                disabled={isSaving}
              >
                {isSaving && <Loader2 size={20} className="animate-spin" />}
                {isSaving ? 'Agendando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </Modal>

        {/* --- MODAL EXCLUSÃO --- */}
        <Modal
          isOpen={!!agendamentoParaExcluir}
          onClose={() => setAgendamentoParaExcluir(null)}
          title="Cancelar Agendamento"
          size="sm"
        >
          <div className="text-center pt-2">
            <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 ring-8 ring-rose-50/50">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">
              Tem certeza?
            </h3>
            <p className="text-secondary-500 mb-8 text-sm leading-relaxed">
              Isso irá cancelar o agendamento no sistema. <br /> A ação pode ser desfeita na ficha do paciente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAgendamentoParaExcluir(null)}
                className="flex-1 py-3 border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 transition-colors disabled:opacity-60"
                disabled={isDeleting}
              >
                Voltar
              </button>
              <button
                onClick={confirmarExclusao}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 size={20} className="animate-spin" />}
                {isDeleting ? 'Cancelando...' : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}