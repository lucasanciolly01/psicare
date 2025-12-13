import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2 
} from 'lucide-react';

// CORREÇÃO 1: Alterado para 'export function' (Nomeada) para facilitar o import no App.tsx
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Simula um delay para UX (sensação de processamento)
      await new Promise(resolve => setTimeout(resolve, 800));
      login(email);
      navigate('/');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-gray-900 overflow-hidden">
      
      {/* === COLUNA ESQUERDA (IMAGEM/BRANDING) === */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[60%] h-full bg-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-green-900 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-transform duration-[20s] hover:scale-105" />
        
        <div className="relative z-20 text-white p-12 xl:p-20 max-w-2xl">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl">
             <LogIn size={32} className="text-white" />
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight drop-shadow-sm">
            Bem-vindo de volta.
          </h2>
          <p className="text-lg text-green-50 mb-8 max-w-lg leading-relaxed font-light">
            Acesse sua área de gestão e continue transformando a vida dos seus pacientes com organização e segurança.
          </p>

          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-primary font-bold">
              +2k
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Profissionais ativos</p>
              <p className="text-xs text-green-100">Confiam no PsiCare diariamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* === COLUNA DIREITA (FORMULÁRIO) === */}
      <div className="w-full lg:w-1/2 xl:w-[40%] h-full overflow-y-auto bg-white scroll-smooth custom-scrollbar">
        
        <div className="min-h-full flex flex-col justify-center items-center px-6 py-8 sm:px-12 xl:px-16">
          
          <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
            
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">PsiCare</h1>
              <h2 className="text-2xl font-bold text-gray-900">Acesse sua conta</h2>
              <p className="text-gray-500 text-base">
                Digite suas credenciais para entrar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Campo E-mail */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">E-mail</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email" 
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-gray-700">Senha</label>
                  {/* CORREÇÃO 2: tabindex -> tabIndex={-1} (padrão React) */}
                  <Link 
                    to="/recuperar-senha" 
                    tabIndex={-1} 
                    className="text-xs sm:text-sm text-primary font-semibold hover:underline hover:text-green-700 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Botão de Submit */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Não tem uma conta? 
                <Link to="/cadastro" className="text-primary font-bold hover:underline ml-2 transition-colors">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}