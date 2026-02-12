-- FAQ 게시판 테이블
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  author TEXT,
  author_id TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_by TEXT,
  updated_by_id TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_faqs_deleted ON public.faqs(deleted);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON public.faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON public.faqs(created_at);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_deleted_category_created
  ON public.faqs(deleted, category, created_at DESC);

-- updated_at 자동 업데이트 트리거 (기존 함수 사용)
CREATE TRIGGER trigger_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (deleted = false인 항목만)
CREATE POLICY "FAQs are viewable by everyone"
  ON public.faqs
  FOR SELECT
  USING (deleted = false);

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
-- (정책 없음 = 일반 사용자 접근 불가, service_role은 RLS 우회)
