-- Admins 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,                  -- 로그인 아이디 (중복 불가)
  name TEXT NOT NULL,                   -- 실제 이름
  email TEXT NOT NULL UNIQUE,           -- 이메일 (중복 불가)
  password TEXT NOT NULL,               -- bcrypt 해시
  super_admin BOOLEAN DEFAULT false,    -- 슈퍼 관리자 여부
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted BOOLEAN DEFAULT false         -- soft delete
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admins_name ON admins(name);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_deleted ON admins(deleted);

-- updated_at 자동 업데이트 트리거 (공통 함수 사용)
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- admins 테이블은 모든 작업을 서버에서 Service Role Key로만 처리
-- (정책 없음 = 모든 사용자 접근 불가, service_role은 RLS 우회)

-- 초기 슈퍼 관리자 계정 생성
-- 로그인 아이디: admin
-- 비밀번호: admin123 (실제 환경에서는 반드시 변경 필요)
-- bcrypt 해시: $2b$10$... 형태로 저장됨
INSERT INTO admins (id, name, email, password, super_admin)
VALUES (
  'admin',                                                          -- 로그인 아이디
  '관리자',                                                         -- 실제 이름
  'admin@example.com',                                             -- 이메일
  '$2b$10$tOVHNYdWsXrenLRrqr/J2.8d5xC0P4WsmcbZ0z.vyp7GSgoKC1Qvy', -- admin123
  true
)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE admins IS '관리자 계정 테이블';
COMMENT ON COLUMN admins.id IS '로그인 아이디 (고유값)';
COMMENT ON COLUMN admins.name IS '실제 이름';
COMMENT ON COLUMN admins.email IS '이메일 (고유값)';
COMMENT ON COLUMN admins.password IS 'bcrypt 해시 비밀번호';
COMMENT ON COLUMN admins.super_admin IS '슈퍼 관리자 권한 여부';
COMMENT ON COLUMN admins.deleted IS 'soft delete 플래그';
