-- =============================================
-- 문의 테이블 템플릿
-- 새 테이블 추가 시 참고 (migrations/00000000000006_inquiries.sql과 동일 스키마)
-- =============================================

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

-- updated_at 자동 업데이트 트리거 (core의 기존 함수 사용)
CREATE TRIGGER trigger_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 정책: Service Role만 접근 가능 (RLS 우회)
-- 일반 사용자 접근 불가


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

-- updated_at 자동 업데이트 트리거 (core의 기존 함수 사용)
CREATE TRIGGER trigger_inquiry_replies_updated_at
  BEFORE UPDATE ON public.inquiry_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

-- 정책: Service Role만 접근 가능 (RLS 우회)
-- 일반 사용자 접근 불가


-- ============================================================
-- 샘플 데이터
-- created_at은 행마다 다른 값을 명시 — DEFAULT now()는 같은 트랜잭션에서
-- 전부 동일해져 목록 정렬(created_at DESC)이 동률로 불안정해진다.
-- ============================================================

INSERT INTO public.inquiries (name, email, phone, company, position, content, status, created_at) VALUES
('김철수', 'chulsoo.kim@example.com', '010-1234-5678', '테크스타트', '개발팀장', '안녕하세요. 귀사의 서비스 도입을 검토 중입니다. 기업용 요금제와 관련하여 상담을 요청드립니다. 현재 50명 규모의 팀에서 사용할 예정이며, 연간 계약 시 할인 혜택이 있는지 궁금합니다.', 'pending', NOW() - INTERVAL '0 days'),
('이영희', 'younghee.lee@example.com', '010-2345-6789', '글로벌커머스', '마케팅 매니저', '제품 API 연동 관련 기술 문의드립니다. 현재 자사 쇼핑몰과의 연동을 고려하고 있는데, REST API 문서와 샘플 코드를 받아볼 수 있을까요?', 'answered', NOW() - INTERVAL '1 days'),
('박민준', 'minjun.park@example.com', '010-3456-7890', NULL, NULL, '서비스 이용 중 결제 오류가 발생했습니다. 카드 결제 시 결제 실패 메시지가 나타나며 진행이 되지 않습니다. 확인 부탁드립니다.', 'pending', NOW() - INTERVAL '2 days'),
('정수현', 'suhyun.jung@example.com', '010-4567-8901', '대한제조', 'IT팀 과장', '보안 인증 관련 문의입니다. ISO 27001 인증 여부와 데이터 암호화 방식에 대해 알고 싶습니다. 사내 보안 심사를 위해 관련 문서가 필요합니다.', 'pending', NOW() - INTERVAL '3 days'),
('최지은', 'jieun.choi@example.com', NULL, '크리에이티브랩', '디자이너', '대시보드 UI 커스터마이징이 가능한지 문의드립니다. 브랜드 컬러와 로고를 적용하고 싶은데 화이트라벨 옵션이 있나요?', 'answered', NOW() - INTERVAL '4 days'),
('강도윤', 'doyoon.kang@example.com', '010-5678-9012', '파이낸스플러스', '대표이사', '투자 및 파트너십 관련 미팅을 요청드립니다. 귀사의 사업 모델에 관심이 있으며, 협업 가능성에 대해 논의하고 싶습니다.', 'pending', NOW() - INTERVAL '5 days'),
('윤서아', 'seoa.yoon@example.com', '010-6789-0123', '한국대학교', '교수', '교육 기관 할인 프로그램이 있는지 문의드립니다. 수업에서 학생들과 함께 사용할 예정이며, 약 30명 규모입니다.', 'answered', NOW() - INTERVAL '6 days'),
('임재현', 'jaehyun.im@example.com', '010-7890-1234', '디지털에이전시', '기획자', '클라이언트 프로젝트에 서비스를 도입하려고 합니다. 대행사 파트너 프로그램이나 리셀러 제도가 있나요?', 'pending', NOW() - INTERVAL '7 days'),
('한소영', 'soyoung.han@example.com', '010-8901-2345', '헬스케어솔루션', 'CTO', 'HIPAA 및 의료 데이터 규정 준수 여부를 확인하고 싶습니다. 의료 분야에서의 활용 사례도 있다면 공유 부탁드립니다.', 'pending', NOW() - INTERVAL '8 days'),
('오현우', 'hyunwoo.oh@example.com', NULL, NULL, NULL, '무료 체험 기간을 연장할 수 있나요? 현재 평가 중인데 내부 검토에 시간이 더 필요합니다.', 'answered', NOW() - INTERVAL '9 days');
