-- 두 레코드의 order 값을 원자적으로 교환하는 함수
-- Prisma 트랜잭션 대신 Supabase RPC를 사용하여 원자적 처리
CREATE OR REPLACE FUNCTION swap_order(
  p_table_name TEXT,
  p_id1 UUID,
  p_order1 INTEGER,
  p_id2 UUID,
  p_order2 INTEGER
)
RETURNS void AS $$
BEGIN
  -- 동적 SQL로 지정된 테이블의 두 레코드 order 값 교환
  -- CASE 문을 사용하여 단일 UPDATE로 두 값을 동시에 변경
  EXECUTE format(
    'UPDATE %I SET "order" = CASE
      WHEN id = $1 THEN $2
      WHEN id = $3 THEN $4
    END WHERE id IN ($1, $3)',
    p_table_name
  ) USING p_id1, p_order2, p_id2, p_order1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION swap_order IS '두 레코드의 order 값을 원자적으로 교환합니다. manage-modules 순서 변경에 사용됩니다.';
