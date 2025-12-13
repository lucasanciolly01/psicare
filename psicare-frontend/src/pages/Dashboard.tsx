import { Users, CalendarCheck, Clock, Plus, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { usePacientes } from '../context/PacientesContext';
import { useAgendamentos } from '../context/AgendamentosContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { format, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Dashboard() {
  const { usuario } = useAuth();
  const { pacientes } = usePacientes();
  
  // Extraímos 'crescimentoSemanal' que calculamos no Contexto
  const { sessoesHoje, sessoesSemana, crescimentoSemanal, proximosAgendamentos } = useAgendamentos();

  const totalAtivos = pacientes.filter(p => p.status === 'ativo').length;
  const pacientesRecentes = pacientes.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bom dia, {usuario?.nome.split(' ')[0] || 'Doutor(a)'}!
          </h1>
          <p className="text-gray-500 mt-2">Aqui está o resumo da sua prática hoje.</p>
        </div>
        <Link to="/agenda">
           <button className="bg-primary hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1">
            <Plus size={20} /> Novo Agendamento
          </button>
        </Link>
      </div>

      {/* Grid de Cards - CORRIGIDO AQUI */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Pacientes - Usa 'description' pois não temos dados históricos de cadastro */}
        <StatCard 
          title="Pacientes Ativos" 
          value={totalAtivos} 
          icon={Users} 
          color="blue"
          description={`De ${pacientes.length} totais`} 
        />
        
        {/* Card 2: Hoje - Informativo simples */}
        <StatCard 
          title="Sessões Hoje" 
          value={sessoesHoje} 
          icon={CalendarCheck} 
          color="green"
          description={format(new Date(), "'Dia' dd 'de' MMMM", { locale: ptBR })}
        />
        
        {/* Card 3: Semana - Usa 'trendValue' pois calculamos o crescimento real */}
        <StatCard 
          title="Sessões na Semana" 
          value={sessoesSemana} 
          icon={Clock} 
          color="purple"
          trendValue={crescimentoSemanal}
          trendLabel="vs. semana passada"
        />
      </section>

      {/* Restante do layout (Listas) permanece igual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTA DE PRÓXIMOS ATENDIMENTOS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Próximos Atendimentos</h3>
            <Link to="/agenda" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              Ver agenda completa <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {proximosAgendamentos.length === 0 ? (
               <p className="text-gray-400 text-center py-8">Nenhum atendimento próximo.</p>
            ) : (
              proximosAgendamentos.map((sessao) => {
                const isSessaoHoje = isToday(parseISO(sessao.data));
                
                return (
                  <div key={sessao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <span className="block text-lg font-bold text-gray-800">{sessao.hora}</span>
                        {!isSessaoHoje && (
                          <span className="block text-[10px] text-gray-500 uppercase font-bold">
                            {format(parseISO(sessao.data), 'dd MMM', { locale: ptBR })}
                          </span>
                        )}
                      </div>
                      
                      <div className={`w-1 h-10 rounded-full ${
                        sessao.status === 'concluido' ? 'bg-green-500' : 
                        sessao.status === 'cancelado' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800">{sessao.pacienteNome}</h4>
                        <p className="text-sm text-gray-500">{sessao.tipo}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium hidden sm:block ${
                      sessao.status === 'concluido' ? 'bg-green-100 text-green-700' : 
                      sessao.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {sessao.status.charAt(0).toUpperCase() + sessao.status.slice(1)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Coluna Direita: Pacientes Recentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Pacientes Recentes</h3>
          <ul className="space-y-4 flex-1">
            {pacientesRecentes.length === 0 ? (
               <p className="text-gray-400 text-sm text-center py-4">Nenhum paciente cadastrado.</p>
            ) : (
              pacientesRecentes.map((paciente) => (
                <li key={paciente.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-primary flex items-center justify-center font-bold text-sm">
                      {paciente.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">{paciente.nome}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      paciente.status === 'ativo' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {paciente.status === 'ativo' ? 'Ativo' : paciente.status}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
          <Link to="/pacientes" className="w-full mt-6 py-2.5 text-sm text-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Ver todos os pacientes
          </Link>
        </div>

      </div>
    </div>
  );
}