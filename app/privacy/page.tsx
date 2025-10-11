"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Calendar, Lock, Eye, Database, FileX, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-900 dark:via-background dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Moncoy</h1>
            <p className="text-muted-foreground">Gestão Financeira Inteligente</p>
          </div>
          <div className="w-[80px]"></div> {/* Spacer for centering */}
        </div>

        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Política de Privacidade</CardTitle>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>Última atualização: 10 de outubro de 2025</span>
              </div>
              <div className="flex justify-center mt-3">
                <Badge variant="secondary" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Conforme LGPD (Lei 13.709/2018)
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Introdução */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                1. Introdução
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Moncoy respeita e protege a privacidade de todos os usuários. Esta Política de Privacidade 
                explica como coletamos, usamos, compartilhamos e protegemos suas informações pessoais, 
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e demais 
                legislações aplicáveis.
              </p>
            </section>

            <Separator />

            {/* Definições LGPD */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">2. Definições Importantes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 text-muted-foreground text-sm">
                  <p><strong className="text-foreground">Dados Pessoais:</strong> Informações que identificam ou tornam identificável uma pessoa natural.</p>
                  <p><strong className="text-foreground">Titular:</strong> Pessoa natural a quem se referem os dados pessoais.</p>
                  <p><strong className="text-foreground">Controlador:</strong> Moncoy, responsável pelas decisões sobre o tratamento.</p>
                </div>
                <div className="space-y-3 text-muted-foreground text-sm">
                  <p><strong className="text-foreground">Tratamento:</strong> Operação com dados pessoais (coleta, uso, armazenamento, etc.).</p>
                  <p><strong className="text-foreground">Anonimização:</strong> Processo de tornar dados não identificáveis.</p>
                  <p><strong className="text-foreground">Consentimento:</strong> Autorização livre, informada e inequívoca.</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Dados Coletados */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <Database className="h-5 w-5 mr-2" />
                3. Dados Pessoais Coletados
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Dados de Identificação</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Telefone (opcional)</li>
                    <li>Data de nascimento (opcional)</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Dados Financeiros</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                    <li>Transações financeiras inseridas pelo usuário</li>
                    <li>Categorias de gastos e receitas</li>
                    <li>Metas financeiras e orçamentos</li>
                    <li>Informações sobre investimentos</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Dados Técnicos</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                    <li>Endereço IP</li>
                    <li>Tipo de dispositivo e navegador</li>
                    <li>Dados de localização (se autorizado)</li>
                    <li>Cookies e identificadores únicos</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Base Legal e Finalidades */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">4. Base Legal e Finalidades do Tratamento</h2>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border border-muted-foreground/20 rounded-lg">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 border-b border-muted-foreground/20 font-semibold">Finalidade</th>
                        <th className="text-left p-3 border-b border-muted-foreground/20 font-semibold">Base Legal</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="p-3 border-b border-muted-foreground/10">Prestação do serviço de gestão financeira</td>
                        <td className="p-3 border-b border-muted-foreground/10">Execução de contrato</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b border-muted-foreground/10">Personalização e melhoria da experiência</td>
                        <td className="p-3 border-b border-muted-foreground/10">Legítimo interesse</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b border-muted-foreground/10">Comunicações promocionais</td>
                        <td className="p-3 border-b border-muted-foreground/10">Consentimento</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b border-muted-foreground/10">Cumprimento de obrigações legais</td>
                        <td className="p-3 border-b border-muted-foreground/10">Obrigação legal</td>
                      </tr>
                      <tr>
                        <td className="p-3">Segurança e prevenção à fraude</td>
                        <td className="p-3">Legítimo interesse</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <Separator />

            {/* Compartilhamento */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">5. Compartilhamento de Dados</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium text-foreground">Não vendemos nem alugamos seus dados pessoais.</p>
                <p>Compartilhamos dados apenas nas seguintes situações:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong className="text-foreground">Prestadores de serviço:</strong> Provedores de infraestrutura, pagamento e analytics (com contratos de proteção)</li>
                  <li><strong className="text-foreground">Cumprimento legal:</strong> Quando exigido por lei ou autoridades competentes</li>
                  <li><strong className="text-foreground">Proteção de direitos:</strong> Para proteção dos nossos direitos, propriedade ou segurança</li>
                  <li><strong className="text-foreground">Transferência de negócio:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Seus Direitos */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">6. Seus Direitos como Titular de Dados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Eye className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Acesso</p>
                      <p className="text-sm text-muted-foreground">Confirmar a existência e acessar seus dados</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileX className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Exclusão</p>
                      <p className="text-sm text-muted-foreground">Solicitar a eliminação de dados desnecessários</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Database className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Portabilidade</p>
                      <p className="text-sm text-muted-foreground">Solicitar a transferência de dados para outro fornecedor</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Lock className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Correção</p>
                      <p className="text-sm text-muted-foreground">Corrigir dados incompletos ou inexatos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Oposição</p>
                      <p className="text-sm text-muted-foreground">Opor-se ao tratamento em certas situações</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Informação</p>
                      <p className="text-sm text-muted-foreground">Obter informações sobre compartilhamentos</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Segurança */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">7. Medidas de Segurança</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Criptografia de dados em trânsito (HTTPS/TLS) e em repouso</li>
                  <li>Autenticação multifator e controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança e detecção de incidentes</li>
                  <li>Backups seguros e planos de recuperação de desastres</li>
                  <li>Treinamento regular da equipe sobre proteção de dados</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Retenção */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">8. Retenção de Dados</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Mantemos seus dados pessoais apenas pelo tempo necessário para:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Prestação do serviço enquanto sua conta estiver ativa</li>
                  <li>Cumprimento de obrigações legais (geralmente 5 anos)</li>
                  <li>Resolução de disputas e exercício de direitos</li>
                </ul>
                <p>Após esse período, os dados são anonimizados ou eliminados de forma segura.</p>
              </div>
            </section>

            <Separator />

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">9. Cookies e Tecnologias Similares</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Utilizamos cookies para:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong className="text-foreground">Essenciais:</strong> Funcionamento básico da plataforma</li>
                  <li><strong className="text-foreground">Funcionais:</strong> Lembrar preferências e configurações</li>
                  <li><strong className="text-foreground">Analíticos:</strong> Entender como você usa a plataforma</li>
                  <li><strong className="text-foreground">Publicitários:</strong> Personalizar anúncios (com seu consentimento)</li>
                </ul>
                <p>Você pode gerenciar cookies nas configurações do navegador ou em nossa central de preferências.</p>
              </div>
            </section>

            <Separator />

            {/* Transferência Internacional */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">10. Transferência Internacional</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Alguns de nossos prestadores de serviço podem estar localizados fora do Brasil. 
                Nestes casos, garantimos proteção adequada através de:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cláusulas contratuais padrão aprovadas pela ANPD</li>
                  <li>Certificações de adequação de proteção</li>
                  <li>Decisões de adequação da autoridade competente</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Alterações */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">11. Alterações nesta Política</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Podemos atualizar esta Política periodicamente. Quando isso acontecer:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>A data de "última atualização" será alterada</li>
                  <li>Alterações significativas serão comunicadas por email</li>
                  <li>Você será notificado na próxima visita à plataforma</li>
                  <li>Histórico de versões fica disponível mediante solicitação</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Contato e DPO */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">12. Contato e Encarregado de Dados</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Encarregado de Dados (DPO)
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li><strong>Email:</strong> dpo@moncoy.com</li>
                      <li><strong>Telefone:</strong> (11) 99999-9999</li>
                      <li><strong>Prazo de resposta:</strong> Até 15 dias</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Suporte Geral
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li><strong>Email:</strong> suporte@moncoy.com</li>
                      <li><strong>Central:</strong> <Link href="/support" className="text-primary hover:underline">moncoy.com/support</Link></li>
                      <li><strong>Chat:</strong> Disponível na plataforma</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Importante:</strong> Se não estivermos conseguindo resolver sua solicitação, 
                    você pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD) através do site 
                    <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                      gov.br/anpd
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="bg-muted/50 rounded-lg p-4 mt-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Esta Política está em total conformidade com a LGPD (Lei 13.709/2018) e regulamentações da ANPD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
