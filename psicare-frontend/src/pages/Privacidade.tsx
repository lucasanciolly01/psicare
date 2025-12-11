import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Privacidade() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
        
        <Link to="/cadastro" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 mb-8">Em conformidade com a LGPD (Lei Geral de Proteção de Dados)</p>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Coleta de Dados</h3>
            <p>
              Coletamos apenas os dados estritamente necessários para o funcionamento da plataforma (Nome, Email, Telefone e CRP).
              Dados sensíveis de pacientes são criptografados.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. Armazenamento</h3>
            <p>
              Seus dados são armazenados em servidores seguros com backups diários. Não compartilhamos informações com terceiros 
              sem seu consentimento explícito.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Seus Direitos</h3>
            <p>
              Você pode solicitar a exclusão ou exportação dos seus dados a qualquer momento através do painel de controle ou suporte.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}