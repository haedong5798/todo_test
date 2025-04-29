'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // 현재 세션 확인
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
            
            // 인증 상태에 따른 리다이렉션
            if (session?.user) {
                // 로그인 상태에서 로그인 페이지 접근 시 대시보드로 리다이렉션
                if (pathname === '/login') {
                    router.replace('/dashboard');
                }
            } else {
                // 비로그인 상태에서 보호된 페이지 접근 시 로그인으로 리다이렉션
                if (pathname.startsWith('/dashboard')) {
                    router.replace('/login');
                }
            }
        };
        
        checkSession();

        // 인증 상태 변경 감지
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            
            // 인증 상태 변경 시 리다이렉션
            if (session?.user) {
                if (pathname === '/login') {
                    router.replace('/dashboard');
                }
            } else {
                if (pathname.startsWith('/dashboard')) {
                    router.replace('/login');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}; 