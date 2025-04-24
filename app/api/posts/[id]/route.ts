import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
      },
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    if (post.user.email !== session.user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.post.delete({
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