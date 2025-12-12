import { useState } from 'react';
import { 
  startOfMonth, 
  startOfWeek, 
  addDays, 
  addMonths, 
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Navegação
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Geração dos dias do grid (CORREÇÃO: Sempre gera 42 dias / 6 semanas)
  const generateDays = () => {
    const monthStart = startOfMonth(currentDate);
    
    // Inicia no domingo (ou segunda, conforme locale) anterior ao início do mês
    const startDate = startOfWeek(monthStart, { locale: ptBR });

    // Gera array fixo de 42 dias para manter o grid estável
    const days = Array.from({ length: 42 }, (_, i) => addDays(startDate, i));

    return days;
  };

  // Formatadores
  const formatMonthYear = () => format(currentDate, 'MMMM yyyy', { locale: ptBR });
  
  // Formata dia da semana (ex: SEG, TER)
  const formatWeekDay = (date: Date) => format(date, 'EEE', { locale: ptBR });

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    nextMonth,
    prevMonth,
    goToToday,
    days: generateDays(),
    formatMonthYear,
    formatWeekDay,
    isSameMonth,
    isSameDay,
    isToday
  };
}