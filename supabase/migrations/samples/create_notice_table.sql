-- 테이블 생성 (JSONB files 컬럼 포함)
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'normal',
  view_count INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,

  -- 파일 메타데이터 저장용 JSONB 컬럼
  -- 구조: { "thumbnail": [...], "attachments": [...] }
  -- 각 파일: { "url": "...", "name": "...", "size": 123, "mimeType": "..." }
  files JSONB DEFAULT '{}'::jsonb,

  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GIN 인덱스 생성 (JSONB 쿼리 성능 향상)
CREATE INDEX idx_notices_files_gin ON public.notices USING gin(files);

-- updated_at 자동 업데이트 트리거 (기존 함수 사용)
CREATE TRIGGER trigger_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (deleted = false인 항목만)
CREATE POLICY "Notices are viewable by everyone"
  ON public.notices
  FOR SELECT
  USING (deleted = false);

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
-- (정책 없음 = 일반 사용자 접근 불가, service_role은 RLS 우회)

-- 목 데이터 30개 삽입
INSERT INTO public.notices (title, content, author, category, view_count, "order") VALUES
  ('[중요] 2024년 신년 인사', '새해 복 많이 받으세요! 2024년에도 저희 서비스를 이용해주셔서 감사합니다.', '관리자', 'notice', 1245, 100),
  ('[공지] 시스템 정기 점검 안내', '2024년 1월 15일 02:00~06:00 시스템 정기 점검이 진행됩니다.', '관리자', 'notice', 892, 90),
  ('[공지] 개인정보처리방침 변경 안내', '개인정보처리방침이 2024년 1월 1일부로 변경되었습니다.', '관리자', 'notice', 567, 80),

  ('2024년 1월 이벤트 당첨자 발표', '새해맞이 이벤트에 참여해주신 모든 분들께 감사드립니다.', '이벤트팀', 'normal', 2341, 0),
  ('겨울 시즌 특별 할인 안내', '겨울 시즌을 맞아 다양한 상품을 할인된 가격에 만나보세요.', '마케팅팀', 'normal', 1876, 0),
  ('신규 기능 업데이트 소식', '사용자 편의성을 개선한 새로운 기능들이 추가되었습니다.', '개발팀', 'normal', 1543, 0),
  ('고객센터 운영시간 변경 안내', '2024년부터 고객센터 운영시간이 변경됩니다.', '고객지원팀', 'normal', 987, 0),
  ('모바일 앱 업데이트 안내', '모바일 앱이 버전 2.0으로 업데이트되었습니다.', '개발팀', 'normal', 2156, 0),

  ('회원 등급제도 개편 안내', '더 나은 혜택을 제공하기 위해 회원 등급제도가 개편됩니다.', '관리자', 'normal', 1432, 0),
  ('결제 시스템 개선 완료', '더욱 안전하고 편리한 결제 시스템으로 개선되었습니다.', '개발팀', 'normal', 876, 0),
  ('FAQ 업데이트 안내', '자주 묻는 질문이 업데이트되었습니다.', '고객지원팀', 'normal', 654, 0),
  ('2023년 결산 보고', '2023년 한 해 동안의 성과를 공유합니다.', '경영진', 'normal', 3421, 0),
  ('보안 강화 조치 안내', '회원님들의 정보 보호를 위해 보안이 강화되었습니다.', 'IT보안팀', 'normal', 1098, 0),

  ('배송 정책 변경 안내', '2024년부터 배송 정책이 일부 변경됩니다.', '물류팀', 'normal', 765, 0),
  ('포인트 적립률 변경 안내', '포인트 적립 정책이 변경되었습니다.', '마케팅팀', 'normal', 1234, 0),
  ('서비스 이용약관 개정 안내', '서비스 이용약관이 개정되었습니다.', '법무팀', 'normal', 543, 0),
  ('신규 파트너사 입점 안내', '새로운 파트너사가 입점했습니다.', '제휴팀', 'normal', 892, 0),
  ('고객 만족도 조사 실시', '서비스 개선을 위한 고객 만족도 조사에 참여해주세요.', 'CS팀', 'normal', 456, 0),

  ('연말정산 서류 제출 안내', '연말정산 관련 서류 제출 기한이 다가옵니다.', '인사팀', 'normal', 678, 0),
  ('멤버십 프로그램 런칭', '새로운 멤버십 프로그램이 시작됩니다.', '마케팅팀', 'normal', 1567, 0),
  ('소셜 미디어 채널 오픈', '공식 인스타그램 계정이 오픈했습니다.', '홍보팀', 'normal', 2345, 0),
  ('야간 배송 서비스 시작', '밤 10시까지 주문 시 새벽 배송이 가능합니다.', '물류팀', 'normal', 1876, 0),
  ('리뷰 이벤트 진행', '솔직한 리뷰를 남겨주시면 포인트를 드립니다.', '마케팅팀', 'normal', 1234, 0),

  ('환불 정책 개선 안내', '더욱 간편한 환불 절차로 개선되었습니다.', '고객지원팀', 'normal', 987, 0),
  ('신규 카테고리 추가', '의류, 식품 카테고리가 새롭게 추가되었습니다.', '상품기획팀', 'normal', 1432, 0),
  ('위시리스트 기능 추가', '관심 상품을 위시리스트에 담아보세요.', '개발팀', 'normal', 1098, 0),
  ('프리미엄 회원 혜택 확대', '프리미엄 회원 혜택이 확대되었습니다.', '마케팅팀', 'normal', 2156, 0),
  ('긴급 공지: 서버 장애 복구 완료', '일시적인 서버 장애가 복구되었습니다.', 'IT운영팀', 'normal', 3421, 0),

  ('고객 후기 이벤트 당첨자 발표', '고객 후기 이벤트 당첨자를 발표합니다.', '이벤트팀', 'normal', 876, 0),
  ('무료 배송 이벤트 진행', '3만원 이상 구매 시 무료 배송 이벤트를 진행합니다.', '마케팅팀', 'normal', 1765, 0);
