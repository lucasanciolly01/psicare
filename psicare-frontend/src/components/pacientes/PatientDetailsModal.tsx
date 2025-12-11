import { Modal } from '../ui/Modal';
import { usePacientes, type Paciente, type Sessao } from '../../context/PacientesContext'; 
// Ícones atualizados: Adicionei CheckCircle e XCircle
import { Phone, Mail, Activity, Clock, Plus, FileText, Lock, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react'; 
import { useState } from 'react';

interface PatientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

export function PatientDetailsModal({ isOpen, onClose, paciente }: PatientDetailsProps) {
  
  const { adicionarSessao } = usePacientes(); 
  const [isNewSessaoModalOpen, setIsNewSessaoModalOpen] = useState(false);
  
  const [novaSessao, setNovaSessao] = useState<Omit<Sessao, 'id'>>({
    data: new Date().toISOString().split('T')[0], 
    tipo: 'Sessão de Acompanhamento',
    statusSessao: 'compareceu',
    evolucao: '',
  });

  if (!paciente) return null;

  // FUNÇÃO DE ESTILOS UNIFICADA (Para lista e para formulário)
  const getStatusClasses = (status: Sessao['statusSessao'], isSelected: boolean = false) => {
    
    // Estilos para o estado ATIVO (Fundo forte, escala, sombra)
    if (isSelected) {
      switch (status) {
        case 'compareceu': return 'bg-green-600 border-green-700 text-white shadow-md transform scale-[1.02]';
        case 'faltou': return 'bg-red-600 border-red-700 text-white shadow-md transform scale-[1.02]';
        case 'remarcada': return 'bg-blue-600 border-blue-700 text-white shadow-md transform scale-[1.02]';
        case 'cancelada': return 'bg-gray-600 border-gray-700 text-white shadow-md transform scale-[1.02]';
      }
    }
    
    // Estilos para o estado INATIVO/LISTA (Fundo claro, texto forte)
    switch (status) {
      case 'compareceu': return 'bg-green-100 text-green-700 border-green-200';
      case 'faltou': return 'bg-red-100 text-red-700 border-red-200';
      case 'remarcada': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelada': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };


  const handleAdicionarSessao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente) return;

    adicionarSessao(paciente.id, novaSessao);
    
    setNovaSessao({
      data: new Date().toISOString().split('T')[0],
      tipo: 'Sessão de Acompanhamento',
      statusSessao: 'compareceu',
      evolucao: '',
    });
    setIsNewSessaoModalOpen(false);
  };

  return (
    <>
      {/* 1. MODAL PRINCIPAL DE VISUALIZAÇÃO */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Prontuário do Paciente"
        size="lg"
      >
        <div className="flex flex-col gap-6">
          
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-100 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
              {paciente.nome.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{paciente.nome}</h2>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
                  <Phone size={14} className="text-primary" /> {paciente.telefone}
                </span>
                
                {paciente.email && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
                    <Mail size={14} className="text-primary" /> {paciente.email}
                  </span>
                )}
                
                {paciente.dataNascimento && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
                    <CalendarIcon size={14} className="text-primary" /> 
                    {new Date(paciente.dataNascimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>

              <div className="mt-4 flex justify-center sm:justify-start">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                    ${paciente.status === 'ativo' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                `}>
                  {paciente.status}
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Conteúdo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Coluna Esquerda: Dados Clínicos */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <Activity size={14} /> Dados Clínicos
              </h3>
              
              {/* Queixa Principal */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="text-xs font-bold text-primary mb-2 block uppercase">Queixa Principal</label>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {paciente.queixaPrincipal || "Nenhuma queixa registrada."}
                </p>
              </div>

              {/* Histórico Familiar */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="text-xs font-bold text-primary mb-2 block uppercase">Histórico Familiar</label>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {paciente.historicoFamiliar || "Informação não fornecida."}
                </p>
              </div>

              {/* Observações Iniciais */}
              {paciente.observacoesIniciais && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-primary mb-2 block uppercase items-center gap-2">
                    <FileText size={12} /> Observações Iniciais
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {paciente.observacoesIniciais}
                  </p>
                </div>
              )}

              {/* Anotações Privadas */}
              {paciente.anotacoes && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <label className="text-xs font-bold text-yellow-700 mb-2 block uppercase items-center gap-2">
                    <Lock size={12} /> Anotações Privadas
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {paciente.anotacoes}
                  </p>
                </div>
              )}
            </div>

            {/* Coluna Direita: Histórico DINÂMICO */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <Clock size={14} /> Histórico de Sessões ({paciente.sessoes.length})
              </h3>
              
              <div className="border border-gray-100 rounded-xl overflow-hidden bg-white max-h-96 overflow-y-auto">
                
                {paciente.sessoes.length > 0 ? (
                  paciente.sessoes.map((sessao) => (
                    <div key={sessao.id} className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-gray-800">{sessao.tipo}</p>
                        <span className={`text-[10px] ${getStatusClasses(sessao.statusSessao)} px-2 py-0.5 rounded font-bold uppercase`}>
                          {sessao.statusSessao}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <CalendarIcon size={12} /> {new Date(sessao.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-600 italic line-clamp-2">
                        {sessao.evolucao.substring(0, 100)}{sessao.evolucao.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Nenhuma sessão registrada.
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIsNewSessaoModalOpen(true)}
                className="w-full py-2.5 text-sm text-primary font-medium border border-dashed border-primary/30 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Adicionar Nova Evolução
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- 2. NOVO MODAL: ADICIONAR EVOLUÇÃO/SESSÃO (CORRIGIDO ABAIXO) --- */}
      <Modal
        isOpen={isNewSessaoModalOpen}
        onClose={() => setIsNewSessaoModalOpen(false)}
        title={`Nova Sessão para ${paciente.nome}`}
        size="md"
      >
        <form onSubmit={handleAdicionarSessao} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
              
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sessão</label>
                <select required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all"
                  value={novaSessao.tipo}
                  onChange={e => setNovaSessao({...novaSessao, tipo: e.target.value})}
                >
                    <option>Sessão de Acompanhamento</option>
                    <option>Anamnese Inicial</option>
                    <option>Retorno/Reavaliação</option>
                </select>
              </div>
              
              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input required type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-600 appearance-none bg-white"
                  value={novaSessao.data}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={e => setNovaSessao({...novaSessao, data: e.target.value})}
                />
              </div>

              {/* Status - CORREÇÃO DE ESTILO APLICADA AQUI */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex flex-wrap gap-3">
                    {['compareceu', 'faltou', 'remarcada', 'cancelada'].map(status => {
                      const isSelected = novaSessao.statusSessao === status;
                      
                      // Usamos o getStatusClasses para aplicar a estilização unificada
                      return (
                        <button type="button" key={status} 
                          onClick={() => setNovaSessao({...novaSessao, statusSessao: status as Sessao['statusSessao']})}
                          className={`
                            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border shadow-sm duration-150
                            ${isSelected 
                              ? getStatusClasses(status as Sessao['statusSessao'], true) 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300' // Estilo INATIVO
                            }
                          `}
                        >
                           {/* Ícones condicionais para dar o toque profissional */}
                           {status === 'compareceu' && <CheckCircle size={16} />}
                           {(status === 'faltou' || status === 'cancelada') && <XCircle size={16} />}
                           {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      );
                    })}
                </div>
              </div>
              
          </div>

          {/* Evolução */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evolução / Anotações da Sessão</label>
            <textarea required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-32 resize-none text-sm transition-all"
              placeholder="Registre aqui o que foi discutido, intervenções, e o planejamento para a próxima sessão..."
              value={novaSessao.evolucao}
              onChange={e => setNovaSessao({...novaSessao, evolucao: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3 border-t border-gray-50">
            <button type="button" onClick={() => setIsNewSessaoModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-green-700 shadow-md transition-all">
              Salvar Evolução
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}