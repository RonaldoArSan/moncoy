"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon, Calendar, CreditCard } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSettingsContext } from "@/contexts/settings-context"

export default function ProfilePage() {
  const { user, loading, updateUser } = useSettingsContext()
  const [form, setForm] = useState({ name: "", email: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "" })
  }, [user])

  const planLabel = useMemo(() => {
    if (!user) return "—"
    if (user.plan === "professional") return "Profissional"
    if (user.plan === "premium") return "Premium"
    return "Básico"
  }, [user])

  const joinDate = useMemo(() => {
    if (!user?.registration_date) return "—"
    try {
      return new Date(user.registration_date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    } catch {
      return "—"
    }
  }, [user?.registration_date])

  const initials = (user?.name || "Usuário").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()
  const [photoUploading, setPhotoUploading] = useState(false)
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setPhotoUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id)
    try {
      const res = await fetch('/api/user/upload-photo', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Falha ao enviar foto')
      const { photoUrl } = await res.json()
      await updateUser?.({ photo_url: photoUrl })
      alert('Foto atualizada!')
    } catch (e: any) {
      alert(e.message || 'Erro ao enviar foto')
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateUser?.({ name: form.name, email: form.email })
      alert("Perfil atualizado!")
    } catch (e: any) {
      alert(e.message || "Erro ao salvar alterações")
    } finally {
      setSaving(false)
    }
  }

  const openBillingPortal = async () => {
    try {
      if (!user?.stripe_customer_id) {
        alert("Assinatura não encontrada. Finalize uma compra primeiro.")
        return
      }
      const res = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user.stripe_customer_id })
      })
      if (!res.ok) throw new Error('Falha ao abrir Portal de Cobrança')
      const { url } = await res.json()
      window.location.href = url
    } catch (e: any) {
      alert(e.message || 'Erro ao abrir Portal de Cobrança')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.photo_url || undefined} alt={user?.name || 'Foto de perfil'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={photoUploading} />
            {photoUploading && <span className="text-xs text-gray-500 ml-2">Enviando...</span>}
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          <CreditCard className="w-4 h-4 mr-1" />
          Plano {planLabel}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Gerencie suas informações pessoais e dados de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={"/diverse-user-avatars.png"} alt={user?.name || "Usuário"} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" disabled>
                Alterar Foto
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} />
            </div>

            <Button className="w-full" disabled={loading || saving} onClick={handleSave}>
              {saving ? 'Salvando…' : 'Salvar Alterações'}
            </Button>
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
              <span className="font-medium">{joinDate}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Plano Atual</span>
              </div>
              <Badge variant="default">{planLabel}</Badge>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full bg-transparent" onClick={openBillingPortal} disabled={!user?.stripe_customer_id}>
                Gerenciar Plano
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Histórico de Pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
