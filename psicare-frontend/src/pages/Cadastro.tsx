import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

const cadastroSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Formato de e-mail inválido"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmacao: z.string(),
    termos: z.boolean().refine((val) => val === true, {
      message: "É necessário aceitar os termos de uso",
    }),
  })
  .refine((data) => data.senha === data.confirmacao, {
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
    formState: { errors, isSubmitting },
  } = useForm<CadastroSchema>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { termos: false },
  });

  const handleCadastro = async (data: CadastroSchema) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login(data.email, data.senha);
      addToast({
        type: "success",
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao PsiCare.",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      addToast({
        type: "error",
        title: "Erro ao criar conta",
        description: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-surface font-sans text-secondary-900">
      {/* === COLUNA ESQUERDA (IMAGEM/BRANDING) === */}
      {/* CORREÇÃO: Removido 'relative', mantido apenas 'sticky' */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] sticky top-0 h-screen items-center justify-center overflow-hidden bg-secondary-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-secondary-950 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 animate-scale-in duration-[3s]" />

        <div className="relative z-20 p-16 max-w-2xl text-center lg:text-left">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
            <CheckCircle2 size={32} className="text-primary-300" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Sua prática, <br className="hidden xl:block" />
            <span className="text-primary-400">elevada ao próximo nível.</span>
          </h2>
          <p className="text-lg text-secondary-300 mb-8 max-w-md leading-relaxed font-light">
            Junte-se à plataforma escolhida por profissionais que valorizam
            organização, segurança e tempo de qualidade.
          </p>

          <div className="flex items-center gap-6 text-sm font-medium text-secondary-400/80 pt-6 border-t border-white/10 justify-center lg:justify-start">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
              Prontuários Criptografados
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
              Agenda Inteligente
            </span>
          </div>
        </div>
      </div>

      {/* === COLUNA DIREITA (FORMULÁRIO) === */}
      <div className="w-full lg:w-1/2 xl:w-[45%] bg-surface flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 xl:px-20">
          <div className="w-full max-w-[440px] space-y-8 animate-fade-in">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-secondary-900">
                Criar Conta
              </h1>
              <p className="text-secondary-500 font-medium">
                Preencha os dados abaixo para começar gratuitamente.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleCadastro)}
              className="space-y-5"
              noValidate
            >
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary-700 ml-1 uppercase tracking-wide">
                  Nome Completo
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-secondary-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium placeholder:text-secondary-400
                      ${
                        errors.nome
                          ? "border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-100"
                          : "border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white"
                      }`}
                    {...register("nome")}
                  />
                </div>
                {errors.nome && (
                  <p className="text-xs text-rose-500 font-bold ml-1 mt-1">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary-700 ml-1 uppercase tracking-wide">
                  E-mail Profissional
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-secondary-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium placeholder:text-secondary-400
                      ${
                        errors.email
                          ? "border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-100"
                          : "border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white"
                      }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 font-bold ml-1 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary-700 ml-1 uppercase tracking-wide">
                    Senha
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className={`block w-full pl-11 pr-10 py-3.5 bg-secondary-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium placeholder:text-secondary-400
                        ${
                          errors.senha
                            ? "border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-100"
                            : "border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white"
                        }`}
                      {...register("senha")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary-700 ml-1 uppercase tracking-wide">
                    Confirmar
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                      <CheckCircle2 size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className={`block w-full pl-11 pr-10 py-3.5 bg-secondary-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium placeholder:text-secondary-400
                        ${
                          errors.confirmacao
                            ? "border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-100"
                            : "border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white"
                        }`}
                      {...register("confirmacao")}
                    />
                  </div>
                </div>
                {/* Erro de senha/confirmação global */}
                {(errors.senha || errors.confirmacao) && (
                  <p className="text-xs text-rose-500 font-bold col-span-2 ml-1">
                    Verifique sua senha e confirmação.
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-primary-600 hover:underline"
                >
                  {showPassword ? "Ocultar Senhas" : "Mostrar Senhas"}
                </button>
              </div>

              {/* Termos */}
              <div className="pt-2">
                <label className="flex items-start gap-3 relative cursor-pointer group select-none">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-secondary-300 shadow-sm transition-all checked:border-primary-600 checked:bg-primary-600 hover:border-primary-500"
                      {...register("termos")}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-secondary-500 leading-tight">
                    Li e concordo com os{" "}
                    <Link
                      to="/termos"
                      className="text-primary-600 font-bold hover:underline"
                    >
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link
                      to="/privacidade"
                      className="text-primary-600 font-bold hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </label>
                {errors.termos && (
                  <p className="text-xs text-rose-500 mt-2 ml-1 font-bold">
                    {errors.termos.message}
                  </p>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-200 disabled:text-secondary-400 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>Criar Minha Conta</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 pb-6">
              <p className="text-sm text-secondary-600 font-medium">
                Já é parceiro PsiCare?
                <Link
                  to="/login"
                  className="text-primary-600 font-bold hover:underline ml-1.5 transition-colors"
                >
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