"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, MessageSquare, Check, Copy, ArrowLeft } from "lucide-react"

interface Setup2FAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Setup2FAModal({ open, onOpenChange }: Setup2FAModalProps) {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState<"sms" | "app" | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes] = useState([
    "A1B2-C3D4-E5F6",
    "G7H8-I9J0-K1L2",
    "M3N4-O5P6-Q7R8",
    "S9T0-U1V2-W3X4",
    "Y5Z6-A7B8-C9D0",
  ])

  const handleMethodSelect = (selectedMethod: "sms" | "app") => {
    setMethod(selectedMethod)
    setStep(2)
  }

  const handleSendCode = () => {
    // Simulate sending SMS code
    setStep(3)
  }

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      setStep(4)
    }
  }

  const handleComplete = () => {
    onOpenChange(false)
    setStep(1)
    setMethod(null)
    setPhoneNumber("")
    setVerificationCode("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Configurar Autenticação 2FA
          </DialogTitle>
          <DialogDescription>Adicione uma camada extra de segurança à sua conta</DialogDescription>
        </DialogHeader>

        {/* Step 1: Choose Method */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Escolha como você gostaria de receber os códigos de verificação:
            </div>

            <div className="space-y-3">
              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleMethodSelect("sms")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">SMS</h3>
                      <p className="text-sm text-muted-foreground">Receba códigos via mensagem de texto</p>
                    </div>
                    <Badge variant="secondary">Recomendado</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors opacity-60"
                onClick={() => handleMethodSelect("app")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">App Autenticador</h3>
                      <p className="text-sm text-muted-foreground">Use Google Authenticator ou similar</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Phone Number Input */}
        {step === 2 && method === "sms" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm text-muted-foreground">Passo 2 de 4</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Número do Celular</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Digite seu número com DDD. Você receberá um código de verificação.
              </p>
            </div>

            <Button onClick={handleSendCode} disabled={phoneNumber.length < 10} className="w-full">
              Enviar Código
            </Button>
          </div>
        )}

        {/* Step 3: Verify Code */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="p-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm text-muted-foreground">Passo 3 de 4</div>
            </div>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium">Código Enviado!</h3>
              <p className="text-sm text-muted-foreground">
                Enviamos um código de 6 dígitos para
                <br />
                <strong>{phoneNumber}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificação</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <Button onClick={handleVerifyCode} disabled={verificationCode.length !== 6} className="w-full">
              Verificar Código
            </Button>

            <Button variant="ghost" size="sm" className="w-full">
              Reenviar código
            </Button>
          </div>
        )}

        {/* Step 4: Backup Codes */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium">2FA Configurado!</h3>
              <p className="text-sm text-muted-foreground">Guarde estes códigos de backup em local seguro</p>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Códigos de Backup</CardTitle>
                <CardDescription className="text-xs">
                  Use estes códigos se não conseguir acessar seu celular
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm font-mono"
                  >
                    <span>{code}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)} className="p-1 h-auto">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => copyToClipboard(backupCodes.join("\n"))}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Todos
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Concluir
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
