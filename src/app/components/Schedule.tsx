'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Schedule {
  id: string;
  title: string;
  time: string;
  description: string;
}

interface ScheduleListProps {
  selectedDate: Date;
  schedules: Schedule[];
}

export default function ScheduleList({ selectedDate, schedules }: ScheduleListProps) {
  return (
    <div className="mt-8 px-4 sm:px-7">
      <h2 className="text-lg font-semibold text-gray-900">
        {format(selectedDate, 'yyyy년 M월 d일 일정', { locale: ko })}
      </h2>
      <div className="mt-4 space-y-4">
        {schedules.length === 0 ? (
          <p className="text-gray-500">등록된 일정이 없습니다.</p>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">
                  {schedule.title}
                </h3>
                <span className="text-sm text-gray-500">{schedule.time}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{schedule.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 