import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, CreditCard } from "lucide-react"

export default function ProfilePage() {
  const user = {
    name: "João Silva",
    email: "joao@exemplo.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    joinDate: "Janeiro 2024",
    plan: "Profissional",
    avatar: "/diverse-user-avatars.png",
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <Badge variant="secondary" className="text-sm">
          <CreditCard className="w-4 h-4 mr-1" />
          Plano {user.plan}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Gerencie suas informações pessoais e dados de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg">JS</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Alterar Foto
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue={user.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" defaultValue={user.phone} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" defaultValue={user.address} />
            </div>

            <Button className="w-full">Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
            <CardDescription>Detalhes da sua conta e plano atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Membro desde</span>
              </div>
              <span className="font-medium">{user.joinDate}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Plano Atual</span>
              </div>
              <Badge variant="default">{user.plan}</Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recursos do Plano Profissional</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Transações ilimitadas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Conselhos de IA personalizados
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Análise de comprovantes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Relatórios avançados
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Suporte prioritário
                </li>
              </ul>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Gerenciar Plano
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Histórico de Pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
