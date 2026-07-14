-- =============================================
-- 뉴스 테이블 (선택)
-- 불필요시 이 파일 삭제
-- =============================================

CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  lang TEXT NOT NULL DEFAULT 'ko',
  author TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  view_count INTEGER NOT NULL DEFAULT 0,

  -- 파일 메타데이터 저장용 JSONB 컬럼
  -- 구조: { "thumbnail": [...], "attachments": [...] }
  -- 각 파일: { "url": "...", "name": "...", "size": 123, "mimeType": "..." }
  files JSONB DEFAULT '{}'::jsonb,

  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스 (목록 쿼리: deleted = false AND lang = ? ORDER BY created_at DESC)
CREATE INDEX idx_news_files_gin ON public.news USING gin(files);
CREATE INDEX idx_news_deleted_lang_created ON public.news(deleted, lang, created_at DESC);

-- 트리거
CREATE TRIGGER trigger_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (deleted = false인 항목만)
CREATE POLICY "News are viewable by everyone"
  ON public.news
  FOR SELECT
  USING (deleted = false);

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
