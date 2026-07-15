// SUPABASE_SECRET_KEY(관리자 권한 키)를 쥐는 팩토리. 클라이언트 번들에 포함되면
// 빌드가 실패하도록 강제한다. 클라이언트는 Storage/DB에 직접 접근하지 않는다.
import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}
