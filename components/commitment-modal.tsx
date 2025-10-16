"use client";
import { useState } from 'react';
import { X, Clock, DollarSign, Calendar as CalendarIcon, Tag, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Commitment, DayData } from '@/types/commitment';

interface CommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayData | null;
  onEditCommitment?: (commitment: Commitment) => void;
  onDeleteCommitment?: (commitmentId: string) => void;
}

export const CommitmentModal = ({ 
  isOpen, 
  onClose, 
  dayData, 
  onEditCommitment, 
  onDeleteCommitment 
}: CommitmentModalProps) => {
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);

  if (!dayData) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeIcon = (type: Commitment['type']) => {
    switch (type) {
      case 'income':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'expense':
        return <DollarSign className="w-4 h-4 text-red-600" />;
      case 'investment':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'meeting':
        return <CalendarIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <Tag className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: Commitment['status']) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pendente':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'cancelado':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: Commitment['type']) => {
    const labels = {
      income: 'Receita',
      expense: 'Despesa',
      investment: 'Investimento',
      meeting: 'Reunião',
      other: 'Outro'
    };
    return labels[type] || 'Outro';
  };

  const getStatusLabel = (status: Commitment['status']) => {
    const labels = {
      confirmado: 'Confirmado',
      pendente: 'Pendente',
      cancelado: 'Cancelado'
    };
    return labels[status] || 'Pendente';
  };

  const getStatusColor = (status: Commitment['status']) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sortedCommitments = dayData.commitments.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>Compromissos do dia</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground capitalize">
            {formatDate(dayData.date)}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {sortedCommitments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum compromisso para este dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCommitments.map((commitment, index) => (
                <div key={commitment.id}>
                  <div 
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                      selectedCommitment?.id === commitment.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedCommitment(
                      selectedCommitment?.id === commitment.id ? null : commitment
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{commitment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(commitment.type)}
                            <span className="text-sm text-muted-foreground">
                              {getTypeLabel(commitment.type)}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-1">
                          {commitment.title}
                        </h3>
                        
                        {commitment.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {commitment.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-3">
                          {commitment.amount && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                R$ {commitment.amount.toLocaleString('pt-BR', { 
                                  minimumFractionDigits: 2 
                                })}
                              </span>
                            </div>
                          )}
                          
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(commitment.status)}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(commitment.status)}
                              <span>{getStatusLabel(commitment.status)}</span>
                            </div>
                          </Badge>
                          
                          {commitment.recurring && (
                            <Badge variant="secondary">
                              Recorrente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes expandidos */}
                    {selectedCommitment?.id === commitment.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Categoria:</span>
                            <p className="text-foreground">{commitment.category || 'Não definida'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Status:</span>
                            <p className="text-foreground">{getStatusLabel(commitment.status)}</p>
                          </div>
                          {commitment.recurring && (
                            <div>
                              <span className="font-medium text-muted-foreground">Padrão:</span>
                              <p className="text-foreground capitalize">
                                {commitment.recurringPattern}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-muted-foreground">Criado em:</span>
                            <p className="text-foreground">
                              {new Date(commitment.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        {(onEditCommitment || onDeleteCommitment) && (
                          <div className="flex space-x-2 mt-4">
                            {onEditCommitment && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditCommitment(commitment);
                                }}
                              >
                                Editar
                              </Button>
                            )}
                            {onDeleteCommitment && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteCommitment(commitment.id);
                                }}
                              >
                                Excluir
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {index < sortedCommitments.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};