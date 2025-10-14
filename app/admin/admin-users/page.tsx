"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, PlusCircle, Shield, Trash2, Key, CheckCircle, XCircle } from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  last_login?: string
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { adminUser, loading: authLoading, isSuperAdmin } = useAdminAuth()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)

  // Form states
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    name: "",
    password: "",
    role: "admin" as 'admin' | 'super_admin'
  })
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    if (!authLoading && !adminUser) {
      router.push('/admin/login')
    } else if (adminUser && !isSuperAdmin) {
      // Only super admins can manage admin users
      router.push('/admin')
    } else if (adminUser) {
      fetchAdminUsers()
    }
  }, [adminUser, authLoading, isSuperAdmin, router])

  const fetchAdminUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users/list')
      const result = await response.json()

      if (result.success) {
        setAdminUsers(result.users || [])
      } else {
        setError(result.error || 'Failed to fetch admin users')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    try {
      setError("")
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      })

      const result = await response.json()

      if (result.success) {
        setIsCreateModalOpen(false)
        setNewAdmin({ email: "", name: "", password: "", role: "admin" })
        fetchAdminUsers()
      } else {
        setError(result.error || 'Failed to create admin user')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  const handleUpdatePassword = async () => {
    if (!selectedAdmin) return

    try {
      setError("")
      const response = await fetch('/api/admin/users/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: selectedAdmin.id,
          newPassword
        })
      })

      const result = await response.json()

      if (result.success) {
        setIsPasswordModalOpen(false)
        setNewPassword("")
        setSelectedAdmin(null)
      } else {
        setError(result.error || 'Failed to update password')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  const handleToggleStatus = async (admin: AdminUser) => {
    try {
      setError("")
      const response = await fetch('/api/admin/users/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: admin.id,
          isActive: !admin.is_active
        })
      })

      const result = await response.json()

      if (result.success) {
        fetchAdminUsers()
      } else {
        setError(result.error || 'Failed to update status')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (!confirm(`Tem certeza que deseja excluir o administrador ${admin.name}?`)) {
      return
    }

    try {
      setError("")
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id })
      })

      const result = await response.json()

      if (result.success) {
        fetchAdminUsers()
      } else {
        setError(result.error || 'Failed to delete admin user')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gerenciar Administradores
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie usuários administrativos independentes da aplicação
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white dark:bg-gray-800/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Administradores do Sistema</CardTitle>
                <CardDescription>
                  Lista de todos os usuários administrativos
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Administrador
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? 'default' : 'destructive'}>
                        {admin.is_active ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Inativo
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.last_login
                        ? new Date(admin.last_login).toLocaleDateString('pt-BR')
                        : 'Nunca'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setIsPasswordModalOpen(true)
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(admin)}
                          disabled={admin.id === adminUser?.id}
                        >
                          {admin.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin)}
                          disabled={admin.id === adminUser?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Admin Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Administrador</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário administrativo ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Senha forte"
                />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={newAdmin.role}
                  onValueChange={(value: 'admin' | 'super_admin') =>
                    setNewAdmin({ ...newAdmin, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAdmin}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Password Modal */}
        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Senha</DialogTitle>
              <DialogDescription>
                Alterar a senha de {selectedAdmin?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha forte"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdatePassword}>Atualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
