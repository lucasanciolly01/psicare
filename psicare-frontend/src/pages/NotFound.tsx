import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center animate-fade-in">
      
      {/* Ilustração Visual */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-secondary-100 rotate-3 transition-transform hover:rotate-0 duration-300">
          <FileQuestion size={64} className="text-primary-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Conteúdo de Texto */}
      <div className="max-w-md space-y-4">
        <h1 className="text-8xl font-bold text-primary-200 tracking-tighter leading-none select-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">
          Página não encontrada
        </h2>
        <p className="text-secondary-500 font-medium leading-relaxed">
          Parece que o link que tentou aceder não existe, foi removido ou está temporariamente indisponível.
        </p>
      </div>

      {/* Ações */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button 
          onClick={() => window.history.back()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        
        <Link 
          to="/"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
        >
          <Home size={18} />
          Início
        </Link>
      </div>

      <p className="mt-12 text-xs text-secondary-400 font-medium">
        Erro: PAGE_NOT_FOUND • PsiCare System
      </p>
    </div>
  );
}