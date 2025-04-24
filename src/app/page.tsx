'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-bold mb-8 text-white">
          효율적인 일정 관리의 시작
        </h1>
        
        <div className="space-y-6 text-lg">
          <p className="leading-relaxed text-white font-medium">
            체계적인 일정 관리로 더 생산적인 하루를 만들어보세요.
            우리의 할 일 관리 시스템은 당신의 시간을 더욱 가치있게 만들어줍니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">간편한 일정 등록</h3>
              <p className="text-[#A465FD]">클릭 한 번으로 빠르게 일정을 등록하고 관리하세요.</p>
            </div>
            
            <div className="p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">직관적인 인터페이스</h3>
              <p className="text-[#A465FD]">누구나 쉽게 사용할 수 있는 깔끔한 디자인을 제공합니다.</p>
            </div>
            
            <div className="p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">효율적인 시간 관리</h3>
              <p className="text-[#A465FD]">우선순위 설정으로 중요한 일정을 놓치지 마세요.</p>
            </div>
          </div>
        </div>

        <Link 
          href="/login" 
          className="inline-block mt-8 px-8 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
