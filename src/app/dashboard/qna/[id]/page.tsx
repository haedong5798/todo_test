'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface Profile {
  nickname: string;
}

interface Question {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  is_answered: boolean;
  is_private: boolean;
  author: {
    nickname: string;
  };
}

interface Answer {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  question_id: number;
  author: {
    nickname: string;
  };
}

interface QuestionData {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  is_answered: boolean;
  is_private: boolean;
  profiles: Profile;
}

interface AnswerData {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  question_id: number;
  profiles: Profile;
}

export default function QuestionDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 사용자 정보 가져오기
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        // 관리자 여부 확인
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          setIsAdmin(profileData?.is_admin || false);
        }

        // 질문 데이터 가져오기
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select(`
            *,
            profiles (
              nickname
            )
          `)
          .eq('id', resolvedParams.id)
          .single();

        if (questionError) {
          console.error('Question fetch error:', questionError);
          throw questionError;
        }

        if (!questionData) {
          throw new Error('질문을 찾을 수 없습니다.');
        }

        // 비밀글 체크
        if (questionData.is_private && questionData.user_id !== user?.id) {
          throw new Error('비밀글은 작성자만 볼 수 있습니다.');
        }

        // 데이터 구조 변환
        const formattedQuestion: Question = {
          id: questionData.id,
          title: questionData.title,
          content: questionData.content,
          created_at: questionData.created_at,
          user_id: questionData.user_id,
          is_answered: questionData.is_answered,
          is_private: questionData.is_private,
          author: {
            nickname: questionData.profiles?.nickname || '알 수 없음'
          }
        };

        setQuestion(formattedQuestion);

        // 답변 데이터 가져오기
        const { data: answersData, error: answersError } = await supabase
          .from('answers')
          .select(`
            *,
            profiles (
              nickname
            )
          `)
          .eq('question_id', resolvedParams.id)
          .order('created_at', { ascending: true });

        if (answersError) {
          console.error('Answers fetch error:', answersError);
          throw answersError;
        }

        // 답변 데이터 구조 변환
        const formattedAnswers: Answer[] = (answersData || []).map((answer: any) => ({
          id: answer.id,
          content: answer.content,
          created_at: answer.created_at,
          user_id: answer.user_id,
          question_id: answer.question_id,
          author: {
            nickname: answer.profiles?.nickname || '알 수 없음'
          }
        }));
        
        setAnswers(formattedAnswers);
      } catch (error: any) {
        console.error('Error details:', error);
        setError(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!isAdmin) {
      setError('관리자만 답변을 작성할 수 있습니다.');
      return;
    }

    try {
      const { error: answerError } = await supabase
        .from('answers')
        .insert([
          {
            content: newAnswer,
            question_id: resolvedParams.id,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ]);

      if (answerError) throw answerError;

      // 답변 상태 업데이트
      const { error: updateError } = await supabase
        .from('questions')
        .update({ is_answered: true })
        .eq('id', resolvedParams.id);

      if (updateError) throw updateError;

      // 답변 목록 새로고침
      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', resolvedParams.id)
        .order('created_at', { ascending: true });

      setAnswers(answersData || []);
      setNewAnswer('');
      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-500">에러: {error}</div>;
  if (!question) return <div className="p-8">질문을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <Link
              href="/dashboard/qna"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>

          {/* 질문 내용 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{question.title}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  question.is_answered
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {question.is_answered ? '답변완료' : '답변대기'}
              </span>
            </div>
            <div className="text-gray-600 mb-4">
              작성자: {question.author?.nickname || '알 수 없음'} | 작성일: {new Date(question.created_at).toLocaleString()}
            </div>
            <div className="prose max-w-none">
              {question.content}
            </div>
          </div>

          {/* 답변 목록 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">답변</h2>
            {answers.length > 0 ? (
              <div className="space-y-6">
                {answers.map((answer) => (
                  <div key={answer.id} className="border-b pb-6">
                    <div className="text-gray-600 mb-2">
                      작성자: {answer.author?.nickname || '알 수 없음'} | 작성일: {new Date(answer.created_at).toLocaleString()}
                    </div>
                    <div className="prose max-w-none">
                      {answer.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">아직 답변이 없습니다.</p>
            )}
          </div>

          {/* 답변 작성 폼 - 관리자만 표시 */}
          {isAdmin && (
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  답변 작성
                </label>
                <textarea
                  id="answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="답변을 입력하세요"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  답변 등록
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 