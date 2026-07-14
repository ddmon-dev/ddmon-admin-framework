-- =============================================
-- 팝업 테이블 템플릿
-- 새 테이블 추가 시 참고 (migrations/00000000000007_popups.sql과 동일 스키마)
-- =============================================

CREATE TABLE public.popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,                     -- 에디터 HTML (필수)
  lang TEXT NOT NULL DEFAULT 'ko',
  author TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
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

-- 인덱스 (어드민 목록: deleted = false AND lang = ? ORDER BY created_at DESC / 공개 조회: is_active + 날짜)
CREATE INDEX idx_popups_deleted_lang_created ON public.popups (deleted, lang, created_at DESC);
CREATE INDEX idx_popups_active ON public.popups (is_active, deleted);
CREATE INDEX idx_popups_date ON public.popups (start_date, end_date);

-- updated_at 자동 업데이트 트리거 (core의 기존 함수 사용)
CREATE TRIGGER trigger_popups_updated_at
  BEFORE UPDATE ON public.popups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

-- 정책: 활성화된 팝업은 모든 사용자가 조회 가능 (날짜 필터링은 클라이언트에서 처리)
CREATE POLICY "Active popups are viewable by everyone"
  ON public.popups
  FOR SELECT
  USING (
    deleted = false
    AND is_active = true
  );

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
-- (정책 없음 = 일반 사용자 접근 불가, service_role은 RLS 우회)
