-- 공통 함수: updated_at 자동 업데이트
-- 모든 테이블에서 사용 가능한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'updated_at 컬럼을 자동으로 현재 시간으로 업데이트하는 트리거 함수';


-- 조회수 증가 함수 (홈페이지에서 사용)
-- newsroom 등 view_count 컬럼이 있는 테이블에 사용

CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, row_id UUID)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET view_count = view_count + 1 WHERE id = $1', table_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT, UUID) TO authenticated;
