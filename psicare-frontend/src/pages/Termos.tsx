import {
  ArrowLeft,
  FileText,
  Scale,
  Server,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Termos() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-surface font-sans text-secondary-900">
      {/* Header Institucional Fixo */}
      <header className="bg-white/90 backdrop-blur-md border-b border-secondary-100 sticky top-0 z-30 transition-all">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/cadastro"
            className="group flex items-center gap-2 text-sm font-bold text-secondary-500 hover:text-primary-600 transition-colors"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-primary-50 transition-colors">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </div>
            <span>Voltar ao Cadastro</span>
          </Link>

          <div className="flex items-center gap-2.5 text-secondary-900 font-bold select-none">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
              <FileText size={18} />
            </div>
            <span className="hidden sm:inline">PsiCare Legal</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 animate-fade-in">
        {/* Cabeçalho do Documento */}
        <div className="mb-12 border-b border-secondary-100 pb-8">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary-700 uppercase bg-primary-50 rounded-full border border-primary-100">
            Termos e Condições
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 tracking-tight mb-4 leading-tight">
            Termos de Uso da Plataforma
          </h1>
          <p className="text-lg text-secondary-500 max-w-2xl leading-relaxed">
            Estabelecemos aqui os direitos e deveres para a utilização do
            software de gestão clínica PsiCare. A transparência é a base da
            nossa relação.
          </p>
          <p className="mt-6 text-xs font-bold text-secondary-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Vigência: {currentYear}
          </p>
        </div>

        {/* Corpo do Texto Jurídico */}
        <div className="space-y-12 text-secondary-700 leading-relaxed text-base md:text-lg">
          {/* Seção 1 */}
          <section className="scroll-mt-24" id="aceitacao">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                1
              </span>
              Aceitação dos Termos
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Ao criar uma conta, acessar ou utilizar a plataforma{" "}
                <strong>PsiCare</strong>, você (doravante denominado "Usuário"
                ou "Profissional") concorda, de forma livre e expressa, com
                estes Termos de Uso.
              </p>
              <p className="text-secondary-500 text-sm italic border-l-4 border-primary-200 pl-4 py-1">
                Caso não concorde com quaisquer disposições deste instrumento,
                pedimos que não utilize nossos serviços. A continuidade no uso
                da plataforma será considerada como aceitação integral.
              </p>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="scroll-mt-24" id="responsabilidade">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                2
              </span>
              Uso Responsável e Credenciais
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                O acesso à plataforma é pessoal e intransferível. O Profissional
                é o único responsável pela segurança e confidencialidade de suas
                credenciais de acesso (login e senha).
              </p>
              <ul className="list-disc list-outside space-y-2 pl-5 marker:text-primary-500">
                <li>
                  O Usuário deve notificar imediatamente o PsiCare sobre
                  qualquer uso não autorizado de sua conta.
                </li>
                <li>
                  É vedado o compartilhamento de acesso com terceiros não
                  autorizados.
                </li>
                <li>
                  O Profissional declara estar devidamente habilitado junto ao
                  seu respectivo Conselho Regional para o exercício da
                  profissão.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="scroll-mt-24" id="privacidade">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                3
              </span>
              Dados, Prontuários e LGPD
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                O PsiCare atua em estrita conformidade com a{" "}
                <strong>
                  Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
                </strong>
                . Para fins legais, estabelece-se a seguinte distinção:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-secondary-50 p-4 rounded-xl border border-secondary-100">
                  <h4 className="font-bold text-secondary-900 flex items-center gap-2 mb-2">
                    <UserCheck size={16} className="text-primary-600" />{" "}
                    Controlador
                  </h4>
                  <p className="text-sm">
                    O <strong>Profissional</strong> é o Controlador dos dados de
                    saúde inseridos (prontuários, anotações, histórico). Você
                    decide o que coletar e como utilizar esses dados no contexto
                    clínico.
                  </p>
                </div>
                <div className="bg-secondary-50 p-4 rounded-xl border border-secondary-100">
                  <h4 className="font-bold text-secondary-900 flex items-center gap-2 mb-2">
                    <Server size={16} className="text-primary-600" /> Operador
                  </h4>
                  <p className="text-sm">
                    O <strong>PsiCare</strong> atua como Operador, fornecendo a
                    infraestrutura segura, criptografada e disponível para o
                    armazenamento e gestão dessas informações.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="scroll-mt-24" id="disponibilidade">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                4
              </span>
              Disponibilidade e Suporte
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Empregamos as melhores tecnologias de mercado para garantir uma
                disponibilidade ("uptime") de 99,9%. No entanto, o Usuário
                reconhece que:
              </p>
              <p>
                Podem ocorrer interrupções temporárias para manutenção
                programada, atualizações de segurança ou falhas de força maior
                alheias ao nosso controle. O PsiCare não se responsabiliza por
                eventuais danos decorrentes da indisponibilidade momentânea do
                serviço, embora nos comprometamos a restabelecê-lo com a máxima
                urgência.
              </p>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="scroll-mt-24" id="propriedade">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                5
              </span>
              Propriedade Intelectual
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Todos os direitos sobre o design, código-fonte, marca, logotipos
                e funcionalidades da plataforma PsiCare são de propriedade
                exclusiva da nossa empresa. O uso da plataforma não confere ao
                Usuário qualquer direito de propriedade intelectual sobre a
                mesma, sendo concedida apenas uma licença de uso revogável, não
                exclusiva e intransferível.
              </p>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="scroll-mt-24" id="cancelamento">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                6
              </span>
              Cancelamento e Rescisão
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                O Usuário pode solicitar o cancelamento de sua conta a qualquer
                momento através do painel de configurações ou suporte.
              </p>
              <p>
                Em caso de cancelamento, garantimos ao Profissional um prazo de
                30 (trinta) dias para a exportação de todos os dados de seus
                pacientes (Portabilidade de Dados), após o qual os dados poderão
                ser permanentemente excluídos de nossos servidores ativos,
                mantendo-se apenas backups legais obrigatórios.
              </p>
            </div>
          </section>
        </div>

        {/* Footer da Página */}
        <div className="mt-16 pt-10 border-t border-secondary-100">
          <div className="bg-secondary-50 rounded-2xl p-8 text-center border border-secondary-100">
            <Scale size={32} className="mx-auto text-secondary-400 mb-4" />
            <h3 className="text-lg font-bold text-secondary-900 mb-2">
              Dúvidas Jurídicas?
            </h3>
            <p className="text-secondary-500 text-sm mb-6 max-w-md mx-auto">
              Se você tiver dúvidas sobre a interpretação destes termos ou sobre
              suas responsabilidades ao usar a plataforma, entre em contato.
            </p>
            <a
              href="mailto:juridico@psicare.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 hover:border-secondary-300 transition-all shadow-sm text-sm"
            >
              Contatar Departamento Legal
            </a>
          </div>
          <p className="text-center text-xs text-secondary-400 mt-8">
            PsiCare © {currentYear} • Todos os direitos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}
