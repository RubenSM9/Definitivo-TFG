'use client';

import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CardData } from '../firebase/firebaseOperations';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  tasks: CardData[];
  onSelectTask: (task: any) => void;
}

const CustomToolbar = ({ label, onNavigate }: any) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>Anterior</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Siguiente</button>
      </span>
      <span className="rbc-toolbar-label">
        {label}
      </span>
    </div>
  );
};

export default function Calendar({ tasks, onSelectTask }: CalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  useEffect(() => {
    const calendarEvents = tasks.flatMap(card => 
      card.tareas
        .filter(task => task.fechaLimite)
        .map(task => ({
          id: task.id,
          title: task.nombre,
          start: new Date(task.fechaLimite!),
          end: new Date(task.fechaLimite!),
          resource: task,
          className: `priority-${task.prioridad.toLowerCase()}`
        }))
    );
    
    setEvents(calendarEvents);
  }, [tasks]);

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    switch (event.resource.prioridad.toLowerCase()) {
      case 'alta':
        backgroundColor = '#dc2626';
        break;
      case 'media':
        backgroundColor = '#d97706';
        break;
      case 'baja':
        backgroundColor = '#059669';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-lg p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectTask(event.resource)}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay tareas en este rango"
        }}
        components={{
          toolbar: CustomToolbar,
        }}
        date={date}
        onNavigate={handleNavigate}
      />
    </div>
  );
} 