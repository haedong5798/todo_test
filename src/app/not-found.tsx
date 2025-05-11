export const dynamic = 'force-static';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-12 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          404 - 페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 text-center mb-8">
          요청하신 페이지를 찾을 수 없습니다. URL을 확인하시거나 홈으로 돌아가주세요.
        </p>
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 