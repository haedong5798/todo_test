'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
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

export default function FreeBoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 게시글 목록 가져오기
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Posts fetch error:', postsError);
          throw postsError;
        }

        if (!postsData) {
          setPosts([]);
          return;
        }

        // 각 게시글의 작성자 정보 가져오기
        const postsWithProfiles = await Promise.all(
          postsData.map(async (post) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('nickname')
              .eq('id', post.user_id)
              .single();

            return {
              id: post.id,
              title: post.title,
              content: post.content,
              created_at: post.created_at,
              user_id: post.user_id,
              author: {
                nickname: profileData?.nickname || '알 수 없음'
              }
            };
          })
        );

        setPosts(postsWithProfiles);
      } catch (error) {
        console.error('Error details:', error);
        if (error instanceof PostgrestError) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('게시글을 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-500">에러: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">자유게시판</h1>
            <Link
              href="/dashboard/free/write"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              글쓰기
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/free/${post.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author?.nickname || '알 수 없음'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 