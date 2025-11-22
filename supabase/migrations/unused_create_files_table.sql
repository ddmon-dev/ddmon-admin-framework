-- Polymorphic 파일 테이블 생성
-- 모든 테이블(notice, product, post 등)의 파일을 저장하는 공통 테이블

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Polymorphic 관계
  table_name TEXT NOT NULL,
  parent_id UUID NOT NULL,

  -- 파일 정보
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),

  -- 소프트 삭제
  deleted BOOLEAN DEFAULT FALSE,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_files_table ON files(table_name, parent_id) WHERE deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_files_category ON files(table_name, parent_id, category) WHERE deleted = FALSE;

-- 썸네일은 1개만 허용하는 제약 조건
CREATE UNIQUE INDEX IF NOT EXISTS unique_table_thumbnail
  ON files(table_name, parent_id, category)
  WHERE category = 'thumbnail' AND deleted = FALSE;

-- RLS (Row Level Security) 활성화
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능
CREATE POLICY "files_select_policy" ON files
  FOR SELECT USING (deleted = FALSE);

-- 정책: 인증된 사용자만 삽입 가능
CREATE POLICY "files_insert_policy" ON files
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 정책: 인증된 사용자만 업데이트 가능
CREATE POLICY "files_update_policy" ON files
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 정책: 인증된 사용자만 삭제 가능
CREATE POLICY "files_delete_policy" ON files
  FOR DELETE USING (auth.role() = 'authenticated');

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 코멘트 추가
COMMENT ON TABLE files IS 'Polymorphic 파일 테이블 - 모든 테이블의 파일 저장';
COMMENT ON COLUMN files.table_name IS '테이블 이름 (notices, products, posts, users 등) - 실제 테이블명과 일치';
COMMENT ON COLUMN files.parent_id IS '부모 레코드 ID (해당 테이블의 레코드 ID)';
COMMENT ON COLUMN files.category IS '파일 카테고리 (thumbnail, attachments, gallery 등)';
COMMENT ON COLUMN files.original_name IS '원본 파일명 (한글 지원)';
