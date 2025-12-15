import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Camera, 
  Save, 
  Lock, 
  Bell, 
  Shield, 
  LogOut,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Schema para Dados Pessoais
const profileSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  crp: z.string().min(4, 'CRP inválido'),
  especialidade: z.string().min(3, 'Informe sua especialidade'),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function Perfil() {
  const { usuario, logout } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Mock inicial baseado no contexto de auth (ou dados estáticos se auth for simples)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: usuario?.nome || 'Dr. Lucas Anciolly',
      email: usuario?.email || 'lucas@psicare.com',
      telefone: '(11) 99999-9999',
      crp: '06/12345',
      especialidade: 'Psicologia Clínica',
      bio: 'Especialista em Terapia Cognitivo-Comportamental com foco em ansiedade e desenvolvimento pessoal.',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    // Simula chamada API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Perfil atualizado:', data);
    
    addToast({
      type: 'success',
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso.',
    });
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* === CABEÇALHO DO PERFIL === */}
      <div className="relative bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
        {/* Capa (Cover) */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary-600 to-emerald-600 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </div>

        {/* Conteúdo do Header */}
        <div className="px-6 pb-6 md:px-8">
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-16 gap-4 md:gap-6">
            
            {/* Foto de Perfil */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-secondary-100 shadow-lg overflow-hidden flex items-center justify-center">
                {/* Placeholder ou Imagem */}
                <div className="w-full h-full bg-secondary-200 flex items-center justify-center text-secondary-400">
                  <User size={48} />
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-transform active:scale-95 group-hover:scale-110">
                <Camera size={16} />
              </button>
            </div>

            {/* Nome e Info */}
            <div className="text-center md:text-left flex-1 mb-2">
              <h1 className="text-2xl font-bold text-secondary-900">{usuario?.nome || 'Dr. Lucas Anciolly'}</h1>
              <p className="text-secondary-500 font-medium">Psicólogo Clínico • CRP 06/12345</p>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={logout}
                className="px-4 py-2 border border-rose-100 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-colors"
                >
                  Editar Perfil
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-secondary-200 text-secondary-600 rounded-xl text-sm font-bold hover:bg-secondary-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLUNA ESQUERDA: FORMULÁRIO PRINCIPAL === */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 md:p-8 relative">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
                <User className="text-primary-500" size={20} />
                Informações Pessoais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary-500 uppercase">Nome Completo</label>
                <input 
                  disabled={!isEditing}
                  {...register('nome')}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-secondary-900"
                />
                {errors.nome && <p className="text-xs text-rose-500 font-bold">{errors.nome.message}</p>}
              </div>

              {/* Email (Read Only geralmente) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary-500 uppercase">E-mail Profissional</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
                  <input 
                    disabled={true} // Email geralmente não se troca fácil
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary-100 border border-secondary-200 rounded-xl outline-none text-secondary-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary-500 uppercase">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
                  <input 
                    disabled={!isEditing}
                    {...register('telefone')}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-60 font-medium text-secondary-900"
                  />
                </div>
                {errors.telefone && <p className="text-xs text-rose-500 font-bold">{errors.telefone.message}</p>}
              </div>

              {/* CRP */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary-500 uppercase">Registro Profissional (CRP)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
                  <input 
                    disabled={!isEditing}
                    {...register('crp')}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-60 font-medium text-secondary-900"
                  />
                </div>
              </div>

              {/* Especialidade */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-secondary-500 uppercase">Especialidade Principal</label>
                <input 
                  disabled={!isEditing}
                  {...register('especialidade')}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-60 font-medium text-secondary-900"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-secondary-500 uppercase">Sobre Mim (Bio)</label>
                <textarea 
                  rows={4}
                  disabled={!isEditing}
                  {...register('bio')}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-60 font-medium text-secondary-900 resize-none"
                  placeholder="Escreva um pouco sobre sua abordagem..."
                />
              </div>
            </div>

            {/* Botão Salvar (Só aparece editando) */}
            {isEditing && (
              <div className="mt-8 flex justify-end animate-fade-in">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  Salvar Alterações
                </button>
              </div>
            )}
          </form>

          {/* Seção Endereço (Mock Visual) */}
          <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-6">
              <MapPin className="text-primary-500" size={20} />
              Endereço do Consultório
            </h2>
            <div className="p-4 bg-secondary-50 rounded-xl border border-dashed border-secondary-300 flex items-center justify-center text-secondary-500 gap-2">
              <span>Funcionalidade de endereço em desenvolvimento...</span>
            </div>
          </div>
        </div>

        {/* === COLUNA DIREITA: CONFIGURAÇÕES === */}
        <div className="space-y-6">
          
          {/* Segurança */}
          <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
              <Shield className="text-primary-500" size={20} />
              Segurança
            </h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-secondary-600 group-hover:text-primary-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-secondary-900">Alterar Senha</p>
                    <p className="text-xs text-secondary-500">Última troca há 3 meses</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary-600">Editar</span>
              </button>
            </div>
          </div>

          {/* Preferências / Notificações */}
          <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
              <Bell className="text-primary-500" size={20} />
              Notificações
            </h2>
            <div className="space-y-4">
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-secondary-700">Lembretes de Sessão</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-secondary-700">E-mail Marketing</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-secondary-700">Alertas Financeiros</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </div>
              </label>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}