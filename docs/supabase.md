# Supabase 워크플로우

로컬 개발부터 클라우드 배포까지의 Supabase 사용 가이드.

## 개요

이 템플릿은 SQL 보일러플레이트를 제공합니다. 새 프로젝트에서 `supabase init` 후 템플릿을 복사하여 사용합니다.

**템플릿 구조:**

```
supabase/
├── README.md              # 빠른 시작 가이드
├── config.example.toml    # 로컬 설정 예시
└── templates/             # SQL 보일러플레이트
    ├── 00_common_functions.sql
    ├── 01_admins_table.sql
    └── samples/
```

---

## 명령어

| 명령어                          | 설명                            |
| ------------------------------- | ------------------------------- |
| `npm run db:init`               | Supabase CLI 초기화             |
| `npm run db:start`              | 로컬 Supabase 시작              |
| `npm run db:stop`               | 로컬 Supabase 중지              |
| `npm run db:reset`              | 마이그레이션 재적용             |
| `npm run db:migrate:new <name>` | 새 마이그레이션 생성            |
| `npm run db:link`               | 클라우드 프로젝트 연결          |
| `npm run db:push`               | 마이그레이션 클라우드로 푸시    |
| `npm run db:pull`               | 클라우드 스키마 로컬로 가져오기 |
| `npm run db:types`              | 클라우드 기준 타입 생성         |
| `npm run db:types:local`        | 로컬 기준 타입 생성             |

---

## 새 프로젝트 시작 (Local First)

로컬에서 먼저 개발하고, 나중에 클라우드로 배포하는 방식.

### 1. 초기 설정

```bash
# Supabase CLI 초기화
npm run db:init

# 템플릿 SQL을 마이그레이션으로 복사
cp supabase/templates/00_common_functions.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_common_functions.sql

cp supabase/templates/01_admins_table.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_admins_table.sql
```

### 2. 로컬 환경 시작

```bash
# 로컬 Supabase 시작
npm run db:start

# 환경변수 설정 (로컬 키 기본값 포함)
cp .env.local.example .env.local

# 개발 서버 시작
npm run dev
```

### 3. 클라우드 배포

```bash
# 1. Supabase 콘솔에서 프로젝트 생성

# 2. 프로젝트 연결
npm run db:link --project-ref <project-ref>

# 3. 마이그레이션 푸시
npm run db:push

# 4. 스토리지 버킷 생성 (콘솔 또는 SQL)
# 5. .env.local을 클라우드 키로 전환
# 6. 타입 재생성
npm run db:types
```

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
# supabase/migrations/YYYYMMDDHHMMSS_add_products_table.sql

# 3. 로컬 테스트
npm run db:reset

# 4. 클라우드 적용
npm run db:push

# 5. 타입 업데이트
npm run db:types
```

### 클라우드 변경사항 동기화

클라우드에서 직접 스키마를 변경한 경우:

```bash
npm run db:pull
npm run db:reset
npm run db:types:local
```

---

## 환경변수

### 로컬 환경

Supabase CLI가 생성하는 고정 키를 사용합니다. `.env.local.example`에 기본값이 포함되어 있습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 클라우드 환경

Supabase 콘솔 > Settings > API에서 확인합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key>
SUPABASE_SECRET_KEY=<service-role-key>
```

---

## 스토리지 버킷

### 로컬

`config.toml`에서 자동 생성됩니다:

```toml
[[storage.buckets]]
name = "public-assets"
public = true
file_size_limit = "50MB"
allowed_mime_types = ["image/*", "application/pdf", "application/zip"]
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

## 템플릿 SQL

### 필수

| 파일                      | 설명                                   |
| ------------------------- | -------------------------------------- |
| `00_common_functions.sql` | `updated_at` 자동 업데이트 트리거 함수 |
| `01_admins_table.sql`     | 관리자 계정 테이블 + 초기 계정         |

### 샘플

| 파일                          | 설명                                      |
| ----------------------------- | ----------------------------------------- |
| `notices_table.sql`           | 공지사항 (파일 첨부, 카테고리, 목 데이터) |
| `faqs_table.sql`              | FAQ                                       |
| `board_template_function.sql` | 게시판 테이블 자동 생성 함수              |

---

## 아키텍처

### 클라이언트 구분

| 클라이언트     | 키          | RLS  | 용도                  |
| -------------- | ----------- | ---- | --------------------- |
| Browser Client | ANON KEY    | 적용 | 클라이언트 컴포넌트   |
| Server Client  | SERVICE KEY | 우회 | 서버 액션, API 라우트 |

### 파일 구조

```
src/shared/lib/supabase/
├── client.ts      # 브라우저 클라이언트
├── server.ts      # 서버 클라이언트
├── storage.ts     # Presigned URL 발급, 파일 삭제
├── types.ts       # 자동 생성 DB 타입
└── db-helpers.ts  # 타입 헬퍼
```

---

## 참고

- [Supabase CLI 문서](https://supabase.com/docs/guides/cli)
- [로컬 개발 가이드](https://supabase.com/docs/guides/cli/local-development)
- [마이그레이션 가이드](https://supabase.com/docs/guides/cli/managing-db-migrations)
