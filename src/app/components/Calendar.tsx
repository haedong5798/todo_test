'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { DateSelectArg, DayCellContentArg } from '@fullcalendar/core';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export default function Calendar({ onSelectDate, selectedDate }: CalendarProps) {
  return (
    <div className="w-full px-4 mx-auto sm:px-7 md:px-6">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={koLocale}
        firstDay={1}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next'
        }}
        selectable={true}
        select={(info: DateSelectArg) => {
          onSelectDate(info.start);
        }}
        dayCellClassNames={(arg: DayCellContentArg) => {
          const isSelected = arg.date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
          return isSelected ? ['bg-gray-900', 'text-white', 'rounded-full'] : ['hover:bg-gray-100'];
        }}
        height="auto"
      />
    </div>
  );
} 