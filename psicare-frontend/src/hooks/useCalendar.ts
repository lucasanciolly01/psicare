import { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
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

  // Geração dos dias do grid
  const generateDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    
    // Importante: Passar locale para garantir alinhamento correto da semana
    const startDate = startOfWeek(monthStart, { locale: ptBR });
    const endDate = endOfWeek(monthEnd, { locale: ptBR });

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
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