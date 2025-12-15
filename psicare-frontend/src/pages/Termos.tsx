import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Termos() {
  return (
    <div className="min-h-screen bg-surface font-sans text-secondary-900">
      
      {/* Header Simples */}
      <header className="bg-white border-b border-secondary-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            to="/cadastro" 
            className="flex items-center gap-2 text-sm font-bold text-secondary-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Voltar
          </Link>
          <div className="flex items-center gap-2 text-secondary-900 font-bold">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
               <FileText size={18} />
            </div>
            PsiCare Legal
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 tracking-tight">Termos de Uso</h1>
          <p className="text-lg text-secondary-500 max-w-2xl leading-relaxed">
            Por favor, leia atentamente as condições abaixo antes de utilizar a plataforma PsiCare para gestão do seu consultório.
          </p>
          <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest pt-2">
            Última atualização: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Conteúdo do Texto */}
        <article className="prose prose-slate prose-lg max-w-none text-secondary-700">
          <div className="space-y-10">
            
            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">1. Aceitação dos Termos</h3>
              <p className="leading-relaxed">
                Ao criar uma conta e acessar o PsiCare, você concorda expressamente com estes termos. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços. O uso contínuo da plataforma constitui aceitação de quaisquer alterações futuras.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">2. Privacidade e Dados (LGPD)</h3>
              <p className="leading-relaxed">
                Nós levamos a privacidade a sério. O PsiCare atua em conformidade com a Lei Geral de Proteção de Dados (LGPD). Todos os prontuários e dados de pacientes inseridos na plataforma são de propriedade exclusiva do profissional de saúde e são armazenados com criptografia de ponta a ponta.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">3. Responsabilidades do Profissional</h3>
              <p className="leading-relaxed">
                Você é responsável por manter a confidencialidade de suas credenciais de acesso. O PsiCare não se responsabiliza por acessos não autorizados decorrentes de compartilhamento de senhas ou negligência na segurança do dispositivo do usuário. É de sua responsabilidade garantir que as informações inseridas nos prontuários sejam precisas e éticas.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">4. Disponibilidade do Serviço</h3>
              <p className="leading-relaxed">
                Nos esforçamos para manter a plataforma disponível 99,9% do tempo. No entanto, interrupções programadas para manutenção ou falhas imprevistas podem ocorrer. O PsiCare não será responsável por quaisquer danos decorrentes da indisponibilidade temporária do serviço.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">5. Cancelamento</h3>
              <p className="leading-relaxed">
                Você pode encerrar sua conta a qualquer momento através das configurações do perfil. Ao solicitar o cancelamento, você terá um prazo de 30 dias para exportar seus dados antes que eles sejam permanentemente excluídos de nossos servidores.
              </p>
            </section>

          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-secondary-100 text-center">
          <p className="text-sm text-secondary-500 mb-4">Ainda tem dúvidas sobre nossos termos?</p>
          <a href="mailto:legal@psicare.com" className="inline-flex items-center justify-center px-6 py-3 border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 transition-colors text-sm">
            Entrar em contato com o Jurídico
          </a>
        </div>
      </main>
    </div>
  );
}