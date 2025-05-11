'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 사용자 프로필 확인
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        if (activeTab === 'admin' && !profile?.is_admin) {
          throw new Error('관리자 권한이 없습니다.');
        }

        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof AuthError || error instanceof PostgrestError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 로그인 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* 탭 메뉴 */}
          <div className="flex border-b mb-8">
            <button
              className={`flex-1 px-4 py-2 font-medium text-center ${
                activeTab === 'user'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('user')}
            >
              일반 로그인
            </button>
            <button
              className={`flex-1 px-4 py-2 font-medium text-center ${
                activeTab === 'admin'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('admin')}
            >
              관리자 로그인
            </button>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
