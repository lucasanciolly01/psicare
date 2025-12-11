// src/pages/Login.tsx
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
    // MUDANÇA 1: Usar min-h-[100dvh] para respeitar a altura real do mobile
    <div className="min-h-[100dvh] w-full flex">
      
      {/* Lado Esquerdo - Formulário */}
      {/* MUDANÇA 2: overflow-y-auto para garantir rolagem em telas muito pequenas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        
        {/* MUDANÇA 3: Adicionado 'pb-24 lg:pb-0'. 
            Isso cria um colchão de segurança no rodapé em mobile, 
            empurrando o texto para cima da barra do Safari/Chrome. */}
        <div className="max-w-md w-full pb-24 lg:pb-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">💚 PsiCare</h1>
            <h2 className="text-2xl font-bold text-gray-800">Bem-vindo de volta!</h2>
            <p className="text-gray-500 mt-2">Insira seus dados para acessar sua conta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Senha</label>
                <Link to="/recuperar-senha" className="text-sm text-primary font-medium hover:underline">Esqueceu a senha?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-green-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Entrar na Plataforma <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se gratuitamente</Link>
          </p>
        </div>
      </div>

      {/* Lado Direito - Imagem/Banner (Mantido igual) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-50 to-green-100 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Consultório" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-12 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-md">Gerencie sua clínica com tranquilidade.</h2>
          <p className="text-lg text-white/90 drop-shadow-md">
            Organize pacientes, agendamentos e prontuários em um só lugar, de forma segura e eficiente.
          </p>
        </div>
      </div>
    </div>
  );
}