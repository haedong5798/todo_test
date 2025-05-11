'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/database.types';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [adminCode, setAdminCode] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 관리자 코드 확인
      if (role === 'admin') {
        if (!process.env.NEXT_PUBLIC_ADMIN_CODE) {
          throw new Error('관리자 코드가 설정되지 않았습니다.');
        }
        if (adminCode !== process.env.NEXT_PUBLIC_ADMIN_CODE) {
          throw new Error('관리자 코드가 올바르지 않습니다.');
        }
      }

      // 회원가입
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            nickname,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('이미 등록된 이메일입니다.');
        }
        throw signUpError;
      }

      if (!user?.id) {
        throw new Error('회원가입 처리 중 오류가 발생했습니다.');
      }

      // 프로필 생성 전 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 프로필 생성
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: email.toLowerCase(),
          nickname: nickname,
          role: role,
          is_admin: role === 'admin',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // 프로필 생성 실패 시 사용자 삭제
        try {
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
          if (deleteError) {
            console.error('Failed to delete user:', deleteError);
          }
        } catch (deleteError) {
          console.error('Error during user deletion:', deleteError);
        }
        throw new Error('프로필 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }

      router.push('/auth/signin');
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof AuthError) {
        setError(error.message);
      } else if (error instanceof PostgrestError) {
        if (error.code === '23505') {
          setError('이미 등록된 이메일입니다.');
        } else {
          setError(`데이터베이스 오류: ${error.message}`);
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('회원가입 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setRole('user')}
              className={`px-4 py-2 rounded-md ${
                role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              일반 회원
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-4 py-2 rounded-md ${
                role === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              관리자
            </button>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
              />
            </div>
            <div>
              <label htmlFor="nickname" className="sr-only">
                별명
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="별명"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
            {role === 'admin' && (
              <div>
                <label htmlFor="adminCode" className="sr-only">
                  관리자 코드
                </label>
                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="관리자 코드"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 