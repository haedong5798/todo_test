'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
}

export default function Calendar() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    if (session) {
      fetchEvents();
    }
  }, [session]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const event = await response.json();
        setEvents([...events, event]);
        setNewEvent({ title: '', date: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/calendar?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== id));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    return events.filter((event) => event.date === date);
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view the calendar.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-4">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-8">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold py-2 bg-gray-100 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-32" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={day}
              className="h-32 p-2 border rounded-lg bg-white overflow-y-auto"
            >
              <div className="font-semibold mb-2">{day}</div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-sm p-1 mb-1 bg-blue-100 rounded"
                >
                  <div className="font-medium">{event.title}</div>
                  {event.description && (
                    <div className="text-xs text-gray-600">
                      {event.description}
                    </div>
                  )}
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <form onSubmit={addEvent} className="mt-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Event description (optional)"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Event
        </button>
      </form>
    </div>
  );
} 