-- =============================================
-- 핵심 함수 (필수)
-- 모든 테이블에서 사용하는 공통 함수
-- =============================================

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'updated_at 컬럼을 자동으로 현재 시간으로 업데이트하는 트리거 함수';


-- 조회수 증가 함수 (홈페이지에서 사용)
-- view_count 컬럼이 있는 테이블에 사용
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


-- 두 레코드의 sort_order 값을 원자적으로 교환하는 함수
-- 관리자 페이지 순서 변경에 사용
CREATE OR REPLACE FUNCTION swap_sort_order(
  p_table_name TEXT,
  p_id1 UUID,
  p_order1 INTEGER,
  p_id2 UUID,
  p_order2 INTEGER
)
RETURNS void AS $$
BEGIN
  -- 동적 SQL로 지정된 테이블의 두 레코드 sort_order 값 교환
  -- CASE 문을 사용하여 단일 UPDATE로 두 값을 동시에 변경
  EXECUTE format(
    'UPDATE %I SET sort_order = CASE
      WHEN id = $1 THEN $2
      WHEN id = $3 THEN $4
    END WHERE id IN ($1, $3)',
    p_table_name
  ) USING p_id1, p_order2, p_id2, p_order1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION swap_sort_order IS '두 레코드의 sort_order 값을 원자적으로 교환합니다. manage-modules 순서 변경에 사용됩니다.';
