-- FAQ 테이블에 category 컬럼 추가
ALTER TABLE public.faqs
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_deleted_category_created
  ON public.faqs(deleted, category, created_at DESC);
