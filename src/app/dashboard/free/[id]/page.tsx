'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  author: {
    nickname: string;
  };
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  author: {
    nickname: string;
  };
}

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 사용자 정보 가져오기
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        // 게시글 정보 가져오기
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (postError) {
          console.error('Post fetch error:', postError);
          throw postError;
        }

        if (!postData) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        // 작성자 정보 가져오기
        const { data: profileData } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', postData.user_id)
          .single();

        const formattedPost: Post = {
          id: postData.id,
          title: postData.title,
          content: postData.content,
          created_at: postData.created_at,
          user_id: postData.user_id,
          author: {
            nickname: profileData?.nickname || '알 수 없음'
          }
        };

        setPost(formattedPost);

        // 댓글 목록 가져오기
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', resolvedParams.id)
          .order('created_at', { ascending: true });

        if (commentsError) {
          console.error('Comments fetch error:', commentsError);
          throw commentsError;
        }

        // 각 댓글의 작성자 정보 가져오기
        const commentsWithProfiles = await Promise.all(
          (commentsData || []).map(async (comment) => {
            const { data: commentProfileData } = await supabase
              .from('profiles')
              .select('nickname')
              .eq('id', comment.user_id)
              .single();

            return {
              ...comment,
              author: {
                nickname: commentProfileData?.nickname || '알 수 없음'
              }
            };
          })
        );

        setComments(commentsWithProfiles);
      } catch (error) {
        console.error('Error details:', error);
        if (error instanceof AuthError || error instanceof PostgrestError) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const { error: commentError } = await supabase
        .from('comments')
        .insert([
          {
            content: newComment,
            post_id: resolvedParams.id,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (commentError) throw commentError;

      // 새 댓글 작성자 정보 가져오기
      const { data: profileData } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();

      // 새 댓글 추가
      const newCommentData: Comment = {
        id: Date.now(), // 임시 ID
        content: newComment,
        post_id: resolvedParams.id,
        user_id: user.id,
        created_at: new Date().toISOString(),
        author: {
          nickname: profileData?.nickname || '알 수 없음'
        }
      };

      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      if (error instanceof PostgrestError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('댓글 작성 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', resolvedParams.id);

      if (error) throw error;

      router.push('/dashboard/free');
    } catch (error) {
      if (error instanceof PostgrestError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-500">에러: {error}</div>;
  if (!post) return <div className="p-8">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <Link
              href="/dashboard/free"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-600 mb-4">
              작성자: {post.author?.nickname || '알 수 없음'} | 작성일: {new Date(post.created_at).toLocaleString()}
            </div>
            <div className="prose max-w-none">
              {post.content}
            </div>
          </div>

          {/* 작성자만 수정/삭제 버튼 표시 */}
          {user && user.id === post.user_id && (
            <div className="flex justify-end space-x-4">
              <Link
                href={`/dashboard/free/edit/${post.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                삭제
              </button>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-4">댓글</h2>
            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                  rows={3}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  댓글 작성
                </button>
              </form>
            ) : (
              <p className="text-gray-500 mb-6">댓글을 작성하려면 로그인이 필요합니다.</p>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">{comment.author?.nickname || '알 수 없음'}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 