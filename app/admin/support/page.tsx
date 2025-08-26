"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getSupportSettings, saveSupportSettings } from './actions'

export default function AdminSupportSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [token, setToken] = useState('')

  const [supportEmail, setSupportEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [phones, setPhones] = useState<string[]>([''])
  const [businessHours, setBusinessHours] = useState('')
  const [chatUrl, setChatUrl] = useState('')
  const [kbUrl, setKbUrl] = useState('')

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await getSupportSettings()
      if (data) {
        setSupportEmail(data.support_email || '')
        setWhatsapp(data.whatsapp || '')
        setPhones(Array.isArray(data.phones) ? data.phones : [])
        setBusinessHours(data.business_hours || '')
        setChatUrl(data.chat_url || '')
        setKbUrl(data.knowledge_base_url || '')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const addPhone = () => setPhones((p) => [...p, ''])
  const removePhone = (idx: number) => setPhones((p) => p.filter((_, i) => i !== idx))
  const updatePhone = (idx: number, value: string) => setPhones((p) => p.map((v, i) => i === idx ? value : v))

  const save = async () => {
    try {
      setSaving(true)
      if (!token) {
        toast({ title: 'Informe o token de admin', variant: 'destructive' })
        return
      }
      await saveSupportSettings({
        support_email: supportEmail,
        phones: phones.filter(Boolean),
        whatsapp,
        business_hours: businessHours,
        chat_url: chatUrl,
        knowledge_base_url: kbUrl,
      }, token)
      toast({ title: 'Configurações salvas' })
      await loadSettings()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Suporte</CardTitle>
          <CardDescription>Defina os canais de contato exibidos na Central de Suporte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Token de Admin (temporário)</Label>
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="ADMIN_EDIT_TOKEN" />
          </div>

          <div>
            <Label>E-mail de Suporte</Label>
            <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="suporte@empresa.com" />
          </div>

          <div>
            <Label>WhatsApp</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="55 11 99999-9999" />
          </div>

          <div className="space-y-2">
            <Label>Telefones</Label>
            {phones.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input value={p} onChange={(e) => updatePhone(idx, e.target.value)} placeholder="(11) 4000-0000" />
                <Button variant="ghost" size="icon" onClick={() => removePhone(idx)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPhone} className="mt-1">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Telefone
            </Button>
          </div>

          <div>
            <Label>Horário de Atendimento</Label>
            <Textarea rows={4} value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} placeholder={"Segunda a Sexta: 8h às 18h\nSábado: 9h às 14h"} />
          </div>

          <div>
            <Label>URL do Chat</Label>
            <Input value={chatUrl} onChange={(e) => setChatUrl(e.target.value)} placeholder="https://chat.seusite.com" />
          </div>

          <div>
            <Label>URL da Base de Conhecimento / Guia</Label>
            <Input value={kbUrl} onChange={(e) => setKbUrl(e.target.value)} placeholder="https://kb.seusite.com" />
          </div>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
