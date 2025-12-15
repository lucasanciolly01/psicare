import { useState } from 'react'; // <--- 1. Importar useState
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// <--- 2. Importar o Modal que criamos
import { NovaTransacaoModal } from '../components/modals/NovaTransacaoModal';

// === DADOS MOCKADOS ===
const mockDataChart = [
  { name: 'Jan', receitas: 4000, despesas: 2400 },
  { name: 'Fev', receitas: 3000, despesas: 1398 },
  { name: 'Mar', receitas: 2000, despesas: 9800 },
  { name: 'Abr', receitas: 2780, despesas: 3908 },
  { name: 'Mai', receitas: 1890, despesas: 4800 },
  { name: 'Jun', receitas: 2390, despesas: 3800 },
];

const mockTransacoes = [
  { id: 1, descricao: 'Sessão - Ana Silva', categoria: 'Atendimento', data: '15/06/2024', valor: 250.00, tipo: 'receita', status: 'pago' },
  { id: 2, descricao: 'Aluguel Sala', categoria: 'Infraestrutura', data: '10/06/2024', valor: 1200.00, tipo: 'despesa', status: 'pago' },
  { id: 3, descricao: 'Sessão - Carlos B.', categoria: 'Atendimento', data: '09/06/2024', valor: 250.00, tipo: 'receita', status: 'pendente' },
  { id: 4, descricao: 'Internet/Telefone', categoria: 'Despesas Fixas', data: '05/06/2024', valor: 150.00, tipo: 'despesa', status: 'pago' },
  { id: 5, descricao: 'Supervisão Clínica', categoria: 'Educação', data: '02/06/2024', valor: 300.00, tipo: 'despesa', status: 'pendente' },
];

export function Financeiro() {
  // <--- 3. Estados para controlar o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'receita' | 'despesa'>('receita');

  // <--- 4. Função para abrir o modal com o tipo correto
  const handleOpenModal = (type: 'receita' | 'despesa') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Financeiro</h1>
          <p className="text-secondary-500">Gestão completa do fluxo de caixa do consultório.</p>
        </div>
        <div className="flex gap-3">
          {/* Botão Nova Despesa com onClick */}
          <button 
            onClick={() => handleOpenModal('despesa')}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 font-bold rounded-xl hover:bg-rose-100 transition-colors border border-rose-100 shadow-sm text-sm active:scale-95"
          >
            <Minus size={18} />
            <span className="hidden sm:inline">Nova Despesa</span>
          </button>
          
          {/* Botão Nova Receita com onClick */}
          <button 
            onClick={() => handleOpenModal('receita')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 text-sm active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nova Receita</span>
          </button>
        </div>
      </div>

      {/* Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receitas */}
        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={48} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-bold text-secondary-500 uppercase tracking-wider">Receitas (Mês)</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">R$ 8.450,00</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            +12% <span className="text-secondary-400 font-normal">vs mês anterior</span>
          </p>
        </div>

        {/* Despesas */}
        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={48} className="text-rose-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <TrendingDown size={20} />
            </div>
            <span className="text-sm font-bold text-secondary-500 uppercase tracking-wider">Despesas (Mês)</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">R$ 2.100,00</h3>
          <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
            +5% <span className="text-secondary-400 font-normal">vs mês anterior</span>
          </p>
        </div>

        {/* Saldo */}
        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={48} className="text-primary-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <Wallet size={20} />
            </div>
            <span className="text-sm font-bold text-secondary-500 uppercase tracking-wider">Saldo Líquido</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">R$ 6.350,00</h3>
          <p className="text-xs text-secondary-400 mt-1">
            Disponível em caixa
          </p>
        </div>

        {/* A Receber */}
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle size={48} className="text-orange-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <AlertCircle size={20} />
            </div>
            <span className="text-sm font-bold text-secondary-500 uppercase tracking-wider">Pendente</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">R$ 750,00</h3>
          <p className="text-xs text-orange-600 font-bold mt-1 flex items-center gap-1">
            3 faturas <span className="text-secondary-400 font-normal">em aberto</span>
          </p>
        </div>
      </div>

      {/* Gráfico e Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Principal */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-secondary-900 text-lg">Fluxo de Caixa (Semestral)</h3>
            <select className="bg-secondary-50 border-none text-sm font-bold text-secondary-600 rounded-lg py-1 px-3 outline-none cursor-pointer">
              <option>Últimos 6 meses</option>
              <option>Este Ano</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDataChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `R$${val/1000}k`} />
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number | undefined) => [`R$ ${value}`, '']}
                />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReceitas)" />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
        {/* Toolbar da Tabela */}
        <div className="p-5 border-b border-secondary-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-secondary-900 text-lg">Últimos Lançamentos</h3>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl text-sm outline-none focus:border-primary-500 transition-colors w-full sm:w-auto"
              />
            </div>
            <button className="p-2 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors">
              <Filter size={18} />
            </button>
            <button className="p-2 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-50/50 border-b border-secondary-100 text-xs uppercase tracking-wider text-secondary-500">
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {mockTransacoes.map((item) => (
                <tr key={item.id} className="hover:bg-secondary-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.tipo === 'receita' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        <DollarSign size={16} />
                      </div>
                      <span className="font-bold text-secondary-900">{item.descricao}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-500 font-medium">
                    {item.categoria}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-500">
                    {item.data}
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${item.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                      ${item.status === 'pago' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-orange-50 text-orange-700 border-orange-100'
                      }`}>
                      {item.status === 'pago' ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginação Simples */}
        <div className="p-4 border-t border-secondary-100 flex items-center justify-between text-xs text-secondary-500">
          <span>Mostrando 5 de 128 lançamentos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-secondary-200 rounded-lg hover:bg-secondary-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1.5 border border-secondary-200 rounded-lg hover:bg-secondary-50">Próxima</button>
          </div>
        </div>
      </div>

      {/* <--- 5. Renderizar o componente do Modal no fim da página */}
      <NovaTransacaoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tipoInicial={modalType}
      />
    </div>
  );
}