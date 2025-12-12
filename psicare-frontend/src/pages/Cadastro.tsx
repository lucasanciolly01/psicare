import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, CheckCircle2 } from 'lucide-react';
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
    login(data.email);
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 p-4 lg:p-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 my-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Crie sua conta</h1>
          <p className="text-gray-500 text-sm">Comece a gerenciar sua clínica hoje.</p>
        </div>

        <form onSubmit={handleSubmit(handleCadastro)} className="space-y-4">
          
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input 
              type="text" 
              placeholder="Nome Completo"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all text-base ${errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('nome')}
            />
            {errors.nome && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.nome.message}</span>}
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input 
              type="email" 
              placeholder="E-mail profissional"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all text-base ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('email')}
            />
            {errors.email && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.email.message}</span>}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input 
              type="password" 
              placeholder="Senha"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all text-base ${errors.senha ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('senha')}
            />
            {errors.senha && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.senha.message}</span>}
          </div>

          <div className="relative">
            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input 
              type="password" 
              placeholder="Confirme a senha"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition-all text-base ${errors.confirmacao ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('confirmacao')}
            />
            {errors.confirmacao && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.confirmacao.message}</span>}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary border-gray-300"
                {...register('termos')}
              />
              <span className="text-xs text-gray-600 leading-relaxed select-none">
                Li e aceito os <Link to="/termos" className="text-primary hover:underline font-bold">Termos de Uso</Link> e a <Link to="/privacidade" className="text-primary hover:underline font-bold">Política de Privacidade</Link>.
              </span>
            </label>
            {errors.termos && <span className="text-xs text-red-500 ml-3">{errors.termos.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-base mt-2">
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