import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2, 
  ArrowRight
} from 'lucide-react';

// === SCHEMA DE VALIDAÇÃO (MANTIDO) ===
const cadastroSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmacao: z.string(),
  termos: z.boolean().refine((val) => val === true, {
    message: 'É necessário aceitar os termos de uso',
  }),
}).refine((data) => data.senha === data.confirmacao, {
  message: "As senhas não coincidem",
  path: ["confirmacao"],
});

type CadastroSchema = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  const { login } = useAuth();
  const { addToast } = useToast();
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

  const handleCadastro = async (data: CadastroSchema) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      login(data.email);
      addToast({
        type: 'success',
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo(a) ao PsiCare.'
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      addToast({
        type: 'error',
        title: 'Erro ao criar conta',
        description: 'Tente novamente mais tarde.'
      });
    }
  };

  return (
    // CONTAINER GLOBAL
    // h-screen: Trava a altura na tela (evita scroll duplo com o body)
    // overflow-hidden: Garante que nada vaze da janela principal
    <div className="flex h-screen w-full bg-white font-sans text-gray-900 overflow-hidden">
      
      {/* === COLUNA ESQUERDA (IMAGEM/DECORATIVA) ===
          hidden lg:flex: Esconde no mobile, flexbox no desktop
          lg:w-1/2: Metade da tela em notebooks (1024px - 1280px)
          xl:w-[60%]: Aumenta a imagem para 60% em monitores maiores, deixando o formulário mais elegante
          relative: Para posicionamento absoluto dos overlays
      */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[60%] h-full bg-primary relative items-center justify-center overflow-hidden">
        {/* Camadas visuais (Fundo, Overlay, Textura) */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-green-800 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40 transition-transform duration-[20s] hover:scale-105" />
        
        {/* Conteúdo Institucional */}
        <div className="relative z-20 text-white p-12 xl:p-20 max-w-2xl text-center lg:text-left">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl">
             <CheckCircle2 size={32} className="text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight drop-shadow-sm">
            Sua clínica, <br className="hidden xl:block" />
            <span className="text-green-100">simplesmente organizada.</span>
          </h2>
          <p className="text-lg text-green-50 mb-8 max-w-md leading-relaxed font-light">
            Junte-se a milhares de psicólogos que transformaram sua gestão com segurança, agilidade e inteligência.
          </p>
          
          {/* Footer Decorativo da Imagem */}
          <div className="flex items-center gap-6 text-sm font-medium text-green-100/80 pt-4 border-t border-white/10">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
              Prontuários
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
              Agenda
            </span>
            
          </div>
        </div>
      </div>

      {/* === COLUNA DIREITA (FORMULÁRIO) ===
          w-full: Mobile usa 100%
          lg:w-1/2: Notebook usa 50%
          xl:w-[40%]: Monitores usam 40% (proporção áurea aproximada)
          overflow-y-auto: HABILITA SCROLL INDEPENDENTE (Crucial para notebooks pequenos)
      */}
      <div className="w-full lg:w-1/2 xl:w-[40%] h-full overflow-y-auto bg-white scroll-smooth custom-scrollbar">
        
        {/* WRAPPER DE CENTRALIZAÇÃO
            min-h-full: Garante que o conteúdo fique centralizado se sobrar espaço
            py-8: Padding menor para notebooks (evita corte do conteúdo)
            xl:py-12: Padding maior para monitores
        */}
        <div className="min-h-full flex flex-col justify-center items-center px-6 py-8 sm:px-12 xl:px-16">
          
          {/* CARD DO FORMULÁRIO (Largura controlada) */}
          <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
            
            {/* Cabeçalho do Form */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Crie sua conta
              </h1>
              <p className="text-gray-500 text-base">
                Preencha seus dados para começar.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleCadastro)} className="space-y-5" noValidate>
              
              {/* Nome */}
              <div className="space-y-1.5">
                <label htmlFor="nome" className="sr-only">Nome</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    id="nome"
                    type="text" 
                    placeholder="Nome Completo"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium
                      ${errors.nome 
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                      }`}
                    {...register('nome')}
                  />
                </div>
                {errors.nome && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1 animate-pulse"><AlertCircleIcon /> {errors.nome.message}</span>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                 <label htmlFor="email" className="sr-only">E-mail</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Mail size={20} />
                  </div>
                  <input 
                    id="email"
                    type="email"
                    placeholder="E-mail profissional"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium
                      ${errors.email 
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                      }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1 animate-pulse"><AlertCircleIcon /> {errors.email.message}</span>}
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label htmlFor="senha" className="sr-only">Senha</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className={`block w-full pl-11 pr-11 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium
                      ${errors.senha 
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                      }`}
                    {...register('senha')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.senha && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1 animate-pulse"><AlertCircleIcon /> {errors.senha.message}</span>}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-1.5">
                <label htmlFor="confirmacao" className="sr-only">Confirmar Senha</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                  <input 
                    id="confirmacao"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme a senha"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium
                      ${errors.confirmacao 
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'
                      }`}
                    {...register('confirmacao')}
                  />
                </div>
                {errors.confirmacao && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1 animate-pulse"><AlertCircleIcon /> {errors.confirmacao.message}</span>}
              </div>

              {/* Termos */}
              <div className="pt-2">
                <label className="flex items-start gap-3 relative cursor-pointer group select-none">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-primary checked:bg-primary hover:border-primary"
                      {...register('termos')}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                       <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 leading-tight pt-0.5">
                    Concordo com os <Link to="/termos" className="text-primary font-semibold hover:underline decoration-2">Termos de Uso</Link> e <Link to="/privacidade" className="text-primary font-semibold hover:underline decoration-2">Privacidade</Link>.
                  </span>
                </label>
                {errors.termos && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.termos.message}</p>}
              </div>

              {/* Botão */}
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <span>Criar Conta</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Já possui uma conta? 
                <Link to="/login" className="text-primary font-bold hover:underline ml-2 transition-colors">
                  Fazer Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pequeno helper para ícone de erro (opcional, pode ser importado do lucide se preferir)
function AlertCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}