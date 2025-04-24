'use client';

import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/Schedule';

// 임시 데이터
const DUMMY_SCHEDULES = [
  {
    id: '1',
    title: '팀 미팅',
    time: '09:00',
    description: '주간 업무 리뷰 미팅',
  },
  {
    id: '2',
    title: '점심 약속',
    time: '12:30',
    description: '동료들과 점심 식사',
  },
];

export default function TodosPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // 선택된 날짜에 따라 일정을 필터링
    const filteredSchedules = DUMMY_SCHEDULES.filter(() => Math.random() > 0.5); // 임시로 랜덤하게 필터링
    setSchedules(filteredSchedules);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
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
          <ScheduleList selectedDate={selectedDate} schedules={schedules} />
        </div>
      </div>
    </main>
  );
} 