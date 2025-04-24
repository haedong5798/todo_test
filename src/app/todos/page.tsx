'use client';

import { useState } from 'react';
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // 선택된 날짜에 따라 일정을 필터링
    const filteredSchedules = DUMMY_SCHEDULES.filter(() => Math.random() > 0.5); // 임시로 랜덤하게 필터링
    setSchedules(filteredSchedules);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          일정 관리
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Calendar onSelectDate={handleDateSelect} />
          <ScheduleList selectedDate={selectedDate} schedules={schedules} />
        </div>
      </div>
    </main>
  );
} 