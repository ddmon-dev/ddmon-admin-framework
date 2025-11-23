-- 초기 관리자 계정 생성
-- 아이디: admin
-- 비밀번호: admin123
-- bcrypt 해시: $2b$10$tOVHNYdWsXrenLRrqr/J2.8d5xC0P4WsmcbZ0z.vyp7GSgoKC1Qvy

INSERT INTO admins (name, password, super_admin)
VALUES (
  'admin',
  '$2b$10$tOVHNYdWsXrenLRrqr/J2.8d5xC0P4WsmcbZ0z.vyp7GSgoKC1Qvy',
  true
)
ON CONFLICT (name) DO UPDATE SET
  password = EXCLUDED.password,
  super_admin = EXCLUDED.super_admin;
