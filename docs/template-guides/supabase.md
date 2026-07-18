# Supabase 워크플로우

로컬 개발부터 클라우드 배포까지의 Supabase 사용 가이드.

## 개요

테이블별로 분리된 마이그레이션 구조로, 불필요한 테이블을 쉽게 제거할 수 있습니다.

**폴더 구조:**

```
supabase/
├── migrations/                      # 테이블별 마이그레이션 (스키마만)
│   ├── 00000000000001_core.sql      # 필수: 공통 함수 (swap_sort_order 등)
│   ├── 00000000000002_admins.sql    # 필수: 관리자
│   ├── 00000000000003_notices.sql   # 선택: 공지사항
│   ├── 00000000000004_news.sql      # 선택: 뉴스
│   ├── 00000000000005_faqs.sql      # 선택: FAQ (sort_order 포함)
│   ├── 00000000000006_inquiries.sql # 선택: 문의
│   └── 00000000000007_popups.sql    # 선택: 팝업
├── seed.sql                         # 개발용 목 데이터 (notices, news, faqs, inquiries, inquiry_replies, popups)
├── templates/                       # 새 테이블 추가 시 참고
└── config.toml
```

---

## 명령어

| 명령어                          | 설명                            |
| ------------------------------- | ------------------------------- |
| `npm run db:init`               | Supabase CLI 초기화             |
| `npm run db:start`              | 로컬 Supabase 시작              |
| `npm run db:stop`               | 로컬 Supabase 중지              |
| `npm run db:reset`              | 마이그레이션 + 시드 재적용      |
| `npm run db:migrate:new <name>` | 새 마이그레이션 생성            |
| `npm run db:link`               | 클라우드 프로젝트 연결          |
| `npm run db:push`               | 마이그레이션 클라우드로 푸시    |
| `npm run db:pull`               | 클라우드 스키마 로컬로 가져오기 |
| `npm run db:types`              | 클라우드 기준 타입 생성         |
| `npm run db:types:local`        | 로컬 기준 타입 생성             |

---

## 템플릿 개발/테스트

```bash
npm run db:start
npm run db:reset      # 스키마 + 시드 자동 적용
npm run db:types:local
npm run dev
```

---

## 새 프로젝트 시작

### 1. 템플릿 클론

```bash
git clone <template-repo> my-project
cd my-project
```

### 2. 불필요한 테이블 제거

```bash
# 예: FAQ, 팝업 불필요시
rm supabase/migrations/*_faqs.sql
rm supabase/migrations/*_popups.sql
```

### 3. 시드 데이터 정리

seed.sql에는 notices, news, faqs, inquiries, inquiry_replies, popups 테이블의 개발용 목 데이터가 포함되어 있습니다(한국어 `ko` + 일부 영어 `en` 로우로 다국어 데모 포함).

시드를 추가로 작성할 때 `created_at`은 `NOW() - INTERVAL 'n days'`처럼 행마다 다른 값을 명시하세요. `DEFAULT now()`에 맡기면 같은 트랜잭션의 모든 행이 동일한 타임스탬프를 받아 목록 정렬(`created_at DESC`)이 동률이 되고, 이후 행을 수정할 때 순서가 예기치 않게 바뀔 수 있습니다.

```bash
# 시드 전체 삭제 (프로덕션용)
rm supabase/seed.sql

# 또는 필요한 데이터만 남기기
# supabase/seed.sql 편집
```

### 4. 로컬 환경 시작

```bash
npm run db:start
npm run db:reset
npm run db:types:local
npm run dev
```

---

## 프로덕션 배포

```bash
# 1. Supabase 콘솔에서 프로젝트 생성

# 2. 프로젝트 연결
npm run db:link --project-ref <project-ref>

# 3. 마이그레이션 푸시 (시드 제외)
npm run db:push

# 4. 스토리지 버킷 생성 (콘솔 또는 SQL)

# 5. .env.local을 클라우드 키로 전환

# 6. 타입 재생성
npm run db:types
```

> **Postgres 메이저 버전 정렬**: `config.toml`의 `[db] major_version`은 원격 DB와 같아야 합니다(현재 `17`). 원격 버전은 콘솔 또는 `SHOW server_version;`으로 확인하세요. 다르면 `db:reset`/`db:pull` 시 오류가 납니다.

---

## 기존 프로젝트 참여 (Cloud First)

클라우드에 이미 스키마가 있는 경우.

```bash
# 1. Supabase CLI 초기화
npm run db:init

# 2. 프로젝트 연결
npm run db:link --project-ref <project-ref>

# 3. 클라우드 스키마 가져오기
npm run db:pull

# 4. 로컬 환경 시작
npm run db:start
npm run db:reset

# 5. 타입 생성
npm run db:types:local
```

---

## 유지보수

### 스키마 변경

```bash
# 1. 새 마이그레이션 생성
npm run db:migrate:new add_products_table

# 2. 마이그레이션 파일 작성

# 3. 로컬 테스트
npm run db:reset

# 4. 클라우드 적용
npm run db:push

# 5. 타입 업데이트
npm run db:types
```

### 클라우드 변경사항 동기화

```bash
npm run db:pull
npm run db:reset
npm run db:types:local
```

---

## 환경변수

### 로컬 환경

Supabase CLI가 생성하는 고정 키를 사용합니다. `.env.local.example`에 기본값이 포함되어 있습니다.
클라이언트는 Storage/DB에 직접 접근하지 않으므로 anon(publishable) key는 사용하지 않습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SECRET_KEY=sb_secret_...
```

### 클라우드 환경

Supabase 콘솔 > Settings > API에서 확인합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<service-role-key>
```

---

## 스토리지 버킷

### 로컬

`config.toml`에 버킷을 선언합니다 (버킷 이름은 `.env.local`의 `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME`과 일치해야 합니다):

```toml
[storage.buckets.public-assets]
public = true
file_size_limit = "50MiB"
allowed_mime_types = ["image/*", "application/pdf", "application/zip"]
```

선언 후 생성 명령 실행 (`supabase start`만으로는 생성되지 않음):

```bash
npm run db:reset               # 마이그레이션 + 시드 + 버킷 생성
# 또는 버킷만 생성
npx supabase seed buckets
```

### 클라우드

콘솔에서 수동 생성하거나 SQL로 생성:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  52428800,
  ARRAY['image/*', 'application/pdf', 'application/zip']
);
```

---

## 아키텍처

### 클라이언트 구분

이 프로젝트는 **서버 클라이언트(service role) 하나로 모든 DB/Storage 접근을 처리**합니다.
클라이언트 컴포넌트는 서버 액션만 호출하고 Supabase에 직접 접근하지 않으므로 브라우저 클라이언트가 없습니다.
파일 업로드는 presigned URL(서버 발급), 다운로드는 공개 URL `fetch`로 처리합니다.

| 클라이언트    | 키          | RLS  | 용도                  |
| ------------- | ----------- | ---- | --------------------- |
| Server Client | SERVICE KEY | 우회 | 서버 액션, API 라우트 |

### 파일 구조

```
src/shared/lib/supabase/
├── server.ts      # 서버 클라이언트 (service role)
├── storage.ts     # Presigned URL 발급, 파일 삭제
├── constants.ts   # 버킷명 상수
├── types.ts       # 자동 생성 DB 타입
└── db-helpers.ts  # 타입 헬퍼
```

---

## core.sql 공통 함수

`00000000000001_core.sql`에는 여러 테이블에서 사용하는 공통 함수가 포함되어 있습니다.

| 함수명 | 용도 |
|--------|------|
| `update_updated_at_column()` | 자동 타임스탬프 업데이트 (트리거용) |
| `increment_view_count()` | 조회수 증가 |
| `swap_sort_order()` | 순서 변경 (manage-modules에서 사용) |

### swap_sort_order 함수

두 항목의 sort_order 값을 원자적으로 교환합니다:

```sql
swap_sort_order(
  p_table_name TEXT,   -- 테이블명
  p_id1 UUID,          -- 첫 번째 항목 ID
  p_order1 INTEGER,    -- 첫 번째 항목의 현재 sort_order
  p_id2 UUID,          -- 두 번째 항목 ID
  p_order2 INTEGER     -- 두 번째 항목의 현재 sort_order
)
```

**사용 예:**
```typescript
await supabase.rpc('swap_sort_order', {
  p_table_name: 'faqs',
  p_id1: 'uuid-1',
  p_order1: 3,
  p_id2: 'uuid-2',
  p_order2: 2,
});
```

### sort_order 컬럼 (순서 변경 기능)

순서 변경 기능을 사용하려면 테이블에 `sort_order` 컬럼이 필요합니다:

```sql
sort_order INTEGER NOT NULL DEFAULT 0,
```

인덱스는 실제 목록 쿼리(`deleted = false AND lang = ? [AND category = ?] ORDER BY sort_order`)에 맞춰 **복합 인덱스**로 만드는 것을 권장합니다. 등가 조건 컬럼을 앞에, 정렬 컬럼을 뒤에 둡니다:

```sql
-- 실제 faqs 마이그레이션 예시
CREATE INDEX idx_faqs_deleted_lang_sort ON public.faqs(deleted, lang, sort_order);
```

자세한 사용법: [manage-modules.md](manage-modules.md#순서-변경-기능-enablereorder)

---

## 참고

- [Supabase CLI 문서](https://supabase.com/docs/guides/cli)
- [로컬 개발 가이드](https://supabase.com/docs/guides/cli/local-development)
- [마이그레이션 가이드](https://supabase.com/docs/guides/cli/managing-db-migrations)
