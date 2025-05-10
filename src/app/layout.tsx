'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // 로그인 관련 페이지에서는 메뉴를 표시하지 않음
  const isAuthPage = pathname === '/' || pathname === '/signup';

  return (
    <html lang="ko">
      <body>
        {/* 상단 메뉴 - 로그인 페이지가 아닐 때만 표시 */}
        {!isAuthPage && (
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  {/* 모바일 메뉴 버튼 */}
                  <div className="flex items-center sm:hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                      <span className="sr-only">메뉴 열기</span>
                      {/* 햄버거 아이콘 */}
                      <svg
                        className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      {/* X 아이콘 */}
                      <svg
                        className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* 데스크톱 메뉴 */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      대시보드
                    </Link>
                    <Link
                      href="/dashboard/notice"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard/notice'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      공지사항
                    </Link>
                    <Link
                      href="/dashboard/vote"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard/vote'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      투표
                    </Link>
                    <Link
                      href="/dashboard/free"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard/free'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      자유게시판
                    </Link>
                    <Link
                      href="/dashboard/qna"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard/qna'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Q&A
                    </Link>
                    <Link
                      href="/dashboard/game"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard/game'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      게임하기
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === '/dashboard/profile'
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      회원정보
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    로그아웃
                  </button>
                </div>
              </div>

              {/* 모바일 메뉴 */}
              <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                  <Link
                    href="/dashboard"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    대시보드
                  </Link>
                  <Link
                    href="/dashboard/notice"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard/notice'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    공지사항
                  </Link>
                  <Link
                    href="/dashboard/vote"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard/vote'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    투표
                  </Link>
                  <Link
                    href="/dashboard/free"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard/free'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    자유게시판
                  </Link>
                  <Link
                    href="/dashboard/qna"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard/qna'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Q&A
                  </Link>
                  <Link
                    href="/dashboard/game"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard/game'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    게임하기
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === '/dashboard/profile'
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    회원정보
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* 메인 컨텐츠 */}
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}
