import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  userId: string | undefined;
}

interface CreateEventBody {
  title: string;
  date: string;
  description: string;
}

// 임시 데이터 저장소 (나중에 데이터베이스로 대체)
let events: CalendarEvent[] = [];

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as CreateEventBody;
  const newEvent = {
    id: Date.now().toString(),
    title: body.title,
    date: body.date,
    description: body.description,
    userId: session.user?.email || undefined,
  };

  events.push(newEvent);
  return NextResponse.json(newEvent);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  const eventIndex = events.findIndex((event) => event.id === id);
  if (eventIndex === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  events = events.filter((event) => event.id !== id);
  return NextResponse.json({ message: 'Event deleted successfully' });
} 