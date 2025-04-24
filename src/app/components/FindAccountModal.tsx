'use client';

import { useState } from 'react';

interface FindAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindAccountModal({ isOpen, onClose }: FindAccountModalProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [foundId, setFoundId] = useState('');
  const [message, setMessage] = useState('');

  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 아이디 찾기 로직 구현
    setFoundId('lhd5798'); // 임시로 하드코딩된 아이디 표시
    setMessage('입력하신 이메일로 등록된 아이디를 찾았습니다.');
  };

  const handleFindPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 비밀번호 찾기 로직 구현
    setMessage('입력하신 이메일로 임시 비밀번호가 발송되었습니다.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">계정 찾기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === 'id'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('id')}
          >
            아이디 찾기
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === 'password'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('password')}
          >
            비밀번호 찾기
          </button>
        </div>

        {activeTab === 'id' ? (
          <form onSubmit={handleFindId} className="space-y-4">
            <div>
              <label htmlFor="find-id-email" className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <input
                id="find-id-email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {foundId && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">{message}</p>
                <p className="text-lg font-medium text-gray-900 mt-2">아이디: {foundId}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              아이디 찾기
            </button>
          </form>
        ) : (
          <form onSubmit={handleFindPassword} className="space-y-4">
            <div>
              <label htmlFor="find-pw-id" className="block text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                id="find-pw-id"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="find-pw-email" className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <input
                id="find-pw-email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {message && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">{message}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              비밀번호 찾기
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 