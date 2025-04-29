import { format, isSameDay } from 'date-fns';
import { ScheduleData } from './AddScheduleModal';

interface ScheduleListProps {
    selectedDate: Date;
    schedules: ScheduleData[];
    selectedScheduleId: string | null;
    onScheduleSelect: (id: string) => void;
}

export default function ScheduleList({
    selectedDate,
    schedules,
    selectedScheduleId,
    onScheduleSelect,
}: ScheduleListProps) {
    const filteredSchedules = schedules.filter((schedule) =>
        isSameDay(schedule.date, selectedDate)
    );

    return (
        <div className="space-y-2">
            {filteredSchedules.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                    등록된 일정이 없습니다.
                </p>
            ) : (
                filteredSchedules.map((schedule) => (
                    <div
                        key={schedule.id}
                        onClick={() => onScheduleSelect(schedule.id)}
                        className={`p-4 rounded-lg cursor-pointer ${
                            selectedScheduleId === schedule.id
                                ? 'bg-indigo-50 border-2 border-indigo-500'
                                : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">
                                {schedule.title}
                            </h3>
                            <div className="text-sm text-gray-500">
                                {schedule.startTime} - {schedule.endTime}
                            </div>
                        </div>
                        {schedule.description && (
                            <p className="mt-2 text-gray-600">
                                {schedule.description}
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
} 