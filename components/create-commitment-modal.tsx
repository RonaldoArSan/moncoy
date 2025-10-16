"use client";
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, DollarSign, Tag } from 'lucide-react';
import type { Commitment } from '@/types/commitment';

interface CreateCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  onSave: (commitment: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingCommitment?: Commitment | null;
}

export const CreateCommitmentModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onSave,
  editingCommitment 
}: CreateCommitmentModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'pendente' as 'pendente' | 'confirmado' | 'cancelado',
    type: 'other' as 'income' | 'expense' | 'investment' | 'meeting' | 'other',
    amount: '',
    category: '',
    recurring: false,
    recurringPattern: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (editingCommitment) {
      setFormData({
        title: editingCommitment.title,
        description: editingCommitment.description || '',
        date: editingCommitment.date,
        time: editingCommitment.time,
        status: editingCommitment.status,
        type: editingCommitment.type,
        amount: editingCommitment.amount?.toString() || '',
        category: editingCommitment.category || '',
        recurring: editingCommitment.recurring || false,
        recurringPattern: editingCommitment.recurringPattern || 'monthly'
      });
    } else {
      // Reset form for new commitment
      setFormData({
        title: '',
        description: '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: '09:00',
        status: 'pendente' as 'pendente' | 'confirmado' | 'cancelado',
        type: 'other' as 'income' | 'expense' | 'investment' | 'meeting' | 'other',
        amount: '',
        category: '',
        recurring: false,
        recurringPattern: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly'
      });
    }
    setErrors({});
  }, [editingCommitment, selectedDate, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (formData.amount && isNaN(Number(formData.amount))) {
      newErrors.amount = 'Valor deve ser um número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const commitment: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      date: formData.date,
      time: formData.time,
      status: formData.status,
      type: formData.type,
      amount: formData.amount ? Number(formData.amount) : undefined,
      category: formData.category.trim() || undefined,
      recurring: formData.recurring,
      recurringPattern: formData.recurring ? formData.recurringPattern : undefined
    };

    onSave(commitment);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>{editingCommitment ? 'Editar Compromisso' : 'Novo Compromisso'}</span>
          </DialogTitle>
          {formData.date && (
            <p className="text-sm text-muted-foreground capitalize">
              {formatDate(formData.date)}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Reunião com cliente, Pagamento de conta..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalhes adicionais sobre o compromisso..."
                rows={3}
              />
            </div>

            {/* Data */}
            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Horário */}
            <div>
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className={errors.time ? 'border-red-500' : ''}
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>

            {/* Tipo */}
            <div>
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💰 Receita</SelectItem>
                  <SelectItem value="expense">💸 Despesa</SelectItem>
                  <SelectItem value="investment">📈 Investimento</SelectItem>
                  <SelectItem value="meeting">🤝 Reunião</SelectItem>
                  <SelectItem value="other">📋 Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">⏳ Pendente</SelectItem>
                  <SelectItem value="confirmado">✅ Confirmado</SelectItem>
                  <SelectItem value="cancelado">❌ Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor */}
            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0,00"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Categoria */}
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Ex: Alimentação, Trabalho..."
              />
            </div>

            {/* Recorrente */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="recurring">Compromisso recorrente</Label>
            </div>

            {/* Padrão de recorrência */}
            {formData.recurring && (
              <div className="md:col-span-2">
                <Label>Padrão de recorrência</Label>
                <Select value={formData.recurringPattern} onValueChange={(value) => setFormData(prev => ({ ...prev, recurringPattern: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">📅 Diário</SelectItem>
                    <SelectItem value="weekly">📆 Semanal</SelectItem>
                    <SelectItem value="monthly">🗓️ Mensal</SelectItem>
                    <SelectItem value="yearly">📅 Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCommitment ? 'Salvar Alterações' : 'Criar Compromisso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};