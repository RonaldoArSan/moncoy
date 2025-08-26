import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, DollarSign, Activity, UserCheck, Shield, AlertTriangle, BarChart3, Settings } from "lucide-react"
import { getAdminDashboardData } from "./actions"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const adminStats = await getAdminDashboardData()
  const recentUsers = adminStats.recentUsers

  return (
    <div className="min-h-screen gradient-hero">
      {/* Admin Header */}
      <div className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary-500 animate-pulse-subtle" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white text-shadow">Painel Administrativo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Gestão da plataforma SaaS Financeira</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Badge className="bg-success-100 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700">
              <Activity className="w-3 h-3 mr-1" />
              Sistema Online
            </Badge>
                        <Link href="/admin/settings">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Métricas Principais */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Usuários</CardTitle>
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white text-shadow">
                {adminStats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-success-600 dark:text-success-400 font-medium">
                +{adminStats.monthlyGrowth}% este mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Usuários Ativos</CardTitle>
              <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <UserCheck className="h-4 w-4 text-success-600 dark:text-success-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white text-shadow">
                {adminStats.activeUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {adminStats.totalUsers > 0 ? ((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Receita Total</CardTitle>
              <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                <DollarSign className="h-4 w-4 text-warning-600 dark:text-warning-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white text-shadow">
                R$ {adminStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-success-600 dark:text-success-400 font-medium">+15.2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Tickets de Suporte</CardTitle>
              <div className="p-2 bg-danger-100 dark:bg-danger-900/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-danger-600 dark:text-danger-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white text-shadow">
                {adminStats.supportTickets}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Pendentes de resolução</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Usuários Recentes */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-shadow">
                <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                Usuários Recentes
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Últimos usuários cadastrados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-primary-50/80 dark:hover:bg-primary-900/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`text-xs ${
                          user.plan === "Profissional"
                            ? "bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-300 dark:border-secondary-700"
                            : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {user.plan}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          user.status === "Ativo"
                            ? "bg-success-100 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700"
                            : "bg-danger-100 text-danger-700 border-danger-200 dark:bg-danger-900/30 dark:text-danger-300 dark:border-danger-700"
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
                            <Link href="/admin/users" className="w-full">
              <Button
                variant="outline"
                className="w-full mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300"
              >
                Ver Todos os Usuários
              </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Métricas de Sistema */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-shadow">
                <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                Métricas do Sistema
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Status e performance da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success-50/80 dark:bg-success-900/20 backdrop-blur-sm hover:bg-success-100/80 dark:hover:bg-success-900/30 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse-subtle"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Uptime do Sistema</span>
                </div>
                <span className="text-sm font-bold text-success-600 dark:text-success-400">
                  {adminStats.systemHealth}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary-50/80 dark:bg-primary-900/20 backdrop-blur-sm hover:bg-primary-100/80 dark:hover:bg-primary-900/30 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Usuários Premium</span>
                </div>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {adminStats.premiumUsers.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary-50/80 dark:bg-secondary-900/20 backdrop-blur-sm hover:bg-secondary-100/80 dark:hover:bg-secondary-900/30 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Taxa de Conversão</span>
                </div>
                <span className="text-sm font-bold text-secondary-600 dark:text-secondary-400">
                  {adminStats.totalUsers > 0 ? ((adminStats.premiumUsers / adminStats.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-warning-50/80 dark:bg-warning-900/20 backdrop-blur-sm hover:bg-warning-100/80 dark:hover:bg-warning-900/30 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Crescimento Mensal</span>
                </div>
                <span className="text-sm font-bold text-warning-600 dark:text-warning-400">
                  +{adminStats.monthlyGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl animate-bounce-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-shadow">Ações Rápidas</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Ferramentas de administração da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/users" className="w-full">
                    <Button className="h-20 w-full flex-col space-y-2 gradient-primary hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <Users className="h-6 w-6" />
                        <span>Gerenciar Usuários</span>
                    </Button>
                </Link>
                              <Link href="/admin/reports" className="w-full">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 transform hover:scale-105"
              >
                <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <span>Relatórios</span>
              </Button>
                </Link>
                <Link href="/admin/support" className="w-full">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-all duration-300 transform hover:scale-105"
              >
                <AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                <span>Suporte</span>
              </Button>
                </Link>
                <Link href="/admin/settings" className="w-full">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all duration-300 transform hover:scale-105"
              >
                <Settings className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                <span>Configurações</span>
              </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
