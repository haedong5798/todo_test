'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Todo App</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-700">{user?.email}</span>
                            <button
                                onClick={signOut}
                                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h2 className="text-2xl font-bold mb-4">대시보드</h2>
                        <p>여기에 대시보드 내용을 추가하세요.</p>
                    </div>
                </div>
            </main>
        </div>
    );
} 