# Supabase 템플릿

SQL 보일러플레이트와 개발 워크플로우 가이드.

## 폴더 구조

```
supabase/
├── README.md                 # 이 파일
├── config.example.toml       # 로컬 설정 예시
└── templates/                # SQL 템플릿 (마이그레이션용 보일러플레이트)
    ├── 00_common_functions.sql   # 공통 트리거 함수
    ├── 01_admins_table.sql       # 관리자 테이블
    └── samples/                  # 선택적 테이블
        ├── notices_table.sql
        ├── faqs_table.sql
        └── board_template_function.sql
```

---

## 워크플로우

### 1. 새 프로젝트 시작 (Local First)

로컬에서 먼저 개발하고, 나중에 클라우드로 배포하는 방식.

```bash
# 1. Supabase CLI 초기화
npm run db:init

# 2. 템플릿 SQL을 마이그레이션으로 복사 (타임스탬프 추가)
cp supabase/templates/00_common_functions.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_common_functions.sql

cp supabase/templates/01_admins_table.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_admins_table.sql

# 3. 로컬 Supabase 시작
npm run db:start

# 4. 환경변수 설정
cp .env.local.example .env.local
# 로컬 키는 이미 설정되어 있음

# 5. 개발 서버 시작
npm run dev
```

**클라우드 배포:**

```bash
# 1. Supabase 콘솔에서 프로젝트 생성
# 2. 프로젝트 연결
npm run db:link --project-ref <project-ref>

# 3. 마이그레이션 푸시
npm run db:push

# 4. 환경변수를 클라우드 키로 전환
# .env.local 수정

# 5. 타입 재생성
npm run db:types
```

---

### 2. 기존 프로젝트 참여 (Cloud First)

클라우드에 이미 스키마가 있는 경우.

```bash
# 1. Supabase CLI 초기화
npm run db:init

# 2. 프로젝트 연결
npm run db:link --project-ref <project-ref>

# 3. 클라우드 스키마 가져오기
npm run db:pull

# 4. 로컬 Supabase 시작
npm run db:start

# 5. 로컬에 스키마 적용
npm run db:reset

# 6. 타입 생성
npm run db:types:local
```

---

### 3. 유지보수

```bash
# 새 마이그레이션 생성
npm run db:migrate:new add_feature_name

# 마이그레이션 파일 작성 후 로컬 테스트
npm run db:reset

# 클라우드에 적용
npm run db:push

# 타입 업데이트
npm run db:types
```

---

## 템플릿 SQL 설명

### 필수 (00*, 01*)

| 파일                      | 설명                                   |
| ------------------------- | -------------------------------------- |
| `00_common_functions.sql` | `updated_at` 자동 업데이트 트리거 함수 |
| `01_admins_table.sql`     | 관리자 계정 테이블 + 초기 계정         |

### 샘플 (samples/)

| 파일                          | 설명                                           |
| ----------------------------- | ---------------------------------------------- |
| `notices_table.sql`           | 공지사항 (파일 첨부, 카테고리, 목 데이터 포함) |
| `faqs_table.sql`              | FAQ (질문/답변)                                |
| `board_template_function.sql` | 게시판 테이블 자동 생성 함수                   |

---

## 스토리지 버킷

로컬 환경에서 `config.toml`로 버킷이 자동 생성됩니다.
클라우드에서는 Supabase 콘솔에서 수동 생성하거나 SQL로 생성하세요:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  52428800, -- 50MB
  ARRAY['image/*', 'application/pdf', 'application/zip']
);
```

---

## 환경변수

로컬과 클라우드에서 다른 키를 사용합니다.

| 환경     | URL                         | ANON KEY   | SERVICE KEY |
| -------- | --------------------------- | ---------- | ----------- |
| 로컬     | `http://127.0.0.1:54321`    | 고정값     | 고정값      |
| 클라우드 | `https://<ref>.supabase.co` | 프로젝트별 | 프로젝트별  |

로컬 키는 `.env.local.example`에 기본값으로 제공됩니다.
