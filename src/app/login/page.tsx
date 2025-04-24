'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignupModal from '../components/SignupModal';
import FindAccountModal from '../components/FindAccountModal';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isFindAccountModalOpen, setIsFindAccountModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (document.getElementById('userId') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (id === 'lhd5798' && password === 'qwe123!@#') {
      router.push('/todos');
    } else {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="userId" className="sr-only">아이디</label>
              <input
                id="userId"
                name="userId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="아이디"
                defaultValue="lhd5798"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                defaultValue="qwe123!@#"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          </div>
        </form>

        <div className="flex justify-between text-sm">
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            회원가입
          </button>
          <button
            onClick={() => setIsFindAccountModalOpen(true)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            아이디/비밀번호 찾기
          </button>
        </div>
      </div>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
      
      <FindAccountModal
        isOpen={isFindAccountModalOpen}
        onClose={() => setIsFindAccountModalOpen(false)}
      />
    </div>
  );
} 