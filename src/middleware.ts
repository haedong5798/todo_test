import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // 미들웨어는 클라이언트 사이드 리다이렉션과 충돌하지 않도록
    // 기본적인 세션 확인만 수행하고 리다이렉션은 AuthContext에서 처리
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    // 세션 갱신
    await supabase.auth.getSession();
    
    return res;
}

// 모든 경로에 대해 미들웨어 적용
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 