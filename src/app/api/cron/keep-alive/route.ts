import { NextResponse } from 'next/server';
import { createServerClient } from '@/shared/lib/supabase/server';

/**
 * Supabase 무료 티어 자동 일시정지(7일 미사용) 방지용 keep-alive.
 * Vercel Cron이 주기적으로 호출해 가벼운 DB 쿼리로 "활동"을 기록한다.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Vercel Cron 인증: CRON_SECRET이 설정돼 있으면 Bearer 헤더를 검증한다.
  // (Vercel은 CRON_SECRET env가 있으면 cron 요청에 Authorization 헤더를 자동 주입)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createServerClient();
    // head+count: 데이터는 받지 않고 count만 — DB에 도달해 활동만 기록
    const { error } = await supabase.from('admins').select('id', { head: true, count: 'exact' });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[keep-alive] error:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
