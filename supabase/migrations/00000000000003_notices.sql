-- =============================================
-- 공지사항 테이블 (선택)
-- 불필요시 이 파일 삭제
-- =============================================

CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  lang TEXT NOT NULL DEFAULT 'ko',
  author TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT 'normal',
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
CREATE INDEX idx_notices_files_gin ON public.notices USING gin(files);
CREATE INDEX idx_notices_deleted_lang_created ON public.notices(deleted, lang, created_at DESC);

-- 트리거
CREATE TRIGGER trigger_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (deleted = false인 항목만)
CREATE POLICY "Notices are viewable by everyone"
  ON public.notices
  FOR SELECT
  USING (deleted = false);

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
