import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function Privacidade() {
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
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <ShieldCheck size={18} />
            </div>
            Privacidade
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wide mb-2">
            <Lock size={12} /> Dados Protegidos
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-lg text-secondary-500 max-w-2xl leading-relaxed">
            Entenda como coletamos, usamos e protegemos as informações sensíveis
            do seu consultório e de seus pacientes.
          </p>
        </div>

        {/* Conteúdo */}
        <article className="prose prose-slate prose-lg max-w-none text-secondary-700">
          <div className="space-y-10">
            <section className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
              <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Coleta de Informações
              </h3>
              <p className="text-sm leading-relaxed mb-0">
                Coletamos apenas as informações necessárias para a prestação dos
                serviços de gestão clínica. Isso inclui dados cadastrais do
                profissional (Nome, CRP, Contato) e os dados inseridos por você
                referentes aos seus pacientes (Prontuários, Evoluções,
                Agendamentos).{" "}
                <strong>
                  Nós não utilizamos os dados dos seus pacientes para fins
                  publicitários.
                </strong>
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
              <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Uso das Informações
              </h3>
              <p className="text-sm leading-relaxed mb-0">
                As informações são utilizadas estritamente para:
                <br />• Fornecer e manter o serviço PsiCare;
                <br />• Notificá-lo sobre alterações no serviço;
                <br />• Permitir que você gerencie seus agendamentos e
                pacientes;
                <br />• Fornecer suporte ao cliente.
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
              <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Segurança dos Dados
              </h3>
              <p className="text-sm leading-relaxed mb-0">
                A segurança dos seus dados é nossa prioridade máxima. Utilizamos
                protocolos SSL/TLS para transmissão de dados e criptografia
                AES-256 para armazenamento em repouso. Nossos bancos de dados
                são isolados e possuem backups diários automáticos para prevenir
                perda de informações.
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
              <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                Seus Direitos
              </h3>
              <p className="text-sm leading-relaxed mb-0">
                O PsiCare respeita seus direitos garantidos pela LGPD. Você tem
                o direito de solicitar o acesso, correção ou exclusão de seus
                dados pessoais a qualquer momento. Para dados de pacientes,
                fornecemos ferramentas para que você possa exportá-los ou
                excluí-los conforme a necessidade do seu consultório.
              </p>
            </section>
          </div>
        </article>

        <div className="mt-12 text-center">
          <p className="text-xs text-secondary-400">
            DPO (Data Protection Officer) Contato:{" "}
            <span className="font-bold text-secondary-600">
              dpo@psicare.com
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
