'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function Notice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }

      const { data } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setNotices(data);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">공지사항</h2>
            {isAdmin && (
              <Link
                href="/dashboard/notice/write"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                글쓰기
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.map((notice) => (
                  <tr key={notice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/notice/${notice.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {notice.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 