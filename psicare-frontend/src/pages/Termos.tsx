import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Termos() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <Link to="/cadastro" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
        <p className="text-gray-500 mb-8">Última atualização: 29 de outubro de 2025</p>

        <div className="prose prose-green max-w-none text-gray-700 space-y-6">
          <p>Bem-vindo(a) à <span className="font-bold text-primary">PsiCare</span>. Estes Termos de Uso regulam o acesso e a utilização da plataforma...</p>
          
          <h3 className="text-xl font-bold text-gray-900">1. Objeto</h3>
          <p>A PsiCare é uma ferramenta online voltada exclusivamente a profissionais de psicologia...</p>

          <h3 className="text-xl font-bold text-gray-900">2. Responsabilidade sobre os Dados</h3>
          <p>O profissional usuário é o único responsável pelo conteúdo e pela veracidade das informações inseridas...</p>
          
          {/* Adicione o restante do seu texto original aqui */}
        </div>
      </div>
    </div>
  );
}