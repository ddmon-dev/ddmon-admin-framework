import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * 브라우저에서 사용하는 Supabase 클라이언트 생성
 * ANON KEY를 사용하여 클라이언트 사이드에서 안전하게 사용 가능
 */
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
