import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const cadastroSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmacao: z.string(),
  termos: z.boolean().refine((val) => val === true, {
    message: 'Necessário aceitar os termos',
  }),
}).refine((data) => data.senha === data.confirmacao, {
  message: "As senhas não coincidem",
  path: ["confirmacao"],
});

type CadastroSchema = z.infer<typeof cadastroSchema>;

export function Cadastro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CadastroSchema>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { termos: false }
  });

  const handleCadastro = (data: CadastroSchema) => {
    login(data.email);
    navigate('/');
  };

  return (
    // CONTAINER EXTERNO:
    // min-h-[100dvh]: Garante altura total da tela
    // flex-col justify-center items-center: Centraliza tudo perfeitamente
    // px-4: Cria uma margem de segurança nas laterais para celulares pequenos
    // py-8: Garante espaço em cima e embaixo para não colar nas bordas verticais
    <div className="min-h-[100dvh] w-full bg-gray-50 flex flex-col justify-center items-center py-8 px-4 pb-safe">
      
      {/* CARTÃO DO FORMULÁRIO:
          w-full: Tenta ocupar 100% do espaço (bom para mobile)
          max-w-[480px]: Trava a largura máxima (perfeito para Desktop/Tablet)
          rounded-3xl: Borda arredondada FORÇADA em todas as telas (Mobile e Desktop)
          shadow-xl: Sombra para dar profundidade
      */}
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Crie sua conta
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Comece a gerenciar sua clínica hoje.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleCadastro)} className="space-y-5" noValidate>
            
            {/* Campo: Nome Completo */}
            <div className="space-y-1">
              <label htmlFor="nome" className="sr-only">Nome Completo</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input 
                  id="nome"
                  type="text" 
                  autoComplete="name"
                  placeholder="Nome Completo"
                  className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all text-gray-900 text-base placeholder:text-gray-400
                    ${errors.nome 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30' 
                      : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                    }`}
                  {...register('nome')}
                  aria-invalid={!!errors.nome}
                />
              </div>
              {errors.nome && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium ml-1 animate-fadeIn">
                  <AlertCircle size={12} /> {errors.nome.message}
                </p>
              )}
            </div>

            {/* Campo: E-mail */}
            <div className="space-y-1">
              <label htmlFor="email" className="sr-only">E-mail profissional</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="E-mail profissional"
                  className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all text-gray-900 text-base placeholder:text-gray-400
                    ${errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30' 
                      : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                    }`}
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium ml-1 animate-fadeIn">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo: Senha */}
            <div className="space-y-1">
              <label htmlFor="senha" className="sr-only">Senha</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Senha"
                  className={`block w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all text-gray-900 text-base placeholder:text-gray-400
                    ${errors.senha 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30' 
                      : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                    }`}
                  {...register('senha')}
                  aria-invalid={!!errors.senha}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium ml-1 animate-fadeIn">
                  <AlertCircle size={12} /> {errors.senha.message}
                </p>
              )}
            </div>

            {/* Campo: Confirmação */}
            <div className="space-y-1">
              <label htmlFor="confirmacao" className="sr-only">Confirme a senha</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors">
                  <CheckCircle2 size={20} />
                </div>
                <input 
                  id="confirmacao"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirme a senha"
                  className={`block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all text-gray-900 text-base placeholder:text-gray-400
                    ${errors.confirmacao 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30' 
                      : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                    }`}
                  {...register('confirmacao')}
                  aria-invalid={!!errors.confirmacao}
                />
              </div>
              {errors.confirmacao && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium ml-1 animate-fadeIn">
                  <AlertCircle size={12} /> {errors.confirmacao.message}
                </p>
              )}
            </div>

            {/* Termos */}
            <div className="pt-2">
              <label className="flex items-start gap-3 relative cursor-pointer group">
                <div className="flex items-center h-6">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
                    {...register('termos')}
                  />
                </div>
                <span className="text-sm text-gray-600 leading-tight select-none">
                  Li e aceito os <Link to="/termos" className="text-primary font-semibold hover:underline p-1 -m-1 relative z-10">Termos de Uso</Link> e a <Link to="/privacidade" className="text-primary font-semibold hover:underline p-1 -m-1 relative z-10">Política de Privacidade</Link>.
                </span>
              </label>
              {errors.termos && (
                <p className="text-xs text-red-500 mt-2 ml-1 font-medium animate-fadeIn">
                  {errors.termos.message}
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </span>
              ) : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Já tem conta? 
              <Link to="/login" className="text-primary font-bold hover:underline ml-2 p-2">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}