export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
          <p className="text-sm text-gray-500 mb-10">Última atualização: 23 de agosto de 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Introdução</h2>
              <p>
                A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o Moncoy Finance
                coleta, utiliza e protege suas informações ao utilizar nossa plataforma web e mobile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Informações que Coletamos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Dados de conta: nome, e-mail, senha (armazenada de forma segura) e preferências de perfil.
                </li>
                <li>
                  Dados financeiros fornecidos por você: transações, categorias, metas e investimentos.
                </li>
                <li>
                  Dados técnicos: endereço IP, tipo de dispositivo, navegador, páginas visitadas e cookies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Como Utilizamos seus Dados</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prestar e melhorar nossos serviços, incluindo funcionalidades de IA.</li>
                <li>Personalizar a experiência, recomendações e relatórios.</li>
                <li>Comunicar atualizações, alertas e mensagens operacionais.</li>
                <li>Cumprir obrigações legais e de segurança.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Cookies e Tecnologias Semelhantes</h2>
              <p>
                Utilizamos cookies para lembrar preferências, manter sessões autenticadas e analisar o uso da
                plataforma. Você pode gerenciar cookies nas configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Compartilhamento de Dados</h2>
              <p>
                Não vendemos seus dados. Podemos compartilhar informações com provedores de serviços (por exemplo,
                infraestrutura, analytics e pagamentos) sob contratos que exigem a proteção adequada dos dados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Segurança</h2>
              <p>
                Adotamos medidas de segurança como criptografia, controles de acesso e políticas de RLS quando
                aplicável. Ainda assim, nenhum método é 100% seguro e recomendamos boas práticas de proteção de conta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Seus Direitos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acessar e corrigir seus dados.</li>
                <li>Solicitar a exclusão da conta e dados, conforme limitações legais.</li>
                <li>Portabilidade e oposição a certos tipos de processamento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Retenção</h2>
              <p>
                Mantemos seus dados apenas pelo tempo necessário para prestação do serviço e cumprimento de obrigações
                legais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política periodicamente. Notificaremos alterações materiais via e-mail ou dentro
                do aplicativo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Contato</h2>
              <p>
                Em caso de dúvidas, entre em contato pelo e-mail suporte@moncoy.app.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
