export const dynamic = 'force-static';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">페이지를 찾을 수 없습니다.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
} 