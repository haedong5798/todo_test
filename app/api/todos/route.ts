import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string | undefined;
}

interface CreateTodoBody {
  title: string;
}

interface UpdateTodoBody {
  id: string;
  completed: boolean;
}

// 임시 데이터 저장소 (나중에 데이터베이스로 대체)
let todos: Todo[] = [];

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as CreateTodoBody;
  const newTodo = {
    id: Date.now().toString(),
    title: body.title,
    completed: false,
    createdAt: new Date(),
    userId: session.user?.email || undefined,
  };

  todos.push(newTodo);
  return NextResponse.json(newTodo);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as UpdateTodoBody;
  const { id, completed } = body;

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  todos[todoIndex].completed = completed;
  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
  }

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  todos = todos.filter((todo) => todo.id !== id);
  return NextResponse.json({ message: 'Todo deleted successfully' });
} 