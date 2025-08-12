"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Building,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

interface AddBankAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BANKS = [
  { id: "bb", name: "Banco do Brasil", logo: "🏛️", color: "bg-yellow-100 text-yellow-800" },
  { id: "itau", name: "Itaú", logo: "🏦", color: "bg-orange-100 text-orange-800" },
  { id: "bradesco", name: "Bradesco", logo: "🏪", color: "bg-red-100 text-red-800" },
  { id: "santander", name: "Santander", logo: "🏢", color: "bg-red-100 text-red-800" },
  { id: "nubank", name: "Nubank", logo: "💜", color: "bg-purple-100 text-purple-800" },
  { id: "inter", name: "Banco Inter", logo: "🧡", color: "bg-orange-100 text-orange-800" },
  { id: "c6", name: "C6 Bank", logo: "⚫", color: "bg-gray-100 text-gray-800" },
  { id: "original", name: "Banco Original", logo: "🟢", color: "bg-green-100 text-green-800" },
]

const MOCK_ACCOUNTS = [
  { id: "1", type: "Conta Corrente", number: "12345-6", balance: "R$ 5.420,30" },
  { id: "2", type: "Conta Poupança", number: "12345-7", balance: "R$ 12.850,00" },
  { id: "3", type: "Cartão de Crédito", number: "**** 1234", balance: "R$ 2.340,50 (fatura)" },
]

export function AddBankAccountModal({ open, onOpenChange }: AddBankAccountModalProps) {
  const [step, setStep] = useState(1)
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [credentials, setCredentials] = useState({ cpf: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId)
    setStep(2)
  }

  const handleAuth = async () => {
    setIsConnecting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    setStep(3)
  }

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
    )
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsConnecting(false)
    setIsConnected(true)
    setStep(4)
  }

  const handleClose = () => {
    setStep(1)
    setSelectedBank("")
    setCredentials({ cpf: "", password: "" })
    setSelectedAccounts([])
    setIsConnecting(false)
    setIsConnected(false)
    onOpenChange(false)
  }

  const selectedBankData = BANKS.find((bank) => bank.id === selectedBank)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Conectar Conta Bancária
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Selecione seu banco para conectar via Open Finance"}
            {step === 2 && "Faça login com suas credenciais bancárias"}
            {step === 3 && "Selecione as contas que deseja conectar"}
            {step === 4 && "Conexão realizada com sucesso!"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Bank Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Conexão segura via Open Finance. Seus dados são protegidos por criptografia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BANKS.map((bank) => (
                <Button
                  key={bank.id}
                  variant="outline"
                  className="h-16 flex items-center gap-3 hover:bg-muted/50 bg-transparent"
                  onClick={() => handleBankSelect(bank.id)}
                >
                  <span className="text-2xl">{bank.logo}</span>
                  <span className="font-medium">{bank.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Authentication */}
        {step === 2 && selectedBankData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <span className="text-2xl">{selectedBankData.logo}</span>
              <div>
                <p className="font-medium">{selectedBankData.name}</p>
                <p className="text-sm text-muted-foreground">Faça login com suas credenciais</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={credentials.cpf}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, cpf: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Suas credenciais são enviadas diretamente para o banco via conexão segura.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                className="flex-1"
                onClick={handleAuth}
                disabled={!credentials.cpf || !credentials.password || isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    Fazer Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Account Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800 dark:text-green-200">
                Login realizado com sucesso! Selecione as contas para conectar.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Contas Disponíveis</Label>
              {MOCK_ACCOUNTS.map((account) => (
                <div key={account.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={account.id}
                    checked={selectedAccounts.includes(account.id)}
                    onCheckedChange={() => handleAccountToggle(account.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {account.type.includes("Cartão") ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Building className="w-4 h-4" />
                      )}
                      <span className="font-medium">{account.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.number} • {account.balance}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                className="flex-1"
                onClick={handleConnect}
                disabled={selectedAccounts.length === 0 || isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    Conectar {selectedAccounts.length} Conta(s)
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Conexão Realizada!</h3>
              <p className="text-muted-foreground">
                {selectedAccounts.length} conta(s) conectada(s) com sucesso ao {selectedBankData?.name}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Contas Conectadas:</p>
              {selectedAccounts.map((accountId) => {
                const account = MOCK_ACCOUNTS.find((acc) => acc.id === accountId)
                return account ? (
                  <div key={accountId} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">
                      {account.type} {account.number}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                  </div>
                ) : null
              })}
            </div>

            <Separator />

            <div className="text-left space-y-2">
              <p className="text-sm font-medium">Próximos Passos:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Suas transações serão sincronizadas automaticamente</li>
                <li>• Categorização inteligente será aplicada</li>
                <li>• Relatórios atualizados em tempo real</li>
              </ul>
            </div>

            <Button className="w-full" onClick={handleClose}>
              Concluir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
