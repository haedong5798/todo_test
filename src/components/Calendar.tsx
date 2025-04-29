import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div>
            <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                    {format(selectedDate, 'yyyy년 MM월', { locale: ko })}
                </h2>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center py-2 text-sm font-semibold text-gray-700"
                    >
                        {day}
                    </div>
                ))}
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                    <div key={`empty-start-${index}`} className="p-2" />
                ))}
                {days.map((day) => (
                    <button
                        key={day.toISOString()}
                        onClick={() => onSelectDate(day)}
                        className={`p-2 w-full ${
                            isSameDay(day, selectedDate)
                                ? 'bg-indigo-600 text-white rounded-lg'
                                : isSameMonth(day, selectedDate)
                                ? 'text-gray-900 hover:bg-gray-100 rounded-lg'
                                : 'text-gray-400'
                        }`}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
                {Array.from({
                    length: 6 - monthEnd.getDay(),
                }).map((_, index) => (
                    <div key={`empty-end-${index}`} className="p-2" />
                ))}
            </div>
        </div>
    );
} 