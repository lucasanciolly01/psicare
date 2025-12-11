// src/pages/Cadastro.tsx
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema de validação (Mantido igual)
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
    // MUDANÇA 1: min-h-[100dvh] para altura real no mobile
    // MUDANÇA 2: pb-24 para criar o espaço de segurança no rodapé (contra a barra do Safari)
    // MUDANÇA 3: overflow-y-auto para garantir rolagem em telas pequenas
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 p-4 overflow-y-auto pb-24">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
          <p className="text-gray-500 text-sm">Comece a gerenciar sua clínica hoje.</p>
        </div>

        <form onSubmit={handleSubmit(handleCadastro)} className="space-y-4">
          
          {/* Campo Nome */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Nome Completo"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('nome')}
            />
            {errors.nome && <span className="text-xs text-red-500 ml-1">{errors.nome.message}</span>}
          </div>

          {/* Campo Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="E-mail profissional"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('email')}
            />
            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Senha"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${errors.senha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('senha')}
            />
            {errors.senha && <span className="text-xs text-red-500 ml-1">{errors.senha.message}</span>}
          </div>

          {/* Campo Confirmação */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Confirme a senha"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${errors.confirmacao ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              {...register('confirmacao')}
            />
            {errors.confirmacao && <span className="text-xs text-red-500 ml-1">{errors.confirmacao.message}</span>}
          </div>

          {/* Campo Termos */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" id="termos" 
                className="mt-1 rounded text-primary focus:ring-primary"
                {...register('termos')}
              />
              <label htmlFor="termos" className="text-xs text-gray-600 cursor-pointer">
                Li e aceito os <Link to="#" className="text-primary hover:underline">Termos de Uso</Link> e a <Link to="#" className="text-primary hover:underline">Política de Privacidade</Link>.
              </label>
            </div>
            {errors.termos && <span className="text-xs text-red-500 ml-1">{errors.termos.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
            {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline">Entrar</Link>
        </div>
      </div>
    </div>
  );
}