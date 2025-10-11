"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, ArrowLeft, Calendar, Scale } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
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
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Termos de Uso</CardTitle>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>Última atualização: 10 de outubro de 2025</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Introdução */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">1. Introdução e Aceitação</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bem-vindo ao Moncoy! Estes Termos de Uso regulam o acesso e uso da plataforma Moncoy, 
                uma solução de gestão financeira pessoal e empresarial. Ao acessar ou usar nossos serviços, 
                você concorda integralmente com estes termos.
              </p>
            </section>

            <Separator />

            {/* Definições */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">2. Definições</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Plataforma:</strong> Sistema Moncoy acessível via web e aplicativos móveis.</p>
                <p><strong className="text-foreground">Usuário:</strong> Pessoa física ou jurídica que utiliza a plataforma.</p>
                <p><strong className="text-foreground">Serviços:</strong> Funcionalidades de gestão financeira oferecidas.</p>
                <p><strong className="text-foreground">Dados Financeiros:</strong> Informações sobre transações, contas, investimentos e orçamentos.</p>
              </div>
            </section>

            <Separator />

            {/* Serviços Oferecidos */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">3. Serviços Oferecidos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">A plataforma Moncoy oferece:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Gestão e categorização de transações financeiras</li>
                  <li>Controle de orçamentos e metas financeiras</li>
                  <li>Análise de investimentos e relatórios de desempenho</li>
                  <li>Conselhos financeiros baseados em inteligência artificial</li>
                  <li>Sincronização com instituições financeiras</li>
                  <li>Relatórios e dashboard personalizados</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Cadastro e Conta */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">4. Cadastro e Responsabilidades da Conta</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. Para usar a plataforma, você deve criar uma conta fornecendo informações precisas e atualizadas.</p>
                <p>4.2. Você é responsável por manter a confidencialidade de suas credenciais de acesso.</p>
                <p>4.3. É vedado compartilhar sua conta com terceiros ou criar múltiplas contas.</p>
                <p>4.4. Você deve notificar imediatamente sobre qualquer uso não autorizado de sua conta.</p>
              </div>
            </section>

            <Separator />

            {/* Uso Adequado */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">5. Uso Adequado da Plataforma</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">É expressamente proibido:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Utilizar a plataforma para atividades ilegais ou fraudulentas</li>
                  <li>Inserir dados falsos ou enganosos</li>
                  <li>Tentar acessar contas de outros usuários</li>
                  <li>Realizar engenharia reversa ou tentativas de violação de segurança</li>
                  <li>Usar scripts automatizados que prejudiquem o funcionamento da plataforma</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Proteção de Dados */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">6. Proteção de Dados e Privacidade</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. Seus dados financeiros são criptografados e protegidos conforme a LGPD.</p>
                <p>6.2. Utilizamos seus dados apenas para fornecer e melhorar nossos serviços.</p>
                <p>6.3. Você pode solicitar a portabilidade, correção ou exclusão de seus dados a qualquer momento.</p>
                <p>6.4. Para mais detalhes, consulte nossa <Link href="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>.</p>
              </div>
            </section>

            <Separator />

            {/* Planos e Pagamentos */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">7. Planos e Pagamentos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. Oferecemos planos gratuitos e pagos com diferentes funcionalidades.</p>
                <p>7.2. Os pagamentos são processados de forma segura por provedores terceirizados.</p>
                <p>7.3. Cancelamentos podem ser feitos a qualquer momento pelo painel do usuário.</p>
                <p>7.4. Reembolsos seguem nossa política específica disponível no suporte.</p>
              </div>
            </section>

            <Separator />

            {/* Limitação de Responsabilidade */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">8. Limitação de Responsabilidade</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>8.1. A plataforma é fornecida "como está", sem garantias expressas ou implícitas.</p>
                <p>8.2. Não nos responsabilizamos por decisões financeiras tomadas com base em nossos relatórios.</p>
                <p>8.3. Nossa responsabilidade é limitada ao valor pago pelo serviço nos últimos 12 meses.</p>
                <p>8.4. Não garantimos disponibilidade ininterrupta da plataforma.</p>
              </div>
            </section>

            <Separator />

            {/* Propriedade Intelectual */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">9. Propriedade Intelectual</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>9.1. Todo conteúdo da plataforma é protegido por direitos autorais.</p>
                <p>9.2. Você mantém a propriedade de seus dados financeiros.</p>
                <p>9.3. É proibida a reprodução não autorizada de qualquer parte da plataforma.</p>
              </div>
            </section>

            <Separator />

            {/* Alterações */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">10. Alterações nos Termos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>10.1. Podemos atualizar estes termos periodicamente.</p>
                <p>10.2. Alterações significativas serão comunicadas por email ou notificação na plataforma.</p>
                <p>10.3. O uso continuado após as alterações constitui aceitação dos novos termos.</p>
              </div>
            </section>

            <Separator />

            {/* Rescisão */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">11. Rescisão</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>11.1. Você pode encerrar sua conta a qualquer momento.</p>
                <p>11.2. Podemos suspender contas que violem estes termos.</p>
                <p>11.3. Após o encerramento, seus dados serão mantidos conforme nossa política de retenção.</p>
              </div>
            </section>

            <Separator />

            {/* Lei Aplicável */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">12. Lei Aplicável e Foro</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>12.1. Estes termos são regidos pela legislação brasileira.</p>
                <p>12.2. Disputas serão resolvidas no foro da comarca de São Paulo/SP.</p>
                <p>12.3. Tentaremos resolver conflitos por mediação antes de ações judiciais.</p>
              </div>
            </section>

            <Separator />

            {/* Contato */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">13. Contato</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Para dúvidas sobre estes termos, entre em contato:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li><strong className="text-foreground">Email:</strong> legal@moncoy.com</li>
                  <li><strong className="text-foreground">Suporte:</strong> suporte@moncoy.com</li>
                  <li><strong className="text-foreground">Central de Ajuda:</strong> <Link href="/support" className="text-primary hover:underline">moncoy.com/support</Link></li>
                </ul>
              </div>
            </section>

            {/* Footer */}
            <div className="bg-muted/50 rounded-lg p-4 mt-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Este documento foi elaborado em conformidade com o Marco Civil da Internet e a LGPD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
