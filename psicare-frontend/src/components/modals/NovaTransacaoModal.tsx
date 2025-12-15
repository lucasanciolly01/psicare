import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form'; // <--- 1. Importar useWatch
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { DollarSign, Calendar, Tag, FileText, CheckCircle2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

// Schema de Validação
const transacaoSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 letras'),
  valor: z.string().min(1, 'O valor é obrigatório'),
  tipo: z.enum(['receita', 'despesa']),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  data: z.string().min(1, 'A data é obrigatória'),
  status: z.enum(['pago', 'pendente']),
});

type TransacaoFormData = z.infer<typeof transacaoSchema>;

interface NovaTransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoInicial?: 'receita' | 'despesa';
}

export function NovaTransacaoModal({ isOpen, onClose, tipoInicial = 'receita' }: NovaTransacaoModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control, // <--- 2. Usamos 'control' em vez de 'watch'
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      tipo: tipoInicial,
      status: 'pago',
      data: new Date().toISOString().split('T')[0],
    },
  });

  // <--- 3. Substituição pelo hook useWatch (Melhor performance e compatível com React Compiler)
  const tipoSelecionado = useWatch({
    control,
    name: 'tipo',
  });

  const isReceita = tipoSelecionado === 'receita';

  // Atualiza o tipo se a prop mudar ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setValue('tipo', tipoInicial);
    }
  }, [isOpen, tipoInicial, setValue]);

  const handleSave = async (data: TransacaoFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Dados salvos:', data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isReceita ? 'Nova Receita' : 'Nova Despesa'}
    >
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        
        {/* Seletor de Tipo (Visual Toggle) */}
        <div className="flex p-1 bg-secondary-50 rounded-xl border border-secondary-100">
          <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${isReceita ? 'bg-white text-emerald-600 shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}>
            <input type="radio" value="receita" className="hidden" {...register('tipo')} />
            <ArrowUpCircle size={18} />
            Entrada
          </label>
          <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${!isReceita ? 'bg-white text-rose-600 shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}>
            <input type="radio" value="despesa" className="hidden" {...register('tipo')} />
            <ArrowDownCircle size={18} />
            Saída
          </label>
        </div>

        {/* Valor e Descrição */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-700 ml-1 uppercase">Valor (R$)</label>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isReceita ? 'text-emerald-500' : 'text-rose-500'}`}>
                <DollarSign size={18} />
              </div>
              <input 
                type="number" 
                step="0.01"
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-lg"
                {...register('valor')}
              />
            </div>
            {errors.valor && <p className="text-xs text-rose-500 font-bold ml-1">{errors.valor.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-700 ml-1 uppercase">Data</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                <Calendar size={18} />
              </div>
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                {...register('data')}
              />
            </div>
          </div>
        </div>

        {/* Descrição Completa */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-secondary-700 ml-1 uppercase">Descrição</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
              <FileText size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Ex: Sessão Terapia, Aluguel, Internet..."
              className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
              {...register('descricao')}
            />
          </div>
          {errors.descricao && <p className="text-xs text-rose-500 font-bold ml-1">{errors.descricao.message}</p>}
        </div>

        {/* Categoria e Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-700 ml-1 uppercase">Categoria</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                <Tag size={18} />
              </div>
              <select 
                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium appearance-none"
                {...register('categoria')}
              >
                <option value="">Selecione...</option>
                {isReceita ? (
                  <>
                    <option value="Sessão">Sessão / Consulta</option>
                    <option value="Supervisão">Supervisão Dada</option>
                    <option value="Palestra">Palestra / Workshop</option>
                    <option value="Outros">Outros</option>
                  </>
                ) : (
                  <>
                    <option value="Aluguel">Aluguel / Condomínio</option>
                    <option value="Marketing">Marketing / Publicidade</option>
                    <option value="Educação">Cursos / Supervisão</option>
                    <option value="Impostos">Impostos / Taxas</option>
                    <option value="Software">Software / Sistemas</option>
                    <option value="Outros">Outros</option>
                  </>
                )}
              </select>
            </div>
            {errors.categoria && <p className="text-xs text-rose-500 font-bold ml-1">{errors.categoria.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-700 ml-1 uppercase">Status</label>
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <input type="radio" value="pago" className="peer hidden" {...register('status')} />
                <div className="h-full flex items-center justify-center gap-2 border border-secondary-200 bg-secondary-50 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:border-emerald-200 rounded-xl transition-all font-bold text-sm py-3 text-secondary-500">
                  <CheckCircle2 size={16} />
                  Concluído
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" value="pendente" className="peer hidden" {...register('status')} />
                <div className="h-full flex items-center justify-center gap-2 border border-secondary-200 bg-secondary-50 peer-checked:bg-orange-50 peer-checked:text-orange-700 peer-checked:border-orange-200 rounded-xl transition-all font-bold text-sm py-3 text-secondary-500">
                  <AlertCircleIcon />
                  Pendente
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="pt-4 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3 border border-secondary-200 rounded-xl font-bold text-secondary-600 hover:bg-secondary-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-6 py-3 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2
              ${isReceita 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
              } disabled:opacity-70`}
          >
            {isSubmitting ? 'Salvando...' : (isReceita ? 'Registrar Entrada' : 'Registrar Saída')}
          </button>
        </div>

      </form>
    </Modal>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}