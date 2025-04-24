'use client';

import { useState } from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CalendarProps {
  onSelectDate: (date: Date) => void;
}

export default function Calendar({ onSelectDate }: CalendarProps) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const handleDateClick = (day: Date) => {
    setSelectedDay(day);
    onSelectDate(day);
  };

  return (
    <div className="w-full max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
      <div className="md:grid md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-xl text-gray-900">
              {format(firstDayCurrentMonth, 'yyyy년 M월', { locale: ko })}
            </h2>
            <button
              type="button"
              onClick={previousMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">이전 달</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">다음 달</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>
          <div className="grid grid-cols-7 mt-2 text-sm">
            {days.map((day, dayIdx) => {
              const firstDayOfMonth = dayIdx === 0;
              const dayOfWeek = getDay(day);

              return (
                <div
                  key={day.toString()}
                  className={classNames(
                    firstDayOfMonth ? `col-start-${dayOfWeek + 1}` : '',
                    'py-2'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={classNames(
                      isEqual(day, selectedDay) ? 'text-white' : '',
                      !isEqual(day, selectedDay) && isToday(day) ? 'text-red-500' : '',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth)
                        ? 'text-gray-900'
                        : '',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth)
                        ? 'text-gray-400'
                        : '',
                      isEqual(day, selectedDay) && isToday(day) ? 'bg-red-500' : '',
                      isEqual(day, selectedDay) && !isToday(day) ? 'bg-gray-900' : '',
                      !isEqual(day, selectedDay) ? 'hover:bg-gray-200' : '',
                      (isEqual(day, selectedDay) || isToday(day))
                        ? 'font-semibold'
                        : '',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 