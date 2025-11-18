/**
 * Supabase Database Schema Types
 *
 * Phase 1: 수동 작성
 * Phase 2: Supabase CLI로 자동 생성
 *
 * 생성 명령어:
 * npx supabase gen types typescript --project-id <project-id> > src/shared/lib/supabase/types.ts
 *
 * ⚠️ Phase 2 전환 시 이 파일 전체를 자동 생성된 내용으로 교체
 */

/**
 * Database Schema Interface
 */
export interface Database {
  Tables: {
    Notices: {
      Row: {
        id: number;
        title: string;
        author: string;
        created_at: string;
        view_count: number;
        category: string;
      };
      Insert: Omit<Database['Tables']['Notices']['Row'], 'id' | 'created_at'>;
      Update: Partial<Database['Tables']['Notices']['Insert']>;
    };
    // 향후 다른 테이블 추가 시 여기에 정의
    // Users: { ... }
    // Posts: { ... }
  };
}
