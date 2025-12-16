// src/pages/Dashboard.tsx
import {
  Users,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { usePacientes } from "../context/PacientesContext";
import { useAgendamentos } from "../context/AgendamentosContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { format, parseISO, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Dashboard() {
  const { usuario } = useAuth();
  const { pacientes } = usePacientes();
  const {
    sessoesHoje,
    sessoesSemana,
    crescimentoSemanal,
    proximosAgendamentos,
  } = useAgendamentos();

  const totalAtivos = pacientes.filter((p) => p.status === "ATIVO").length;
  const pacientesRecentes = pacientes.slice(0, 4);

  return (
    <div className="space-y-8 pb-8">
      {/* Header com Boas-vindas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 bg-surface p-6 sm:p-8 rounded-2xl shadow-card border border-secondary-100/50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 tracking-tight">
            Olá,{" "}
            <span className="text-primary-600">
              {usuario?.nome.split(" ")[0] || "Doutor(a)"}
            </span>
          </h1>
          <p className="text-secondary-500 mt-2 font-medium">
            Aqui está o resumo da sua prática hoje,{" "}
            {format(new Date(), "d 'de' MMMM", { locale: ptBR })}.
          </p>
        </div>
        <Link to="/agenda">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm">
            <Plus size={18} strokeWidth={2.5} /> Novo Agendamento
          </button>
        </Link>
      </div>

      {/* Grid de KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pacientes Ativos"
          value={totalAtivos}
          icon={Users}
          color="blue"
          description="Total na base de dados"
        />

        <StatCard
          title="Sessões Hoje"
          value={sessoesHoje}
          icon={CalendarCheck}
          color="green"
          description="Agendamentos confirmados"
        />

        <StatCard
          title="Sessões na Semana"
          value={sessoesSemana}
          icon={Clock}
          color="purple"
          trendValue={crescimentoSemanal}
          trendLabel="vs. semana anterior"
        />
      </section>

      {/* Área de Conteúdo Dupla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LISTA DE PRÓXIMOS ATENDIMENTOS */}
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-card border border-secondary-100 flex flex-col">
          <div className="p-6 border-b border-secondary-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                <CalendarDays size={20} />
              </div>
              <h3 className="text-lg font-bold text-secondary-900">
                Próximos Atendimentos
              </h3>
            </div>

            <Link
              to="/agenda"
              className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
            >
              Ver agenda
              <ArrowRight
                size={16}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {proximosAgendamentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-secondary-400">
                <CalendarDays size={48} className="mb-3 opacity-20" />
                <p className="font-medium">
                  Sua agenda está livre por enquanto.
                </p>
              </div>
            ) : (
              proximosAgendamentos.map((sessao) => {
                const isSessaoHoje = isToday(parseISO(sessao.data));

                return (
                  <div
                    key={sessao.id}
                    className="group flex items-center justify-between p-4 bg-white rounded-xl border border-secondary-100 hover:border-primary-200 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex items-center gap-5">
                      {/* Box de Horário */}
                      <div
                        className={`
                        flex flex-col items-center justify-center min-w-[64px] h-[64px] rounded-lg border
                        ${
                          isSessaoHoje
                            ? "bg-primary-50 border-primary-100 text-primary-700"
                            : "bg-secondary-50 border-secondary-100 text-secondary-600"
                        }
                      `}
                      >
                        <span className="text-lg font-bold leading-none">
                          {sessao.hora}
                        </span>
                        {!isSessaoHoje && (
                          <span className="text-[10px] uppercase font-bold mt-1 opacity-70">
                            {format(parseISO(sessao.data), "dd MMM", {
                              locale: ptBR,
                            })}
                          </span>
                        )}
                        {isSessaoHoje && (
                          <span className="text-[10px] font-bold mt-1">
                            HOJE
                          </span>
                        )}
                      </div>

                      {/* Dados do Paciente */}
                      <div>
                        <h4 className="font-bold text-secondary-900 text-base group-hover:text-primary-700 transition-colors">
                          {sessao.pacienteNome}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-secondary-500 px-2 py-0.5 bg-secondary-100 rounded-md">
                            {sessao.tipo}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              sessao.status === "concluido"
                                ? "bg-emerald-500"
                                : sessao.status === "cancelado"
                                ? "bg-rose-500"
                                : "bg-blue-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold hidden sm:block border ${
                        sessao.status === "concluido"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : sessao.status === "cancelado"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {sessao.status.charAt(0).toUpperCase() +
                        sessao.status.slice(1)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PACIENTES RECENTES */}
        <div className="bg-surface rounded-2xl shadow-card border border-secondary-100 flex flex-col h-full">
          <div className="p-6 border-b border-secondary-100">
            <h3 className="text-lg font-bold text-secondary-900">
              Pacientes Recentes
            </h3>
          </div>

          <div className="p-4 flex-1">
            <ul className="space-y-2">
              {pacientesRecentes.length === 0 ? (
                <p className="text-secondary-400 text-sm text-center py-8">
                  Nenhum paciente cadastrado.
                </p>
              ) : (
                pacientesRecentes.map((paciente) => (
                  <li
                    key={paciente.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary-50 transition-colors cursor-default"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
                      {paciente.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-secondary-900 truncate">
                        {paciente.nome}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            paciente.status === "ATIVO"
                              ? "bg-emerald-500"
                              : "bg-secondary-400"
                          }`}
                        />
                        <span className="text-xs text-secondary-500 font-medium">
                          {paciente.status === "ATIVO"
                            ? "Ativo"
                            : paciente.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="p-4 border-t border-secondary-100">
            <Link
              to="/pacientes"
              className="block w-full py-3 text-sm text-center text-secondary-600 bg-secondary-50 hover:bg-secondary-100 hover:text-secondary-900 rounded-xl transition-all font-semibold border border-transparent hover:border-secondary-200"
            >
              Gerenciar Pacientes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
