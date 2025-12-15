import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* =========================
   ZOD SCHEMA
========================= */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();

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
      await login(data.email, data.password);
    } catch (error) {
      console.error("Erro no login", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-surface font-sans text-secondary-900">
      {/* === COLUNA ESQUERDA (BRANDING & DEPOIMENTO) === */}
      {/* CORREÇÃO: Removido 'relative', mantido apenas 'sticky' */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] sticky top-0 h-screen items-center justify-center overflow-hidden bg-secondary-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-secondary-950 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay opacity-30 animate-scale-in duration-[3s]" />

        <div className="relative z-20 p-16 max-w-2xl flex flex-col justify-between h-full py-20">
          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 backdrop-blur-md border border-primary-400/30 flex items-center justify-center text-primary-300">
                <LogIn size={24} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                PsiCare
              </span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-[1.15]">
              Gestão simplificada para <br />
              <span className="text-primary-400">mentes brilhantes.</span>
            </h2>
            <p className="text-lg text-secondary-300 max-w-md leading-relaxed">
              Organize seus pacientes, agendamentos e prontuários em um único
              lugar seguro e intuitivo.
            </p>
          </div>

          {/* Social Proof / Stats */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex-1">
                <div className="flex items-center gap-2 mb-1 text-primary-300">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Segurança
                  </span>
                </div>
                <p className="text-sm text-secondary-300">
                  Dados criptografados e conformidade com LGPD.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex-1">
                <div className="flex items-center gap-2 mb-1 text-primary-300">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Disponibilidade
                  </span>
                </div>
                <p className="text-sm text-secondary-300">
                  Acesso 24/7 de qualquer dispositivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === COLUNA DIREITA (FORM) === */}
      <div className="w-full lg:w-1/2 xl:w-[45%] bg-surface flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-[400px] space-y-10">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-secondary-900 tracking-tight mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-secondary-500">
                Insira suas credenciais para acessar sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary-700 ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-11 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-secondary-400 font-medium"
                    placeholder="exemplo@psicare.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-rose-500 ml-1 animate-fade-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* SENHA */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-secondary-700">
                    Senha
                  </label>

                  <Link
                    to="/recuperar-senha"
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <div className="relative group">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-11 pr-11 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-secondary-400 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 p-1 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs font-medium text-rose-500 ml-1 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary-700 active:bg-primary-800 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-secondary-500">
                Ainda não tem uma conta?
                <Link
                  to="/cadastro"
                  className="text-primary-600 font-bold ml-1.5 hover:text-primary-700 hover:underline transition-colors"
                >
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Mobile/Desktop */}
        <div className="py-6 text-center text-xs text-secondary-400 border-t border-secondary-100/50">
          &copy; {new Date().getFullYear()} PsiCare. Todos os direitos
          reservados.
        </div>
      </div>
    </div>
  );
}
