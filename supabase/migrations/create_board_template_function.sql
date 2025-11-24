-- 게시판 템플릿 함수
-- notices 테이블 구조를 기반으로 새로운 게시판 테이블을 자동 생성합니다.
--
-- 사용 예시:
-- SELECT create_board_table('news', false, false);        -- 파일/카테고리 없는 뉴스
-- SELECT create_board_table('events', true, false);       -- 파일 있는 이벤트
-- SELECT create_board_table('announcements', true, true); -- 파일/카테고리 있는 공지
--
-- 주의: 프로토타입용으로만 사용하고, 확정 후에는 마이그레이션 파일로 추출 권장

CREATE OR REPLACE FUNCTION create_board_table(
  table_name TEXT,
  has_files BOOLEAN DEFAULT true,
  has_category BOOLEAN DEFAULT true
) RETURNS void AS $$
DECLARE
  column_defs TEXT;
  files_index TEXT := '';
BEGIN
  -- 선택적 컬럼 구성
  column_defs := '';

  IF has_category THEN
    column_defs := column_defs || 'category TEXT NOT NULL DEFAULT ''normal'', ';
  END IF;

  IF has_files THEN
    column_defs := column_defs || 'files JSONB DEFAULT ''{}''::jsonb, ';
  END IF;

  -- 테이블 생성
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT,
      author TEXT NOT NULL,
      %s
      view_count INTEGER NOT NULL DEFAULT 0,
      "order" INTEGER NOT NULL DEFAULT 0,
      deleted BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )',
    table_name,
    column_defs
  );

  -- 기본 인덱스 생성
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_deleted ON public.%I(deleted)',
    table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_order ON public.%I("order")',
    table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_created_at ON public.%I(created_at)',
    table_name, table_name);

  -- files 컬럼이 있으면 GIN 인덱스 생성
  IF has_files THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_files_gin ON public.%I USING gin(files)',
      table_name, table_name);
  END IF;

  -- updated_at 자동 업데이트 트리거 생성
  EXECUTE format('
    CREATE TRIGGER trigger_%I_updated_at
      BEFORE UPDATE ON public.%I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()',
    table_name, table_name
  );

  -- RLS 활성화
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

  -- SELECT 정책 생성 (deleted = false인 항목만 조회 가능)
  EXECUTE format('
    CREATE POLICY "%I are viewable by everyone"
      ON public.%I
      FOR SELECT
      USING (deleted = false)',
    table_name, table_name
  );

  -- 성공 메시지
  RAISE NOTICE '✓ Table "%" created successfully', table_name;
  RAISE NOTICE '  - has_files: %', has_files;
  RAISE NOTICE '  - has_category: %', has_category;
  RAISE NOTICE '  - Indexes: deleted, order, created_at%',
    CASE WHEN has_files THEN ', files(GIN)' ELSE '' END;
  RAISE NOTICE '  - RLS: Enabled (SELECT policy)';
  RAISE NOTICE '  - Trigger: update_updated_at_column';

END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_board_table(TEXT, BOOLEAN, BOOLEAN) IS
'게시판 테이블 자동 생성 함수. notices 구조 기반. 프로토타입용으로 사용하고 확정 후 마이그레이션 파일로 추출 권장.';
