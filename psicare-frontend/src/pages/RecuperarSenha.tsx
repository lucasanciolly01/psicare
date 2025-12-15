import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Schema de validação
const recoverSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Digite um e-mail válido'),
});

type RecoverFormData = z.infer<typeof recoverSchema>;

export default function RecuperarSenha() {
  const { addToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
  });

  const onSubmit = async (data: RecoverFormData) => {
    setIsLoading(true);
    // Simulação de chamada API (já que não podemos alterar o backend)
    // Aqui entraria: await authService.recoverPassword(data.email);
    console.log('Solicitação de recuperação para:', data.email);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'E-mail enviado',
        description: 'Verifique sua caixa de entrada.',
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-surface font-sans text-secondary-900">
      
      {/* === COLUNA ESQUERDA (Visual Sticky) === */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] sticky top-0 h-screen items-center justify-center overflow-hidden bg-secondary-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-secondary-950 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555617985-6d6da2018873?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 animate-scale-in duration-[3s]" />
        
        <div className="relative z-20 p-16 max-w-2xl text-center lg:text-left">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
             <KeyRound size={32} className="text-primary-300" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Recuperação de <br />
            <span className="text-primary-400">Acesso Seguro.</span>
          </h2>
          <p className="text-lg text-secondary-300 mb-8 max-w-md leading-relaxed font-light">
            Não se preocupe. Ajudamos-te a recuperar o acesso aos seus prontuários e agenda em poucos passos.
          </p>
        </div>
      </div>

      {/* === COLUNA DIREITA (Conteúdo) === */}
      <div className="w-full lg:w-1/2 xl:w-[45%] bg-surface flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 xl:px-20">
          <div className="w-full max-w-[400px] animate-fade-in">
            
            {/* Header Mobile/Desktop */}
            <div className="mb-8">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-secondary-500 hover:text-primary-600 transition-colors mb-6 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Voltar para Login
              </Link>
              
              {!isSubmitted ? (
                <>
                  <h1 className="text-3xl font-bold tracking-tight text-secondary-900 mb-2">Esqueceu a senha?</h1>
                  <p className="text-secondary-500 font-medium">
                    Digite seu e-mail cadastrado e enviaremos um link para redefinir suas credenciais.
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-secondary-900 mb-2">Verifique seu e-mail</h1>
                  <p className="text-secondary-500 font-medium">
                    Enviamos as instruções de recuperação para o endereço informado.
                  </p>
                </div>
              )}
            </div>

            {/* Formulário */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary-700 ml-1 uppercase tracking-wide">E-mail Profissional</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input 
                      type="email"
                      placeholder="seu@email.com"
                      className={`block w-full pl-11 pr-4 py-3.5 bg-secondary-50 border rounded-xl outline-none transition-all text-sm sm:text-base font-medium placeholder:text-secondary-400
                        ${errors.email 
                          ? 'border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-100' 
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white'
                        }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 font-bold ml-1 mt-1">{errors.email.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-200 disabled:text-secondary-400 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Link de Recuperação</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-secondary-50 hover:bg-secondary-100 text-secondary-700 border border-secondary-200 py-3.5 rounded-xl font-bold text-sm transition-all"
                >
                  Tentar outro e-mail
                </button>
                <p className="text-xs text-center text-secondary-400">
                  Não recebeu? Verifique sua caixa de spam ou tente novamente em alguns minutos.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Mobile/Desktop */}
        <div className="py-6 text-center text-xs text-secondary-400 border-t border-secondary-100/50">
          &copy; {new Date().getFullYear()} PsiCare. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}