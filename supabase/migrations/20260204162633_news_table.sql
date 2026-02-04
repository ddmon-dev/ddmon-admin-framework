-- 테이블 생성 (JSONB files 컬럼 포함)
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,

  -- 파일 메타데이터 저장용 JSONB 컬럼
  -- 구조: { "thumbnail": [...], "attachments": [...] }
  -- 각 파일: { "url": "...", "name": "...", "size": 123, "mimeType": "..." }
  files JSONB DEFAULT '{}'::jsonb,

  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GIN 인덱스 생성 (JSONB 쿼리 성능 향상)
CREATE INDEX idx_news_files_gin ON public.news USING gin(files);

-- 목록 조회 최적화: deleted 필터 + created_at 정렬을 복합 인덱스로 처리
CREATE INDEX idx_news_deleted_created ON public.news(deleted, created_at DESC);

-- updated_at 자동 업데이트 트리거 (기존 함수 사용)
CREATE TRIGGER trigger_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (deleted = false인 항목만)
CREATE POLICY "News are viewable by everyone"
  ON public.news
  FOR SELECT
  USING (deleted = false);

-- 생성/수정/삭제는 서버에서 Service Role Key로만 처리
-- (정책 없음 = 일반 사용자 접근 불가, service_role은 RLS 우회)

-- 목 데이터 20개 삽입
INSERT INTO public.news (title, content, view_count) VALUES
  ('2024년 신년 특별 이벤트 진행', '새해를 맞아 다양한 특별 이벤트를 준비했습니다. 많은 참여 부탁드립니다.', 3421),
  ('서비스 업데이트 안내', '더 나은 사용자 경험을 위해 서비스가 업데이트되었습니다.', 2156),
  ('신규 파트너십 체결 소식', '글로벌 기업과의 전략적 파트너십을 체결하게 되었습니다.', 1876),
  ('모바일 앱 2.0 출시', '완전히 새로워진 모바일 앱 2.0이 출시되었습니다.', 2543),
  ('고객 감사 이벤트 진행', '그동안 저희 서비스를 이용해주신 고객분들께 감사드립니다.', 1234),

  ('분기 실적 발표', '2024년 1분기 실적을 발표합니다.', 987),
  ('새로운 기능 소개: AI 추천 시스템', '인공지능 기반 맞춤 추천 시스템이 도입되었습니다.', 1765),
  ('보안 강화 업데이트', '사용자 정보 보호를 위한 보안이 강화되었습니다.', 1098),
  ('글로벌 진출 소식', '해외 시장 진출을 위한 첫 걸음을 내딛었습니다.', 2345),
  ('사용자 커뮤니티 오픈', '사용자분들이 소통할 수 있는 커뮤니티가 오픈했습니다.', 1432),

  ('환경 캠페인 참여 안내', '지속 가능한 미래를 위한 환경 캠페인에 참여합니다.', 876),
  ('신규 채용 공고', '함께 성장할 인재를 모집합니다.', 654),
  ('서비스 1주년 기념', '서비스 출시 1주년을 맞이했습니다.', 3210),
  ('프리미엄 멤버십 출시', '더 많은 혜택을 담은 프리미엄 멤버십이 출시되었습니다.', 1567),
  ('고객센터 운영 시간 확대', '더 나은 서비스를 위해 고객센터 운영 시간을 확대합니다.', 765),

  ('결제 시스템 개선', '더욱 편리한 결제 시스템으로 개선되었습니다.', 1098),
  ('SNS 채널 오픈 안내', '공식 SNS 채널이 오픈했습니다. 팔로우해주세요!', 2134),
  ('연말 감사 이벤트', '한 해 동안 감사했습니다. 연말 특별 이벤트를 진행합니다.', 1876),
  ('신규 카테고리 추가', '사용자 요청에 따라 새로운 카테고리가 추가되었습니다.', 987),
  ('버그 수정 및 안정화 업데이트', '서비스 안정성 향상을 위한 업데이트가 진행되었습니다.', 543);
