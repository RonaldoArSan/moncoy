import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  FileText,
} from "lucide-react"

export default function SupportPage() {
  const tickets = [
    {
      id: "#12345",
      subject: "Problema com sincronização bancária",
      status: "Em andamento",
      date: "15/01/2024",
      priority: "Alta",
    },
    {
      id: "#12344",
      subject: "Dúvida sobre relatórios",
      status: "Resolvido",
      date: "10/01/2024",
      priority: "Média",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Central de Suporte</h1>
        <Badge variant="secondary" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Suporte 24/7
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contato Rápido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contato Rápido
            </CardTitle>
            <CardDescription>Entre em contato conosco</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="default">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat ao Vivo
            </Button>

            <Button className="w-full bg-transparent" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Enviar E-mail
            </Button>

            <Button className="w-full bg-transparent" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              (11) 4000-0000
            </Button>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Horário de Atendimento:</p>
              <p>Segunda a Sexta: 8h às 18h</p>
              <p>Sábado: 9h às 14h</p>
            </div>
          </CardContent>
        </Card>

        {/* Recursos de Ajuda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Recursos de Ajuda
            </CardTitle>
            <CardDescription>Encontre respostas rapidamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ - Perguntas Frequentes
            </Button>

            <Button variant="ghost" className="w-full justify-start">
              <Video className="w-4 h-4 mr-2" />
              Tutoriais em Vídeo
            </Button>

            <Button variant="ghost" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Guia do Usuário
            </Button>

            <Button variant="ghost" className="w-full justify-start">
              <Book className="w-4 h-4 mr-2" />
              Base de Conhecimento
            </Button>
          </CardContent>
        </Card>

        {/* Novo Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Abrir Ticket
            </CardTitle>
            <CardDescription>Descreva seu problema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" placeholder="Descreva brevemente o problema" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
                <option>Urgente</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva detalhadamente o problema..." rows={4} />
            </div>

            <Button className="w-full">Enviar Ticket</Button>
          </CardContent>
        </Card>
      </div>

      {/* Meus Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Tickets</CardTitle>
          <CardDescription>Acompanhe o status dos seus chamados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge variant={ticket.status === "Resolvido" ? "default" : "secondary"} className="text-xs">
                      {ticket.status === "Resolvido" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {ticket.status}
                    </Badge>
                    <Badge variant={ticket.priority === "Alta" ? "destructive" : "outline"} className="text-xs">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">{ticket.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
