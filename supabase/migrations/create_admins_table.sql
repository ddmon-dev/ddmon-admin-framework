-- Admins 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,           -- 로그인 아이디 (중복 불가)
  password TEXT NOT NULL,               -- bcrypt 해시
  super_admin BOOLEAN DEFAULT false,    -- 슈퍼 관리자 여부
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted BOOLEAN DEFAULT false         -- soft delete
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admins_name ON admins(name);
CREATE INDEX IF NOT EXISTS idx_admins_deleted ON admins(deleted);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 초기 슈퍼 관리자 계정 생성
-- 비밀번호: admin123 (실제 환경에서는 반드시 변경 필요)
-- bcrypt 해시: $2a$10$... 형태로 저장됨
-- 아래 INSERT는 실제 bcrypt 해시로 교체 필요
INSERT INTO admins (name, password, super_admin)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
  true
)
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE admins IS '관리자 계정 테이블';
COMMENT ON COLUMN admins.name IS '로그인 아이디 (고유값)';
COMMENT ON COLUMN admins.password IS 'bcrypt 해시 비밀번호';
COMMENT ON COLUMN admins.super_admin IS '슈퍼 관리자 권한 여부';
COMMENT ON COLUMN admins.deleted IS 'soft delete 플래그';
