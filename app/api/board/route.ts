import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CreatePostBody {
  title: string;
  content: string;
}

// 임시 데이터 저장소 (나중에 데이터베이스로 대체)
let posts: Post[] = [];

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as CreatePostBody;
  const newPost = {
    id: Date.now().toString(),
    title: body.title,
    content: body.content,
    author: session.user?.name || 'Anonymous',
    createdAt: new Date().toISOString(),
  };

  posts = [newPost, ...posts];
  return NextResponse.json(newPost);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  posts = posts.filter((post) => post.id !== id);
  return NextResponse.json({ message: 'Post deleted successfully' });
} 