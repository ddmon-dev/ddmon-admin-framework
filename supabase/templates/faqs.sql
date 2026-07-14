-- =============================================
-- FAQ 테이블 템플릿
-- 새 테이블 추가 시 참고 (migrations/00000000000005_faqs.sql과 동일 스키마)
-- =============================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'ko',
  author TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스 (목록/순서변경 쿼리: deleted = false AND lang = ? [AND category = ?] ORDER BY sort_order)
CREATE INDEX IF NOT EXISTS idx_faqs_deleted_lang_sort ON public.faqs(deleted, lang, sort_order);

-- updated_at 자동 업데이트 트리거 (core의 기존 함수 사용)
CREATE TRIGGER trigger_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (deleted = false인 항목만)
CREATE POLICY "FAQs are viewable by everyone"
  ON public.faqs
  FOR SELECT
  USING (deleted = false);

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
-- (정책 없음 = 일반 사용자 접근 불가, service_role은 RLS 우회)
