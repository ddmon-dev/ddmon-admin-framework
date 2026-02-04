-- =============================================
-- 팝업 테이블 (선택)
-- 불필요시 이 파일 삭제
-- =============================================

CREATE TABLE public.popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,                     -- 에디터 HTML (필수)
  author TEXT,                               -- 작성자
  updated_by TEXT,                           -- 수정자
  position_top INTEGER NOT NULL DEFAULT 100, -- 상단 px
  position_left INTEGER NOT NULL DEFAULT 100,-- 좌측 px
  width INTEGER NOT NULL DEFAULT 400,        -- 팝업 너비 px
  is_active BOOLEAN NOT NULL DEFAULT false,  -- 노출 여부
  is_always BOOLEAN NOT NULL DEFAULT false,  -- 항시노출 (기간 무시)
  start_date DATE,                           -- 노출 시작 (현지 날짜 기준)
  end_date DATE,                             -- 노출 종료 (현지 날짜 기준)
  z_index INTEGER NOT NULL DEFAULT 10,       -- 레이어 순서
  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_popups_active ON public.popups (is_active, deleted);
CREATE INDEX idx_popups_date ON public.popups (start_date, end_date);

-- 트리거
CREATE TRIGGER trigger_popups_updated_at
  BEFORE UPDATE ON public.popups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

-- 정책: 활성화된 팝업은 모든 사용자가 조회 가능
CREATE POLICY "Active popups are viewable by everyone"
  ON public.popups
  FOR SELECT
  USING (
    deleted = false
    AND is_active = true
  );

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
