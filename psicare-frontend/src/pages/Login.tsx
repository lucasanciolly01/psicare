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

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/* =========================
   ZOD SCHEMA (SEGURANÇA)
========================= */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Erro no login', error);
    } finally {
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

      {/* === COLUNA DIREITA === */}
      <div className="w-full lg:w-1/2 xl:w-[40%] h-full overflow-y-auto bg-white">
        <div className="min-h-full flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[420px] space-y-8">

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">PsiCare</h1>
              <h2 className="text-2xl font-bold">Acesse sua conta</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* SENHA */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">
                    Senha
                  </label>

                  {/* ✅ LINK ACESSÍVEL (SEM tabIndex) */}
                  <Link
                    to="/recuperar-senha"
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Não tem conta?
              <Link to="/cadastro" className="text-primary font-bold ml-2">
                Cadastre-se
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
