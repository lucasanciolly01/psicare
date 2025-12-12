import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      navigate('/');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex bg-white lg:bg-gray-50">
      
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-8 lg:p-16 bg-white">
        <div className="w-full max-w-md mx-auto flex flex-col h-full lg:h-auto justify-center">
          
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight">💚 PsiCare</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bem-vindo(a)!</h2>
            <p className="text-gray-500 mt-2 text-base">Acesse sua conta para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input 
                  type="email" 
                  // text-base impede zoom no iOS
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 text-base shadow-sm"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Senha</label>
                <Link to="/recuperar-senha" className="text-sm text-primary font-bold hover:underline">Esqueceu?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 text-base shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 active:scale-95 text-base mt-4 hover:-translate-y-0.5">
              Entrar na Plataforma <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline ml-1">Cadastre-se</Link>
          </p>
        </div>
      </div>

      {/* Lado Direito - Imagem (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Consultório" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="relative z-20 p-20 text-white max-w-xl">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Gestão simplificada para sua clínica.</h2>
          <p className="text-lg text-green-50/90 leading-relaxed">
            Organize pacientes, prontuários e sua agenda em um único lugar seguro e acessível.
          </p>
        </div>
      </div>
    </div>
  );
}