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
    // Container Principal: min-h-screen permite que o conteúdo cresça se necessário
    <div className="min-h-[100dvh] w-full flex bg-white lg:bg-gray-50">
      
      {/* Lado Esquerdo - Formulário */}
      {/* MUDANÇA 1: justify-center para centralizar verticalmente, mas 'py-12' para dar ar */}
      {/* MUDANÇA 2: 'pb-40' no mobile. Isso é uma margem de segurança gigante contra a barra do Safari */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:p-16 bg-white pb-40 lg:pb-12">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-primary mb-3">💚 PsiCare</h1>
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h2>
            <p className="text-gray-500 mt-2">Insira seus dados para acessar sua conta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Senha</label>
                <Link to="/recuperar-senha" className="text-sm text-primary font-bold hover:underline">Esqueceu a senha?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 active:scale-95 text-base mt-2">
              Entrar na Plataforma <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se gratuitamente</Link>
          </p>
        </div>
      </div>

      {/* Lado Direito - Imagem (Mantido igual) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-50 to-green-100 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Consultório" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-16 text-white max-w-xl">
          <h2 className="text-5xl font-bold mb-6 drop-shadow-md leading-tight">Gerencie sua clínica com tranquilidade.</h2>
          <p className="text-xl text-white/90 drop-shadow-md leading-relaxed">
            Organize pacientes, agendamentos e prontuários em um só lugar, de forma segura e eficiente.
          </p>
        </div>
      </div>
    </div>
  );
}