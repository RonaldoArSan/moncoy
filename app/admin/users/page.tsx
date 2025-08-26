"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, PlusCircle, Search, FileWarning, Trash2, Edit, ArrowLeft } from "lucide-react"
import { getUsers, createUser, updateUser, deleteUser } from "./actions"

type User = Awaited<ReturnType<typeof getUsers>>[0];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const users = await getUsers();
      setUsers(users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (user: User | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'joinDate'>) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, { ...userData });
    } else {
      await createUser(userData);
    }
    const updatedUsers = await getUsers();
    setUsers(updatedUsers);
    closeModal();
  };
  
  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      closeDeleteModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.push('/admin')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Usuários</h1>
                <p className="text-gray-600 dark:text-gray-400">Adicione, edite ou remova usuários da plataforma.</p>
            </div>
        </div>

        <Card className="bg-white dark:bg-gray-800/50 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 bg-white dark:bg-gray-700"
                />
              </div>
              <Button onClick={() => openModal(null)} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Plano</TableHead>
                    <TableHead className="hidden lg:table-cell">Data de Cadastro</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">{user.email}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={user.status === 'Ativo' ? 'success' : user.status === 'Suspenso' ? 'destructive' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.plan}</TableCell>
                        <TableCell className="hidden lg:table-cell">{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openModal(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteModal(user)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <FileWarning className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="font-medium">Nenhum usuário encontrado.</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tente ajustar seus termos de busca.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Modal */}
      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.name}
      />
    </div>
  )
}

// UserFormModal Component
function UserFormModal({ isOpen, onClose, onSave, user }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, user: User | null }) {
  const [formData, setFormData] = useState({ name: '', email: '', plan: 'Básico', status: 'Ativo' });

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ name: user.name || '', email: user.email || '', plan: user.plan, status: user.status });
    } else {
      setFormData({ name: '', email: '', plan: 'Básico', status: 'Ativo' });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {user ? 'Altere os dados do usuário abaixo.' : 'Preencha os dados do novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plano
              </Label>
              <Select value={formData.plan} onValueChange={(value) => handleSelectChange('plan', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Profissional">Profissional</SelectItem>
                  <SelectItem value="Empresarial">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
               <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Suspenso">Suspenso</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// DeleteConfirmationModal Component
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, userName }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, userName?: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileWarning className="h-6 w-6 text-red-500" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja deletar o usuário <strong>{userName}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Sim, Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
