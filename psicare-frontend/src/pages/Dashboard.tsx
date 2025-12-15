import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAgendamentos } from "../context/AgendamentosContext";
import { usePacientes } from "../context/PacientesContext";
import { useNotificacoes } from "../context/NotificacoesContext";

export function Dashboard() {
  const { usuario } = useAuth();
  const { agendamentos } = useAgendamentos();
  const { pacientes } = usePacientes();
  const { notificacoes } = useNotificacoes();

  // Dados calculados (Simulação de lógica real)
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const agendamentosHoje = agendamentos
    .filter((a) => a.data === new Date().toISOString().split("T")[0])
    .slice(0, 3);
  const pacientesAtivos = pacientes.length;

  // Mock Financeiro Rápido (poderia vir de um contexto global no futuro)
  const faturamentoMes = 8450.0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* === HEADER DE BOAS-VINDAS === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-secondary-900 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-secondary-900/10 relative overflow-hidden">
        {/* Background Decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <p className="text-secondary-300 font-medium capitalize mb-1">
            {hoje}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Olá,{" "}
            <span className="text-primary-400">
              {usuario?.nome?.split(" ")[0] || "Doutor(a)"}
            </span>
          </h1>
          <p className="text-secondary-200 mt-2 max-w-md text-sm md:text-base leading-relaxed">
            Você tem{" "}
            <strong className="text-white">
              {agendamentosHoje.length} atendimentos
            </strong>{" "}
            programados para hoje. Mantenha o foco e um ótimo trabalho!
          </p>
        </div>

        {/* Ações Rápidas */}
        <div className="relative z-10 flex gap-3">
          <Link
            to="/agenda"
            className="flex flex-col items-center justify-center w-24 h-24 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl transition-all group"
          >
            <div className="p-2 bg-primary-500 rounded-lg mb-2 shadow-lg group-hover:scale-110 transition-transform">
              <Plus size={20} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white">Sessão</span>
          </Link>

          <Link
            to="/pacientes"
            className="flex flex-col items-center justify-center w-24 h-24 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl transition-all group"
          >
            <div className="p-2 bg-emerald-500 rounded-lg mb-2 shadow-lg group-hover:scale-110 transition-transform">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white">Paciente</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === COLUNA ESQUERDA (AGENDA & NOTIFICAÇÕES) === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Próximos Atendimentos */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
                <Calendar className="text-primary-500" size={20} />
                Agenda de Hoje
              </h2>
              <Link
                to="/agenda"
                className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
              >
                Ver completa <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {agendamentosHoje.length > 0 ? (
                agendamentosHoje.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex items-center p-4 bg-secondary-50 hover:bg-white border border-transparent hover:border-secondary-200 rounded-xl transition-all group"
                  >
                    {/* Horário */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-white border border-secondary-200 rounded-xl mr-4 shadow-sm group-hover:border-primary-200 group-hover:shadow-primary-500/10">
                      <span className="text-xs font-bold text-secondary-500">
                        {/* Agora o TypeScript vai reconhecer isso: */}
                        {agendamento.horario.split(":")[0]}h
                      </span>
                      <span className="text-xs font-bold text-secondary-400">
                        {agendamento.horario.split(":")[1]}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-secondary-900 text-sm md:text-base">
                        {agendamento.pacienteNome}
                      </h3>
                      <p className="text-xs text-secondary-500 flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            agendamento.tipo === "Primeira Consulta"
                              ? "bg-purple-500"
                              : "bg-primary-500"
                          }`}
                        />
                        {agendamento.tipo}
                      </p>
                    </div>
                    {/* Status / Ação */}
                    <div className="flex items-center gap-2">
                      {agendamento.status === "agendado" ? (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                          Confirmado
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                          Concluído
                        </span>
                      )}
                      <button className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-secondary-50/50 rounded-xl border border-dashed border-secondary-200">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-secondary-400">
                    <Calendar size={24} />
                  </div>
                  <p className="text-secondary-500 font-medium text-sm">
                    Nenhum agendamento restante para hoje.
                  </p>
                  <Link
                    to="/agenda"
                    className="text-primary-600 font-bold text-sm hover:underline mt-1 inline-block"
                  >
                    Ver dias futuros
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Últimas Notificações */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-emerald-500" size={20} />
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              {notificacoes.length > 0 ? (
                notificacoes.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className="flex gap-4 items-start pb-4 border-b border-secondary-50 last:border-0 last:pb-0"
                  >
                    <div
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        notif.lida
                          ? "bg-secondary-300"
                          : "bg-rose-500 animate-pulse"
                      }`}
                    />
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          notif.lida
                            ? "text-secondary-600"
                            : "text-secondary-900"
                        }`}
                      >
                        {notif.titulo}
                      </h4>
                      <p className="text-xs text-secondary-500 mt-1 leading-relaxed">
                        {notif.mensagem}
                      </p>
                      <span className="text-[10px] text-secondary-400 font-medium mt-1.5 block">
                        Há 2 horas
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary-500 italic">
                  Nenhuma notificação recente.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* === COLUNA DIREITA (KPIS & RESUMOS) === */}
        <div className="space-y-6">
          {/* Card Pacientes */}
          <div className="bg-white p-5 rounded-2xl border border-secondary-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                <Users size={24} />
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1">
                <TrendingUp size={12} /> +4%
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-secondary-900">
                {pacientesAtivos}
              </h3>
              <p className="text-sm text-secondary-500 font-medium">
                Pacientes Ativos
              </p>
            </div>
            {/* Decoração Fundo */}
            <Users
              size={96}
              className="absolute -bottom-4 -right-4 text-secondary-50 opacity-50"
            />
          </div>

          {/* Card Financeiro */}
          <div className="bg-secondary-900 p-5 rounded-2xl shadow-lg shadow-secondary-900/10 text-white relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                <TrendingUp size={24} className="text-emerald-400" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-secondary-300 text-xs font-bold uppercase tracking-wider mb-1">
                Faturamento (Mês)
              </p>
              <h3 className="text-3xl font-bold">
                R${" "}
                {faturamentoMes.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <Link
                to="/financeiro"
                className="text-xs text-primary-300 hover:text-white mt-3 inline-flex items-center gap-1 transition-colors"
              >
                Ver detalhes <ArrowRight size={12} />
              </Link>
            </div>
            {/* Decoração Fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          </div>

          {/* Lembrete / Próxima Ação */}
          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold">
              <AlertCircle size={18} />
              <span>Atenção</span>
            </div>
            <p className="text-sm text-orange-700 leading-relaxed mb-3">
              Você tem <strong>2 prontuários</strong> pendentes de preenchimento
              da semana passada.
            </p>
            <button className="w-full py-2 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors">
              Resolver Pendências
            </button>
          </div>

          {/* Card Informativo / Quote */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-2xl shadow-lg text-white text-center">
            <Clock size={32} className="mx-auto mb-3 opacity-80" />
            <p className="text-sm font-medium opacity-90 italic">
              "Conheça todas as teorias, domine todas as técnicas, mas ao tocar
              uma alma humana, seja apenas outra alma humana."
            </p>
            <p className="text-xs mt-3 font-bold opacity-75">— Carl Jung</p>
          </div>
        </div>
      </div>
    </div>
  );
}
