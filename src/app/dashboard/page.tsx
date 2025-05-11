'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { EventDragStopArg } from '@fullcalendar/interaction';

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function Dashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const fetchNotices = async (date: string) => {
    setLoading(true);
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotices(data);
    } else {
      setNotices([]);
    }
    setLoading(false);
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    fetchNotices(arg.dateStr);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 캘린더 섹션 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">일정</h2>
            <div className="calendar-container">
              <style jsx global>{`
                .fc {
                  font-family: inherit;
                }
                .fc .fc-toolbar-title {
                  font-size: 1.2em;
                  font-weight: 600;
                }
                .fc .fc-button {
                  background-color: #3b82f6;
                  border-color: #3b82f6;
                }
                .fc .fc-button:hover {
                  background-color: #2563eb;
                  border-color: #2563eb;
                }
                .fc .fc-button-primary:not(:disabled).fc-button-active,
                .fc .fc-button-primary:not(:disabled):active {
                  background-color: #2563eb;
                  border-color: #2563eb;
                }
                .fc .fc-daygrid-day.fc-day-today {
                  background-color: #f8fafc;
                }
                .fc .fc-daygrid-day-number {
                  color: #1f2937;
                  text-decoration: none;
                }
                .fc .fc-day-today .fc-daygrid-day-number {
                  font-weight: bold;
                }
                .fc .fc-day-sat .fc-daygrid-day-number {
                  color: #3b82f6;
                }
                .fc .fc-day-sun .fc-daygrid-day-number {
                  color: #ef4444;
                }
                .fc .fc-col-header-cell-cushion {
                  color: #1f2937;
                  text-decoration: none;
                }
                .fc .fc-col-header-cell.fc-day-sat .fc-col-header-cell-cushion {
                  color: #3b82f6;
                }
                .fc .fc-col-header-cell.fc-day-sun .fc-col-header-cell-cushion {
                  color: #ef4444;
                }
              `}</style>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth'
                }}
                dateClick={handleDateClick}
                height="auto"
                dayMaxEvents={true}
                weekends={true}
                selectable={true}
                selectMirror={true}
                dayMaxEventRows={true}
                editable={true}
                droppable={true}
                eventDrop={(info: EventDragStopArg) => {
                  alert(info.event.title + " was dropped on " + info.event.start?.toISOString());
                }}
                eventClick={(info: EventClickArg) => {
                  alert('Event: ' + info.event.title);
                }}
              />
            </div>
          </div>
        </div>

        {/* 공지사항 섹션 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {selectedDate ? `${selectedDate} 공지사항` : '공지사항'}
            </h2>
            {loading ? (
              <p>불러오는 중...</p>
            ) : notices.length > 0 ? (
              <ul className="space-y-4">
                {notices.map((notice) => (
                  <li key={notice.id} className="border-b pb-4">
                    <div className="font-bold text-lg mb-2">{notice.title}</div>
                    <div className="text-gray-600 text-sm mb-2">
                      {new Date(notice.created_at).toLocaleString('ko-KR')}
                    </div>
                    <div className="text-gray-700">{notice.content}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">선택한 날짜의 공지사항이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 