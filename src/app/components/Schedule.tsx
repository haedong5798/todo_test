'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ScheduleData } from './AddScheduleModal';

interface ScheduleListProps {
  selectedDate: Date;
  schedules: ScheduleData[];
  onDelete: () => void;
  selectedScheduleId: string | null;
  onScheduleSelect: (id: string) => void;
}

export default function ScheduleList({
  selectedDate,
  schedules,
  onDelete,
  selectedScheduleId,
  onScheduleSelect,
}: ScheduleListProps) {
  const filteredSchedules = schedules.filter(
    (schedule) => format(schedule.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })} 일정
      </h3>
      <div className="space-y-3">
        {filteredSchedules.length === 0 ? (
          <p className="text-gray-500 text-center py-4">등록된 일정이 없습니다.</p>
        ) : (
          filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedScheduleId === schedule.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => onScheduleSelect(schedule.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{schedule.time}</p>
                </div>
              </div>
              {schedule.description && (
                <p className="text-gray-600 text-sm mt-2">{schedule.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 