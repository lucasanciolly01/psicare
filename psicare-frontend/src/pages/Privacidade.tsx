import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  FileKey,
  Server,
  Cookie,
  UserCheck,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Privacidade() {
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
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <span className="hidden sm:inline">Privacidade e Dados</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 animate-fade-in">
        {/* Cabeçalho do Documento */}
        <div className="mb-12 border-b border-secondary-100 pb-8">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 rounded-full border border-emerald-100">
            Proteção de Dados
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 tracking-tight mb-4 leading-tight">
            Política de Privacidade
          </h1>
          <p className="text-lg text-secondary-500 max-w-2xl leading-relaxed">
            A segurança das informações do seu consultório é nossa prioridade.
            Entenda como coletamos, armazenamos e protegemos seus dados e os de
            seus pacientes.
          </p>
          <p className="mt-6 text-xs font-bold text-secondary-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Vigência: {currentYear}
          </p>
        </div>

        {/* Corpo do Texto Jurídico */}
        <div className="space-y-12 text-secondary-700 leading-relaxed text-base md:text-lg">
          {/* Seção 1 */}
          <section className="scroll-mt-24" id="compromisso">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                1
              </span>
              Nosso Compromisso com a LGPD
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                O <strong>PsiCare</strong> está comprometido em resguardar a
                privacidade e proteger os dados pessoais de seus usuários, em
                estrita conformidade com a{" "}
                <strong>
                  Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
                </strong>
                .
              </p>
              <p>
                Esta política descreve as práticas adotadas quanto aos dados
                coletados através de nossa plataforma SaaS (Software as a
                Service) de gestão clínica. Ao utilizar nossos serviços, você
                declara estar ciente e de acordo com as práticas descritas neste
                documento.
              </p>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="scroll-mt-24" id="dados-coletados">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                2
              </span>
              Tipos de Dados Tratados
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Para a prestação eficiente dos nossos serviços, tratamos duas
                categorias principais de dados:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-5 rounded-xl border border-secondary-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-primary-700 font-bold">
                    <UserCheck size={20} />
                    <h3>Dados do Profissional</h3>
                  </div>
                  <p className="text-sm text-secondary-600 leading-relaxed">
                    Informações necessárias para o cadastro e gestão da conta:
                    Nome completo, E-mail, Telefone, CRP (Conselho Regional) e
                    dados de faturamento.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-secondary-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-rose-600 font-bold">
                    <FileKey size={20} />
                    <h3>Dados de Pacientes (Sensíveis)</h3>
                  </div>
                  <p className="text-sm text-secondary-600 leading-relaxed">
                    Dados inseridos pelo profissional no exercício de suas
                    atividades: Prontuários, Evoluções, Anamneses, Histórico de
                    Saúde e Agendamentos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="scroll-mt-24" id="controlador-operador">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                3
              </span>
              Papéis e Responsabilidades
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                É fundamental distinguir as responsabilidades legais sobre os
                dados tratados na plataforma:
              </p>
              <ul className="list-disc list-outside space-y-3 pl-5 marker:text-primary-500">
                <li>
                  <strong>Você (Profissional) é o Controlador:</strong> Cabe a
                  você as decisões referentes ao tratamento dos dados pessoais e
                  sensíveis dos seus pacientes. Você é responsável por obter o
                  consentimento (quando necessário) e garantir a precisão das
                  informações inseridas.
                </li>
                <li>
                  <strong>O PsiCare é o Operador:</strong> Nós realizamos o
                  tratamento dos dados em seu nome, fornecendo a infraestrutura
                  tecnológica segura para armazenamento, organização e acesso,
                  sem utilizar esses dados para fins próprios alheios ao
                  contrato.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="scroll-mt-24" id="finalidade">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                4
              </span>
              Finalidade e Base Legal
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                O tratamento de dados realizado pelo PsiCare tem como bases
                legais a <strong>Execução de Contrato</strong> (prestação do
                serviço de gestão) e o <strong>Legítimo Interesse</strong>{" "}
                (segurança e melhoria da plataforma).
              </p>
              <p>As finalidades incluem:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-secondary-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Gestão de agendamentos e sessões
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Armazenamento seguro de prontuários
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Envio de notificações do sistema
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Suporte técnico e atendimento
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="scroll-mt-24" id="seguranca">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                5
              </span>
              Segurança e Armazenamento
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Adotamos medidas técnicas e administrativas robustas para
                proteger os dados pessoais contra acessos não autorizados e
                situações acidentais ou ilícitas.
              </p>
              <div className="bg-secondary-50 border border-secondary-100 p-6 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="text-primary-600 mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-secondary-900 text-sm">
                      Criptografia
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Todos os dados são transmitidos via protocolos seguros
                      (TLS/SSL) e armazenados com criptografia de ponta em
                      servidores certificados.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Server
                    className="text-primary-600 mt-1 shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="font-bold text-secondary-900 text-sm">
                      Backup e Redundância
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Realizamos backups diários automatizados e mantemos
                      redundância de servidores para garantir a disponibilidade
                      e integridade das informações.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="scroll-mt-24" id="compartilhamento">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                6
              </span>
              Compartilhamento de Dados
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                O PsiCare <strong>não vende, aluga ou comercializa</strong> seus
                dados ou os dados de seus pacientes para terceiros. O
                compartilhamento ocorre estritamente nas seguintes hipóteses:
              </p>
              <ul className="list-disc list-outside space-y-2 pl-5">
                <li>
                  Com fornecedores de infraestrutura tecnológica (servidores em
                  nuvem) que seguem rigorosos padrões de segurança.
                </li>
                <li>
                  Para cumprimento de obrigação legal ou regulatória, mediante
                  ordem judicial.
                </li>
                <li>
                  Para a proteção de direitos do PsiCare em conflitos judiciais
                  ou administrativos.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 7 */}
          <section className="scroll-mt-24" id="cookies">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                7
              </span>
              Cookies e Tecnologias
            </h2>
            <div className="pl-11 space-y-4">
              <div className="flex items-start gap-4">
                <Cookie
                  size={24}
                  className="text-secondary-400 mt-1 shrink-0"
                />
                <p>
                  Utilizamos cookies essenciais para o funcionamento da
                  plataforma (como manutenção da sessão de login) e cookies
                  analíticos anonimizados para entender como o serviço é
                  utilizado e melhorar a experiência do usuário. Você pode
                  gerenciar as preferências de cookies diretamente nas
                  configurações do seu navegador.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 8 */}
          <section className="scroll-mt-24" id="direitos">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                8
              </span>
              Seus Direitos e Contato
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Como titular dos dados, você tem o direito de solicitar a
                confirmação da existência de tratamento, acesso aos dados,
                correção de dados incompletos ou desatualizados, e a
                portabilidade ou exclusão dos dados pessoais, conforme previsto
                na LGPD.
              </p>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta
                Política de Privacidade, entre em contato com nosso Encarregado
                de Proteção de Dados (DPO):
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:dpo@psicare.com"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary-900 text-white rounded-xl font-bold hover:bg-secondary-800 transition-all shadow-lg shadow-secondary-900/20 text-sm"
                >
                  <Mail size={18} />
                  Falar com o DPO
                </a>
                <a
                  href="mailto:suporte@psicare.com"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-secondary-200 rounded-xl text-secondary-700 font-bold hover:bg-secondary-50 transition-all text-sm"
                >
                  Suporte Geral
                </a>
              </div>
            </div>
          </section>

          {/* Seção 9 */}
          <section className="scroll-mt-24" id="alteracoes">
            <h2 className="flex items-center gap-3 text-xl font-bold text-secondary-900 mb-4">
              <span className="flex items-center justify-center w-8 h-8 text-sm bg-secondary-100 text-secondary-600 rounded-lg">
                9
              </span>
              Alterações nesta Política
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente
                para refletir melhorias em nossos serviços ou mudanças na
                legislação. Notificaremos sobre alterações significativas
                através da plataforma ou pelo e-mail cadastrado.
              </p>
            </div>
          </section>
        </div>

        {/* Footer da Página */}
        <div className="mt-16 pt-10 border-t border-secondary-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-50 rounded-full mb-4">
            <Eye size={24} className="text-secondary-400" />
          </div>
          <p className="text-secondary-500 text-sm max-w-md mx-auto mb-8">
            A transparência é a base da confiança. Estamos aqui para apoiar sua
            jornada profissional com segurança.
          </p>
          <p className="text-xs text-secondary-400">
            PsiCare © {currentYear} • Todos os direitos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}
