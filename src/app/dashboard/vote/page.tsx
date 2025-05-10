'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Vote {
  id: number;
  title: string;
  description: string;
  end_date: string;
  created_at: string;
  user_id: string;
  options: string[];
}

export default function Vote() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
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
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setVotes(data);
      }
    };

    fetchVotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">투표하기</h2>
            {isAdmin && (
              <Link
                href="/dashboard/vote/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                투표 만들기
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {votes.map((vote) => (
              <div
                key={vote.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <Link href={`/dashboard/vote/${vote.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{vote.title}</h3>
                  <p className="text-gray-600 mb-4">{vote.description}</p>
                  <div className="text-sm text-gray-500">
                    마감일: {new Date(vote.end_date).toLocaleDateString()}
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700">투표 옵션:</div>
                    <ul className="mt-2 space-y-1">
                      {vote.options.map((option, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 