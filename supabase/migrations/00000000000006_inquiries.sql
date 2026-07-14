-- =============================================
-- 문의 테이블 (선택)
-- 불필요시 이 파일 삭제
-- =============================================

-- 문의 테이블
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,                              -- 회사명
  position TEXT,                             -- 직책
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'answered')),
  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_inquiries_status ON public.inquiries (status, deleted);
CREATE INDEX idx_inquiries_created_at ON public.inquiries (created_at DESC);

-- 트리거
CREATE TRIGGER trigger_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 정책: Service Role만 접근 가능 (RLS 우회)


-- 문의 답변 테이블
CREATE TABLE public.inquiry_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ,                       -- 이메일 발송 시각 (null이면 미발송)
  author TEXT REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_inquiry_replies_inquiry ON public.inquiry_replies (inquiry_id);
CREATE INDEX idx_inquiry_replies_created_at ON public.inquiry_replies (created_at DESC);

-- 트리거
CREATE TRIGGER trigger_inquiry_replies_updated_at
  BEFORE UPDATE ON public.inquiry_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

-- 정책: Service Role만 접근 가능 (RLS 우회)
