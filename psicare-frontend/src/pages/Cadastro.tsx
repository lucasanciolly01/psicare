// src/pages/Cadastro.tsx
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const cadastroSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmacao: z.string(),
  termos: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
}).refine((data) => data.senha === data.confirmacao, {
  message: "As senhas não coincidem",
  path: ["confirmacao"],
});

type CadastroSchema = z.infer<typeof cadastroSchema>;

export function Cadastro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CadastroSchema>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmacao: '',
      termos: false,
    }
  });

  const handleCadastro = (data: CadastroSchema) => {
    console.log('Dados enviados:', data);
    login(data.email);
    navigate('/');
  };

  return (
    // MUDANÇA: min-h-[100dvh] + pb-40 para garantir que o rodapé "flutue" alto
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 p-4 py-12 pb-40">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crie sua conta</h1>
          <p className="text-gray-500">Comece a gerenciar sua clínica hoje.</p>
        </div>

        <form onSubmit={handleSubmit(handleCadastro)} className="space-y-5">
          
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Nome Completo"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all ${errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('nome')}
            />
            {errors.nome && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.nome.message}</span>}
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="E-mail profissional"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('email')}
            />
            {errors.email && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.email.message}</span>}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Senha"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all ${errors.senha ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('senha')}
            />
            {errors.senha && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.senha.message}</span>}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Confirme a senha"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all ${errors.confirmacao ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('confirmacao')}
            />
            {errors.confirmacao && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.confirmacao.message}</span>}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" id="termos" 
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
                {...register('termos')}
              />
              <label htmlFor="termos" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                Li e aceito os <Link to="#" className="text-primary hover:underline font-bold">Termos de Uso</Link> e a <Link to="#" className="text-primary hover:underline font-bold">Política de Privacidade</Link>.
              </label>
            </div>
            {errors.termos && <span className="text-xs text-red-500 ml-1">{errors.termos.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 text-base">
            {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-600">
          Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Entrar</Link>
        </div>
      </div>
    </div>
  );
}