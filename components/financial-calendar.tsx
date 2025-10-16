"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { Commitment, DayData } from '@/types/commitment';

interface CalendarProps {
  commitments: Commitment[];
  setSelectedCommitment: (commitment: Commitment) => void;
  onDayClick: (dayData: DayData) => void;
  onEmptyDayClick?: (date: string) => void;
}

export const FinancialCalendar = ({ 
  commitments, 
  setSelectedCommitment, 
  onDayClick, 
  onEmptyDayClick 
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getCommitmentsForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return commitments.filter(c => c.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getCommitmentStyle = (commitment: Commitment) => {
    const baseClasses = "text-xs p-1.5 rounded-md cursor-pointer truncate font-medium transition-all duration-200 hover:scale-105 shadow-sm";
    
    switch (commitment.type) {
      case 'income':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200 hover:bg-green-200`;
      case 'expense':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200 hover:bg-red-200`;
      case 'investment':
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200`;
      case 'meeting':
        return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200`;
    }
  };

  const getStatusDot = (status: Commitment['status']) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500';
      case 'pendente':
        return 'bg-yellow-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-foreground">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
            >
              Hoje
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div 
              key={day} 
              className="p-3 text-center text-sm font-semibold text-muted-foreground bg-muted/30 rounded-md"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayCommitments = day ? getCommitmentsForDay(day) : [];
            const isToday = day && 
              new Date().getDate() === day && 
              new Date().getMonth() === currentDate.getMonth() && 
              new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-border rounded-lg transition-all duration-200 ${
                  day ? 'cursor-pointer hover:bg-accent/50 hover:border-primary/30' : 'opacity-30'
                } ${
                  isToday ? 'bg-primary/10 border-primary shadow-md' : 'bg-background hover:shadow-sm'
                }`}
                onClick={() => {
                  if (day) {
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    if (dayCommitments.length > 0) {
                      onDayClick({
                        date: dateStr,
                        commitments: dayCommitments
                      });
                    } else {
                      onEmptyDayClick?.(dateStr);
                    }
                  }
                }}
              >
                {day && (
                  <>
                    <div className={`flex items-center justify-between mb-2`}>
                      <span className={`text-sm font-semibold ${
                        isToday ? 'text-primary' : 'text-foreground'
                      }`}>
                        {day}
                      </span>
                      {dayCommitments.length === 0 && (
                        <Plus className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayCommitments.slice(0, 3).map(commitment => (
                        <div
                          key={commitment.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCommitment(commitment);
                          }}
                          className={getCommitmentStyle(commitment)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">
                              {commitment.time} - {commitment.title}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(commitment.status)}`} />
                          </div>
                          {commitment.amount && (
                            <div className="text-xs font-semibold mt-0.5">
                              R$ {commitment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {dayCommitments.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            onDayClick({
                              date: dateStr,
                              commitments: dayCommitments
                            });
                          }}
                          className="w-full text-xs text-primary font-medium p-1 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          +{dayCommitments.length - 3} mais
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};