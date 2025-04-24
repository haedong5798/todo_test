'use client';

import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/Schedule';
import AddScheduleModal from '../components/AddScheduleModal';
import type { ScheduleData } from '../components/AddScheduleModal';

export default function TodosPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const handleAddSchedule = (schedule: ScheduleData) => {
    setSchedules([...schedules, schedule]);
  };

  const handleDeleteSchedule = () => {
    if (selectedScheduleId) {
      setSchedules(schedules.filter(schedule => schedule.id !== selectedScheduleId));
      setSelectedScheduleId(null);
    }
  };

  const handleScheduleSelect = (id: string) => {
    setSelectedScheduleId(id);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            일정 관리
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              {currentTime.toLocaleTimeString('ko-KR')}
            </div>
            <button
              onClick={handleTodayClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              오늘
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Calendar onSelectDate={handleDateSelect} selectedDate={selectedDate} />
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">일정 목록</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  +
                </button>
                <button
                  onClick={handleDeleteSchedule}
                  disabled={!selectedScheduleId}
                  className={`p-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    selectedScheduleId
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-300 cursor-not-allowed'
                  }`}
                >
                  -
                </button>
              </div>
            </div>
            <ScheduleList
              selectedDate={selectedDate}
              schedules={schedules}
              selectedScheduleId={selectedScheduleId}
              onScheduleSelect={handleScheduleSelect}
            />
          </div>
        </div>
      </div>

      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSchedule}
        selectedDate={selectedDate}
      />
    </main>
  );
} 