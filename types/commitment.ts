export interface Commitment {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  status: 'confirmado' | 'pendente' | 'cancelado';
  type: 'income' | 'expense' | 'investment' | 'meeting' | 'other';
  amount?: number;
  category?: string;
  recurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export interface DayData {
  date: string;
  commitments: Commitment[];
}