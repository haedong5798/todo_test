import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} else {
  // 서버 사이드에서는 더미 클라이언트 생성
  supabase = createClient('http://dummy-url.com', 'dummy-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { supabase }; 