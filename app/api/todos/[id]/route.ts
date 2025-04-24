import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { completed } = body;

    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
      },
    });

    if (!todo) {
      return new NextResponse('Todo not found', { status: 404 });
    }

    if (todo.user.email !== session.user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: params.id,
      },
      data: {
        completed,
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
      },
    });

    if (!todo) {
      return new NextResponse('Todo not found', { status: 404 });
    }

    if (todo.user.email !== session.user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.todo.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 